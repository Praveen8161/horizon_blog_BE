import express from "express";
import bcrypt from "bcryptjs";
import db from "../DataBase/db.js";
import { emailAuthCreate } from "../Auth/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password))
      return res
        .status(404)
        .json({ acknowledged: false, error: "Invalid Credentials" });

    const sqlQuery = `select * from users
        where email = '${email}'
        `;

    db.query(sqlQuery, (err, result) => {
      if (err && !result[0])
        return res
          .status(404)
          .json({ acknowledged: false, error: "Invalid Credentials" });

      const user = result[0];

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword)
        return res
          .status(404)
          .json({ acknowledged: false, error: "Invalid Credentials" });

      delete user.password;

      user.token = emailAuthCreate(user.email);

      if (result[0].profile_image) {
        result[0].profile_image = result[0].profile_image.replace(/\\/g, "/");
      }

      return res.status(201).json({ acknowledged: true, user });
    });

    //
  } catch (err) {
    console.log(`Error at Login Router --- Error: ${err}`);
    return res.status(500).json({ error: err.message });
  }
});

export const loginRouter = router;
