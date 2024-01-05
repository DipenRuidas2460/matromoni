const express = require("express");
const upload = require("express-fileupload");
const app = express();
const cors = require("cors");
require("./config/dbConfig");
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(upload());
const route = require("./routes/route");

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,OPTIONS,PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Accept,X-Access-Token,X-Key,Authorization,X-Requested-With,Origin,Access-Control-Allow-Origin,Access-Control-Allow-Credentials"
  );
  next();
});

app.use("/", route);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is connected at port ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRN_HOST,
  },
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected!");

  // -------------------------------- for video Call ----------------------------------------

  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", {
      email: email,
      id: socket.id,
    });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  // socket.on("video-call", ({ email, to}) => {
  //   io.to(to).emit("video-call-receive", { from: socket.id });
  // });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });



  socket.on("join-video-call", ({ to }) => {
    io.to(to).emit("join-video-call");
  });

  socket.on("cancel-video-call", ({ to }) => {
    io.to(to).emit("cancel-video-call");
  });

  socket.on("call:end", ({ to }) => {
    io.to(to).emit("call:end");
  });

  // -------------------------------- for One-to-one-chat ------------------------------------

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", ({sender, receiver, room}) => {
    socket.join(room);
    socket.emit("room joined", room);
  });


  socket.on("video-call-request", ({ sender, receiver }) => {
    console.log(sender)
    // io.to(to).emit("video-call-request", { from: socket.id, email: email });
    socket.emit('video-call-request', {sender: sender, receiver: receiver})
  });

  socket.on("typing", ({room, receiver}) => {
    socket.in(room).emit("typing", {room: room, receiver: receiver});
  });
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    if (newMessageRecieved.msg.personId === newMessageRecieved.senderId) return;
    if (
      !newMessageRecieved.msg.chatSenderId &&
      !newMessageRecieved.msg.personId
    ) {
      return console.log("Message Sender or chat sender not defined!");
    }

    socket
      .in(newMessageRecieved.chatId)
      .emit("message recieved", newMessageRecieved);
  });

  socket.removeListener("setup", (userData) => {
    console.log("User Disconnected!");
    socket.leave(userData.id);
  });
});
