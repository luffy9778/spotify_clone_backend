require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect");
const cookieparser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const PORT = 3500;

// soket.io
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { socketHandler } = require("./utils/socketHandler");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

connectDB();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieparser());

socketHandler(io);

app.use("/auth", require("./routes/auth"));
app.use("/likedsongs", require("./routes/user/likedSongs"));
app.use("/user", require("./routes/user/user"));
app.use("/search", require("./routes/user/search"));

app.use("/songs", require("./routes/admin/song"));
app.use("/playlist", require("./routes/admin/playlist"));
app.use("/artist", require("./routes/admin/artist"));
app.use("/tags", require("./routes/admin/tags"));
app.use("/info", require("./routes/admin/getInfo"));

app.use("*", (req, res) => {
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if ("json") {
    res.json({ message: "404 page not found" });
  } else {
    res.type("text").send("404 page not found");
  }
});

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
});
