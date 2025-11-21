import e from "express";
import { collectionName, connection } from "./dbconfig.js";
import cors from "cors";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = e();

// Middlewares
app.use(e.json());
app.use(
  cors({
    origin: "https://todo-app-five-mu-17.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());

/* ============================
        LOGIN
=============================== */
app.post("/login", async (req, resp) => {
  const userData = req.body;

  if (!userData.email || !userData.password) {
    return resp.send({
      success: false,
      msg: "Email/Password missing",
    });
  }

  const db = await connection();
  const collection = await db.collection("users");

  const result = await collection.findOne({
    email: userData.email,
    password: userData.password,
  });

  if (!result) {
    return resp.send({
      success: false,
      msg: "User not found",
    });
  }

  // Create JWT
  jwt.sign(
    { email: userData.email },
    "Google",
    { expiresIn: "5d" },
    (error, token) => {
      resp
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        })
        .send({
          success: true,
          msg: "login done",
        });
    }
  );
});

/* ============================
        SIGNUP
=============================== */
app.post("/signup", async (req, resp) => {
  const userData = req.body;

  if (!userData.email || !userData.password) {
    return resp.send({
      success: false,
      msg: "Email/Password missing",
    });
  }

  const db = await connection();
  const collection = await db.collection("users");

  // Check if user exists
  const existing = await collection.findOne({ email: userData.email });

  if (existing) {
    return resp.send({
      success: false,
      msg: "Email already registered",
    });
  }

  const result = await collection.insertOne(userData);

  jwt.sign(
    { email: userData.email },
    "Google",
    { expiresIn: "5d" },
    (error, token) => {
      resp
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        })
        .send({
          success: true,
          msg: "signup done",
        });
    }
  );
});

/* ============================
     JWT VERIFICATION
=============================== */
function verifyJWTToken(req, resp, next) {
  const token = req.cookies["token"];

  if (!token) {
    return resp.status(401).send({
      success: false,
      msg: "No token provided",
    });
  }

  jwt.verify(token, "Google", (error, decoded) => {
    if (error) {
      return resp.status(401).send({
        success: false,
        msg: "Invalid Token",
      });
    }

    req.user = decoded; // IMPORTANT
    next();
  });
}

/* ============================
      ADD TASK (Protected)
=============================== */
app.post("/add-task", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const task = {
    ...req.body,
    userEmail: req.user.email, // from token
  };

  const result = await collection.insertOne(task);

  resp.send({ success: true, result });
});

/* ============================
      GET ALL TASKS (User Only)
=============================== */
app.get("/tasks", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const result = await collection.find({ userEmail: req.user.email }).toArray();

  resp.send({
    success: true,
    result,
  });
});

/* ============================
      GET SINGLE TASK
=============================== */
app.get("/task/:id", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const id = req.params.id;

  const collection = await db.collection(collectionName);

  const result = await collection.findOne({
    _id: new ObjectId(id),
    userEmail: req.user.email,
  });

  if (!result) {
    return resp.send({ success: false, msg: "Task not found" });
  }

  resp.send({ success: true, result });
});

/* ============================
      UPDATE TASK
=============================== */
app.put("/update-task/:id", verifyJWTToken, async (req, resp) => {
  try {
    const db = await connection();
    const id = req.params.id;

    const collection = await db.collection(collectionName);

    const result = await collection.updateOne(
      { _id: new ObjectId(id), userEmail: req.user.email },
      { $set: req.body }
    );

    resp.send({ success: true, result });
  } catch (error) {
    resp.status(500).send({ success: false, msg: "Server Error" });
  }
});

/* ============================
      DELETE TASK
=============================== */
app.delete("/delete/:id", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const id = req.params.id;

  const collection = await db.collection(collectionName);

  const result = await collection.deleteOne({
    _id: new ObjectId(id),
    userEmail: req.user.email,
  });

  resp.send({ success: true, result });
});

/* ============================
      DELETE MULTIPLE
=============================== */
app.delete("/delete-multiple", verifyJWTToken, async (req, resp) => {
  try {
    const db = await connection();
    const collection = await db.collection(collectionName);

    const objectIds = req.body.map((id) => new ObjectId(id));

    const result = await collection.deleteMany({
      _id: { $in: objectIds },
      userEmail: req.user.email,
    });

    resp.send({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    resp.send({
      success: false,
      msg: "Error deleting tasks",
    });
  }
});

// Server Listen
app.listen(3200, () => {
  console.log("Server running on port 3200");
});
