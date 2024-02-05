import express from "express";
import db from "../DataBase/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(404)
        .json({ acknowledged: false, error: "Invalid Credentials" });

    const sqlQuery = `select * from users
          where email = '${email}'
          `;

    db.query(sqlQuery, (err, result) => {
      if (err)
        return res
          .status(404)
          .json({ acknowledged: false, error: "Invalid Credentials" });

      //   TODO -- Nodemailer - Recovery Password

      return res
        .status(201)
        .json({ acknowledged: true, message: "Recovery Email has been Sent" });
    });

    //
  } catch (err) {
    console.log(`Error at Login Router --- Error: ${err}`);
    return res.status(500).json({ error: err.message });
  }
});

export const forgotPassword = router;
