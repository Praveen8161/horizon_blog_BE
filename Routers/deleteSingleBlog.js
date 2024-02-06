import express from "express";
import db from "../DataBase/db.js";
import { emailAuthVerify } from "../Auth/auth.js";

const router = express.Router();

router.delete("/", async (req, res) => {
  try {
    const { blog_id } = req.body;
    if (
      !(
        blog_id &&
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
    ) {
      return res
        .status(400)
        .json({ acknowledged: false, error: "Error getting Data" });
    }

    // untokanizing user email
    const { email } = emailAuthVerify(req.headers.authorization.split(" ")[1]);

    const getUserQuery = `select * from users
        where email = "${email}"
        `;

    db.query(getUserQuery, (err, result) => {
      if (err || !result[0]) {
        return res
          .status(400)
          .json({ acknowledged: false, error: "Error getting Data -- user" });
      }

      if (result[0]) {
        // deleting the blog
        const deleteBlogQuery = `delete from blogposts 
                where blog_id = "${blog_id}"
                `;
        db.query(deleteBlogQuery, (err, del) => {
          if (err)
            return res
              .status(400)
              .json({ acknowledged: false, error: "Error deleting data" });
        });

        return res.status(201).json({ acknowledged: true });
      }
    });
  } catch (err) {
    console.log("error in Delete User Blog");
    console.log(err);
  }
});

export const deleteBlogRouter = router;
