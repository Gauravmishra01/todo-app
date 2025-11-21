import e from "express";
import { collectionName, connection } from "./dbconfig.js";
import cors from "cors";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = e();

/* ============================
    GLOBAL MIDDLEWARES
=============================== */
app.use(e.json());
app.use(
  cors({
    origin: "https://todo-app-five-mu-17.vercel.app", // your Vercel frontend
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
        secure: true,          // REQUIRED for Vercel + Render
        sameSite: "none",      // REQUIRED for cross-site cookies
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
    JWT VERIFICATION
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
    ADD TASK (Protected)
=============================== */
app.post("/add-task", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const newTask = {
    ...req.body,
    userEmail: req.user.email,
  };

  const result = await collection.insertOne(newTask);
  resp.send({ success: true, result });
});

/* ============================
    GET TASKS (Protected)
=============================== */
app.get("/tasks", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const tasks = await collection
    .find({ userEmail: req.user.email })
    .toArray();

  resp.send({ success: true, result: tasks });
});

/* ============================
    GET SINGLE
=============================== */
app.get("/task/:id", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const task = await collection.findOne({
    _id: new ObjectId(req.params.id),
    userEmail: req.user.email,
  });

  if (!task) return resp.send({ success: false, msg: "Task not found" });

  resp.send({ success: true, result: task });
});

/* ============================
    UPDATE TASK
=============================== */
app.put("/update-task/:id", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const result = await collection.updateOne(
    { _id: new ObjectId(req.params.id), userEmail: req.user.email },
    { $set: req.body }
  );

  resp.send({ success: true, result });
});

/* ============================
    DELETE TASK
=============================== */
app.delete("/delete/:id", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const result = await collection.deleteOne({
    _id: new ObjectId(req.params.id),
    userEmail: req.user.email,
  });

  resp.send({ success: true, result });
});

/* ============================
    DELETE MULTIPLE
=============================== */
app.delete("/delete-multiple", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const ids = req.body.map((id) => new ObjectId(id));

  const result = await collection.deleteMany({
    _id: { $in: ids },
    userEmail: req.user.email,
  });

  resp.send({ success: true, deletedCount: result.deletedCount });
});

/* ============================
    START SERVER
=============================== */
app.listen(3200, () => {
  console.log("Server running on port 3200");
});

