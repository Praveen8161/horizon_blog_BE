import express from "express";
import db from "../DataBase/db.js";
import { emailAuthVerify } from "../Auth/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Check for user Token
    if (
      !(
        req.headers.authorization &&
        req.headers.authorization.startsWith(`Bearer`)
      )
    ) {
      return res
        .status(400)
        .json({ acknowledged: false, error: "Error getting Data --- token" });
    }

    // Untokanizing Email
    const { email } = await emailAuthVerify(
      req.headers.authorization.split(" ")[1]
    );

    if (!email)
      return res
        .status(400)
        .json({ acknowledged: false, error: "Error getting Data ---- email" });

    // Get user Data
    const getUserquery = `select * from users
        where email = "${email}"
        `;
    db.query(getUserquery, (err, result) => {
      if (err || !result[0])
        return res
          .status(400)
          .json({ acknowledged: false, error: "Error getting Data --- user" });

      if (result[0]) {
        // Getting a all the blogs created by the user
        const getUserBlogList = `select * from blogposts
                where user_id = "${result[0].user_id}"
                `;
        db.query(getUserBlogList, (err, blogList) => {
          if (err || !blogList[0])
            return res
              .status(400)
              .json({ acknowledged: false, error: "No Blogs Found" });

          return res.status(201).json({ acknowledged: true, blogList });
        });
      }
    });

    //
  } catch (err) {
    console.log("error in User Blog Post");
    console.log(err);
  }
});

export const userBlogList = router;
