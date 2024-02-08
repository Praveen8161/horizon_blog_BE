import express from "express";
import db from "../DataBase/db.js";
import { emailAuthVerify } from "../Auth/auth.js";
import { unlink } from "fs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const file = req.file;

    if (!file)
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

    // Get user from databse
    const userQuery = `select * from users
    where email = ?
    `;

    db.query(userQuery, email, (err, result) => {
      if (err || !result[0])
        return res
          .status(400)
          .json({ acknowledged: false, error: "Error updating Profile Image" });

      const previosImagePath = result[0].profile_image;

      const updateImage = `update users
      set profile_image = ?
      where email = ?
      `;

      // update the image
      db.query(updateImage, [file.path || null, email], (err) => {
        if (err)
          return res
            .status(404)
            .json({ acknowledged: false, error: "Error updating " });
      });

      if (previosImagePath) {
        unlink(previosImagePath, (err) => {
          if (err) {
            console.log("error deleting image file");
          }
        });
      }

      return res
        .status(201)
        .json({ acknowledged: true, profile_image: file.path });
    });

    //
  } catch (err) {
    console.log("Error in Profile Update Blog");
    console.log(err);
  }
});

export const profileImageRouter = router;
