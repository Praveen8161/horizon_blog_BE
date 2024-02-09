import express from "express";
import { emailAuthVerify } from "../Auth/auth.js";
import db from "../DataBase/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user_name } = req.body;
    if (!user_name)
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
    if (!email)
      return res
        .status(400)
        .json({ acknowledged: false, error: "Invalid Credentials" });

    // Get user from MySQL
    const updateUserQuery = `update users
    set user_name = "${user_name}"
    where email = "${email}"
    `;

    db.query(updateUserQuery, (err, result) => {
      if (err)
        res
          .status(404)
          .json({ acknowledged: false, error: "Invalid Credentials" });

      return res.status(201).json({ acknowledged: true });
    });
    //
  } catch (err) {
    // console.log(`Error at User Profile Update Route --- Error: ${err}`);
    return res
      .status(500)
      .json({ acknowledged: false, error: "internal server error" });
  }
});

export const userProfileUpdateRouter = router;
