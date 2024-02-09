import express from "express";
import db from "../DataBase/db.js";
import { emailAuthVerify } from "../Auth/auth.js";
import { unlink } from "fs";

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { blog_id, blog_title, blog_description, blog_content } = req.body;
    if (!(blog_title && blog_description && blog_content))
      return res
        .status(400)
        .json({ acknowledged: false, error: "Fields are required" });

    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    )
      return res
        .status(400)
        .json({ acknowledged: false, error: "Error updating user Profile" });
    const { email } = emailAuthVerify(req.headers.authorization.split(" ")[1]);

    // Get user from MySQL
    const getUserQuery = `select * from users
     where email = ?
     `;
    db.query(getUserQuery, [email], (err, userResult) => {
      if (err || !userResult[0])
        return res
          .status(404)
          .json({ acknowledged: false, error: "Error updating Post -- user" });

      // Get the previous Blogs details
      const getBlogQuery = `select * from blogposts
         where blog_id = ?
         `;
      db.query(getBlogQuery, [blog_id], (err, blogResult) => {
        if (err || !userResult[0])
          return res.status(404).json({
            acknowledged: false,
            error: "Error updating Post -- blog",
          });

        // Getting a previous file path of the image
        const prevFilePath = blogResult[0].blog_image;

        // Deta of the Current Image
        // if there is no new image and initial value is null
        let image_path = null;
        if (req.file) {
          // If the File exist that means a new image is uploaded
          image_path = req.file.path;
        } else if (req.body.image_path) {
          // if the no new image uploaded but the Initial image path is sended to server
          image_path = req.body.image_path;
        }

        // Updating the new Blog details
        const SQlUpdateBlog = `update blogposts
         set blog_title = ?, 
         blog_description = ?,
         blog_content = ?,
         blog_image = ?
         where blog_id = ?`;

        const values = [
          blog_title,
          blog_description,
          blog_content,
          image_path,
          blog_id,
        ];
        db.query(SQlUpdateBlog, values, (err, updatedBlog) => {
          if (err)
            return res.status(404).json({
              acknowledged: false,
              error: "Error updating Post -- blog update",
            });

          // After updating the Blog and if there is a new image updated or
          // if the Previous Image is removed from user
          // delete the previous image
          if ((req.file || !image_path) && prevFilePath) {
            unlink(prevFilePath, (err) => {
              if (err) {
                console.error("There was an error deleting the file:", err);
              }
            });
          }

          // Getting Data's of Updated Blog
          const getUpdatedBlogQuery = `select * from blogposts
          where blog_id = ?
          `;
          db.query(getUpdatedBlogQuery, blog_id, (err, updatedBlogData) => {
            if (err || !updatedBlogData[0])
              return res.status(404).json({
                acknowledged: false,
                error: "Error updating Post -- blog update",
              });

            return res
              .status(201)
              .json({ acknowledged: true, blog: updatedBlogData[0] });
          });
        });
      });
    });

    //
  } catch (err) {
    // console.log("error in Update User Blog");
    // console.log(err);
    return res
      .status(500)
      .json({ acknowledged: false, error: "internal server error" });
  }
});

export const updateBlogRouter = router;
