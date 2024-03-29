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
const videoRoomData = new Set();

io.on("connection", (socket) => {
  // -------------------------------- for video Call ----------------------------------------
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", {
      email: email,
      id: socket.id,
      room: room,
    });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("video-request", ({ room, sender, receiver }) => {
    socket.in(room).emit("video-call-request", {
      room: room,
      sender: sender,
      receiver: receiver,
    });
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans, room, sender }) => {
    const obj = {
      room: room,
      callUser: [{ userId: sender, socketId: socket.id }],
    };

    if (videoRoomData.has(obj.room)) {
      obj.callUser.push({ userId: sender, socketId: socket.id });
    } else {
      videoRoomData.add(obj);
    }

    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("join-video-call", ({ room, sender, receiver }) => {
    io.to(receiver).emit("join-video-call", { room, sender, receiver });
  });

  socket.on("cancel-video-call", ({ room }) => {
    io.to(room).emit("cancel-video-call-new");
  });

  socket.on("disconnect-noti", ({ room, sender, receiver }) => {
    io.to(room).emit("user-disconnected");
  });

  socket.on("disconnect-video", ({ room, sender, receiver }) => {
    io.to(room).emit("user-disconnected-video");
  });

  socket.on("call:end", ({ to }) => {
    io.to(to).emit("call:end");
  });

  socket.on("disconnect", () => {
    let temp;
    videoRoomData.forEach((value, key, set) => {
      for (let i = 0; i < value.callUser.length; i++) {
        if (value.callUser[i].socketId === socket.id) {
          temp = value.room;
        }
      }
    });

    if (temp !== undefined) {
      io.to(temp).emit("user-leave");
    }
  });

  // -------------------------------- for One-to-one-chat ------------------------------------

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", ({ sender, receiver, room }) => {
    socket.join(room);
  });

  socket.on("typing", ({ room, sender, receiver }) => {
    io.to(room).emit("typing", {
      room: room,
      sender: sender,
      receiver: receiver,
    });
  });

  socket.on("stop typing", ({ room, sender, receiver }) => {
    io.to(room).emit("stop typing", {
      room: room,
      sender: sender,
      receiver: receiver,
    });
  });

  socket.on("new message", ({ data, room, sender, receiver }) => {
    if (data.msg.personId === data.senderId) return;
    if (!data.msg.chatSenderId && !data.msg.personId) {
      return console.log("Message Sender or chat sender not defined!");
    }

    io.to(room).emit("message recieved", {
      data: data,
      room: room,
      sender: sender,
      receiver: receiver,
    });
  });

  socket.removeListener("setup", (userData) => {
    socket.leave(userData.id);
  });
});
