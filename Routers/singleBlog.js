import express from "express";
import db from "../DataBase/db.js";
import { emailAuthVerify } from "../Auth/auth.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ acknowledged: false, error: "Error getting Blog Post" });
    }

    const sqlBlogGetQuery = `select * from blogposts
    where blog_id = "${id}"
    `;

    db.query(sqlBlogGetQuery, (err, result) => {
      if (err)
        return res.status(400).json({
          acknowledged: false,
          error: "Error getting Blog Post -- no blog found",
        });

      // Updating blog image URL
      if (result[0].blog_image) {
        result[0].blog_image = result[0].blog_image.replace(/\\/g, "/");
      }

      return res.status(201).json({ acknowledged: true, blog: result[0] });
    });

    //
  } catch (err) {
    console.log("error in Single Blog Post");
    console.log(err);
  }
});

export const singleBlogRouter = router;