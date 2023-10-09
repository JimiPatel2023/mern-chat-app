const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/connectToDB");
const dotenv = require("dotenv").config();
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");

const app = express();
app.use(express.json());
app.use(
  cors({
    methods: ["POST", "GET", "PUT", "DELETE"],
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server started on", process.env.PORT);
});
