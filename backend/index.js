const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const BodyParser = require("body-parser");
require("dotenv").config();
const app = express();
app.use(
  cors({
    origin: ["https://vnyai.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(BodyParser.json());
const PORT = process.env.PORT || 5000;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
  } catch (err) {
    console.error("Database Connect Error ", err);
  }
};
connect();
app.get("/", (req, res) => {
  res.send("server is running");
});
const chatRouter = require("./routes/chat");
app.use("/api", chatRouter);

app.listen(PORT, () => console.log("server is running on port", PORT));
