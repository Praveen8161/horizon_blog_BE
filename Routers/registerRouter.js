import express from "express";
import db from "../DataBase/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, userName, password } = req.body;
    // Check values
    if (!(email && userName && password))
      return res
        .status(400)
        .json({ acknowledged: false, error: "Fields are required" });

    // Hashing Password
    const bSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, bSalt);

    //   Inserting in Database
    const sqlQuery = `insert into users(email, user_name, password) values (?)`;
    const values = [email, userName, hashPassword];

    db.query(sqlQuery, [values], (error, response) => {
      if (error)
        return res
          .status(500)
          .json({ acknowledged: false, error: "Error Registering Data" });
      return res.status(201).json({
        acknowledged: true,
        message: "User Registered Successfully",
      });

      // //   Newly created user's Id
      // const user_id = response.insertId;
      // //   Get newly created user's details
      // db.query(
      //   `select * from users where user_id = ?`,
      //   [user_id],
      //   (error, results) => {
      //     if (error) return res.status(500).json({acknowledged: false, error: 'New User Created' });
      //     const newUser = results[0];
      //     return res.status(201).json({ newUser });
      //   }
      // );
    });

    //
  } catch (err) {
    // console.log(`Error at Register Router --- Error: ${err}`);
    return res.status(500).json({ acknowledged: false, error: err.message });
  }
});

export const registerRouter = router;
