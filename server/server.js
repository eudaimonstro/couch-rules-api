require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const { env } = require("process");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
// Create a database variable outside of the database connection callback to reuse the connection pool in your app.

var mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/test";
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const port = process.env.PORT || 8080;

app.use(cors());

app.use(bodyParser.json());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

var motionsRouter = require("./routes/motions")(io);

app.use("/api/v1/motions", motionsRouter);

app.listen(port, () => {
  console.log("Server started on port " + port);
});

module.exports = {
  app,
};
