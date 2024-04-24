const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors"); //cors should be in global
const routes = require("./routes/routes");
const multer = require("multer");
const upload = multer();

require("dotenv").config();

app.use(express.json({ limit: '10mb' })); // Add this line
app.use(cors({ limit: '10mb' }));//
app.set("view engine", "ejs"); //To show the html and javascript code in node
app.use(express.urlencoded({ extended: false, limit: '10mb' })); //
// app.use(upload.single("photo"));

const PORT = process.env.PORT || 8081;

// const PORT = 8081;
//const PORT = process.env.PORT || 8081;

const mongoUrl = process.env.mongoUrl;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is up and running on port no ${PORT}`);
});

//mentor id format
//password reset link eka yawana email eka
