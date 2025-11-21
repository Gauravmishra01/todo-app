import express from "express";
import { collectionName, connection } from "./dbconfig.js";
import cors from "cors";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

/* ============================
    GLOBAL MIDDLEWARES
=============================== */
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://todo-app-five-mu-17.vercel.app", // ✔ Correct frontend
      "http://localhost:5173"                    // ✔ Local development
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

/* ============================
    LOGIN
=============================== */
app.post("/login", async (req, resp) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return resp.send({ success: false, msg: "Email/Password missing" });
  }

  const db = await connection();
  const collection = await db.collection("users");

  const user = await collection.findOne({ email, password });

  if (!user) {
    return resp.send({ success: false, msg: "Invalid email/password" });
  }

  jwt.sign({ email }, "Google", { expiresIn: "5d" }, (error, token) => {
    resp
      .cookie("token", token, {
        httpOnly: true,
        secure: true,        // ✔ Required for Vercel+Render HTTPS
        sameSite: "none",    // ✔ Required for cross-site cookies
      })
      .send({ success: true, msg: "Login successful" });
  });
});

/* ============================
    SIGNUP
=============================== */
app.post("/signup", async (req, resp) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return resp.send({ success: false, msg: "Email/Password missing" });
  }

  const db = await connection();
  const collection = await db.collection("users");

  const existing = await collection.findOne({ email });
  if (existing) {
    return resp.send({ success: false, msg: "Email already registered" });
  }

  await collection.insertOne({ email, password });

  jwt.sign({ email }, "Google", { expiresIn: "5d" }, (error, token) => {
    resp
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send({ success: true, msg: "Signup successful" });
  });
});

/* ============================
    JWT VERIFY
=============================== */
function verifyJWTToken(req, resp, next) {
  const token = req.cookies.token;

  if (!token) {
    return resp.status(401).send({ success: false, msg: "Not logged in" });
  }

  jwt.verify(token, "Google", (error, decoded) => {
    if (error) {
      return resp.status(401).send({ success: false, msg: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

/* ============================
    ADD TASK
=============================== */
app.post("/add-task", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.col
