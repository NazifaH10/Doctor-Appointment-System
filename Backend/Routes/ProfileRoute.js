import express from "express";
import Profile from "../Models/Profile.js";
import User from "../Models/User.js";

const router = express.Router();


// GET PROFILE
router.get("/:email", async (req, res) => {
    try {
        const profile =
            await Profile.findOne({
                email: req.params.email,
            });

        res.json(profile);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// CREATE OR UPDATE PROFILE
router.post("/", async (req, res) => {
    try {
        const existing =
            await Profile.findOne({
                email: req.body.email,
            });

        if (existing) {
            const updated =
                await Profile.findOneAndUpdate(
                    {
                        email: req.body.email,
                    },
                    req.body,
                    {
                        returnDocument: "after",
                    }
                );

            return res.json(updated);
        }

        const profile =
            new Profile(req.body);

        await profile.save();

        // console.log("Received Profile:");
        // console.log(req.body);

        res.json(profile);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

export default router;