// Filename: server.js
const express = require("express");
const dotenv = require("dotenv");
const connDB = require("./database/db");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const { userRouter, authRouter } = require("./routers/index");
const { createServer } = require("http");
const { Server } = require("socket.io");

const allowedOrigins = [
    process.env.VITE_FRONTEND_URL || "*",
];

const app = express();
dotenv.config();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});

app.set("io", io);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


app.use(express.json());
app.use(cookieparser());

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
connDB();

app.use("/auth", authRouter);
app.use("/user", userRouter);
