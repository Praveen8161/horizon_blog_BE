import express from "express";
import cors from "cors";
import db from "./DataBase/db.js";
import { registerRouter } from "./Routers/registerRouter.js";
import { loginRouter } from "./Routers/loginRouter.js";
import { forgotPassword } from "./Routers/forgotPasswordRouter.js";
import { CheckUserRouter } from "./Routers/checkUser.js";

const app = express();
const PORT = process.env.PORT || 5000;
// Middle wares
app.use(cors());
app.use(express.json());
// Db Connect
db.connect((err) => {
  if (err) throw err;
  console.log("DataBase Connected");
});

// Routers
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/forgot", forgotPassword);
app.use("/checkuser", CheckUserRouter);

// Server Listen
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
