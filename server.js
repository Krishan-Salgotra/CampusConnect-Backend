const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(
    "User Connected:",
    socket.id
  );

  socket.on(
    "joinProject",
    (projectId) => {
      socket.join(projectId);

      console.log(
        `Joined room ${projectId}`
      );
    }
  );

  socket.on("disconnect", () => {
    console.log(
      "User Disconnected:",
      socket.id
    );
  });
});

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/profile",
  require("./routes/profileRoutes")
);

app.use(
  "/api/projects",
  require("./routes/projectRoutes")
);

app.use(
  "/api/requests",
  require("./routes/requestRoutes")
);

app.use(
  "/api/messages",
  require("./routes/messageRoutes")
);

app.use(
  "/api/notifications",
  require(
    "./routes/notificationRoutes"
  )
);

app.use(
  "/api/users",
  require("./routes/userRoutes")
);

app.get("/", (req, res) => {
  res.send(
    "CampusConnect API Running"
  );
});

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});