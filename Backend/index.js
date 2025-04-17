const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");

require("dotenv").config();

const { Seat_Route } = require("./routes/Seat.route");


let app = express();
app.use(express.json());
app.use(cors());





app.use("/seat", Seat_Route);











//get


app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connected to the db");
  } catch (error) {
    console.log(error);
  }
  console.log(`server running on ${process.env.port} `);
});
