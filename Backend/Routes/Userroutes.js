import express from "express";

import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// CREATE USER
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role = "patient",
    } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = new User({
      name,
      email,
      phone,
      role,
    });

    await newUser.save();

    res.status(201).json(newUser);

  } catch (error) {
    console.error("Create User Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// GET ALL USERS
router.get("/", async (req, res) => {
  const users = await User.find();

  res.json(users);
});

// UPDATE ROLE
router.put("/:id", async (req, res) => {
  const updated =
    await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      // { new: true }
      {
        returnDocument: "after",
      }
    );

  res.json(updated);
});

// GET DOCTORS
router.get("/doctors", async (req, res) => {
  try {
    // console.log("Route hit");

    const data = await User.find({
      role: "doctor",
    });

    // console.log(data);

    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

// GET ALL PATIENT
router.get("/patients", authMiddleware, async (req, res) => {
  try {
    // console.log("Route hit");

    const data = await User.find({
      role: "patient",
    });

    // console.log(data);

    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

// Get User by ID
router.get("/id/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET USER BY EMAIL
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;