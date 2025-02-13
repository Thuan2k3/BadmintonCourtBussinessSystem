const express = require("express");
const cors = require("cors");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/upload");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();
//Allow All Origins with Default of cor(*)
app.use(cors());

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/staff", require("./routes/staffRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));

app.use("/uploads", express.static("uploads")); // Cho phép truy cập ảnh từ trình duyệt
app.use("/api/v1", uploadRoutes); // Sử dụng route upload

//port
const port = process.env.PORT || 8080;

//listen port
app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});
