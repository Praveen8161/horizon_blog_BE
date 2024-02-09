import express from "express";
import db from "../DataBase/db.js";
import { emailAuthVerify } from "../Auth/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // It has tokanised email
    const { user_id, email } = req.body;

    if (!(user_id && email))
      return res.status(404).json({ acknowledged: false });
    // It has tokanised email
    const checkedEmail = emailAuthVerify(email);

    if (!checkedEmail.email)
      return res.status(404).json({ acknowledged: false });

    const sqlQuery = `select * from users
      where email = '${checkedEmail.email}'
      `;

    db.query(sqlQuery, (err, result) => {
      if (err) return res.status(404).json({ acknowledged: false });

      const user = result[0];

      if (!(user && user?.email))
        return res.status(404).json({ acknowledged: false });

      return res.status(201).json({ acknowledged: true });
    });
    //
  } catch (err) {
    // console.log(`Error at Check User Router --- Error: ${err}`);
    return res.status(500).json({ error: err.message });
  }
});

export const CheckUserRouter = router;
