import express from "express";
import db from "../DataBase/db.js";
import { emailAuthVerify } from "../Auth/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const file = req.file;

    if (file)
      return res
        .status(400)
        .json({ acknowledged: false, error: "Fields are required" });

    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    )
      return res
        .status(400)
        .json({ acknowledged: false, error: "Error updating Profile Image" });

    const { email } = emailAuthVerify(req.headers.authorization.split(" ")[1]);

    // Get user from MySQL
    const getUserQuery = `select * from users
      where email = ?
      `;

    // Get a user data
    db.query(getUserQuery, email, (err, result) => {
      if (err || !result[0])
        return res
          .status(404)
          .json({ acknowledged: false, error: "Error updating " });

      if (result) {
        const file = req.file;

        // After getting user Data adding blog in MySQL
        const SQLCreateBlog = `insert into blogposts(blog_title, blog_description, blog_content, blog_image, user_id, author) values(?)`;
        const values = [
          blog_title,
          blog_description,
          blog_content,
          file ? file.path : null,
          result[0].user_id,
          result[0].user_name,
        ];
        db.query(SQLCreateBlog, [values], (err, created) => {
          if (err)
            return res
              .status(404)
              .json({ acknowledged: false, error: "Error creating Post" });

          // After Adding blog to MySQL getting the blog data
          const SQLGetBlog = `select * from blogposts
            where blog_id = "${created.insertId}"
            `;
          db.query(SQLGetBlog, (err, result) => {
            if (err)
              return res
                .status(404)
                .json({ acknowledged: false, error: "Error getting Post" });

            if (result[0].blog_image) {
              result[0].blog_image = result[0].blog_image.replace(/\\/g, "/");
            }

            return res
              .status(201)
              .json({ acknowledged: true, blog: result[0] });
          });
        });
      }
    });

    //
  } catch (err) {
    console.log("Error in Profile Update Blog");
    console.log(err);
  }
});

export const profileImageRouter = router;
