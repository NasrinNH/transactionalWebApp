const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
  })
);

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  console.log("development mode");
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "production") {
  console.log("production mode");
}

const DB_String = process.env.DB_STRING.replace(
  "<password>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(DB_String)
  .then(() => console.log("Successfully connected to DataBase"));

const addressSchema = new mongoose.Schema({
  civic: Number,
  street: String,
  city: String,
  country: String,
  postal: String,
});

const Address = mongoose.model("Address", addressSchema);

app.post("/save", (req, res) => {
  console.log(" arg:", req.body);

  const address = new Address({ ...req.body });

  address
    .save()
    .then(() => console.log("Save an Address Success!!!!"))
    .catch((error) => console.error("Save an Address ERROR!!! ->", error));

  res.send(address);
});

app.get("/getall", (_, res) => {
  Address.find({})
    .then((data) => {
      console.log("Get All Address Success!!!");
      res.send(data);
    })
    .catch((error) => console.error("All Address ERROR!!! ->", error));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
