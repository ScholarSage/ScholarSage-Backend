const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors"); //cors should be in global
const routes = require("./routes/routes");

require("dotenv").config();

app.use(express.json()); //
app.use(cors()); //
app.set("view engine", "ejs"); //To show the html and javascript code in node
app.use(express.urlencoded({ extended: false })); //

const PORT = process.env.PORT || 8081;

const mongoUrl = process.env.MONGO_URI;

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
