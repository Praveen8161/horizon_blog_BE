import express from "express";
import cors from "cors";
import db from "./DataBase/db.js";
import multer from "multer";
import path from "path";
import { registerRouter } from "./Routers/registerRouter.js";
import { loginRouter } from "./Routers/loginRouter.js";
import { forgotPassword } from "./Routers/forgotPasswordRouter.js";
import { CheckUserRouter } from "./Routers/checkUser.js";
import { userProfileUpdateRouter } from "./Routers/userProfileUpdate.js";
import { createBlogRouter } from "./Routers/createBlogRouter.js";
import { singleBlogRouter } from "./Routers/singleBlog.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { userBlogList } from "./Routers/userBlogList.js";
import { deleteBlogRouter } from "./Routers/deleteSingleBlog.js";
import { updateBlogRouter } from "./Routers/updateBlogRouter.js";

const app = express();
const PORT = process.env.PORT || 5000;
// Middle wares
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/user/profile/update", userProfileUpdateRouter);
app.use("/blog/create", upload.single("file"), createBlogRouter);
app.use("/blog/single", singleBlogRouter);
app.use("/user/blogs", userBlogList);
app.use("/user/delete", deleteBlogRouter);
app.use("/blog/update", upload.single("file"), updateBlogRouter);

// Server Listen
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
