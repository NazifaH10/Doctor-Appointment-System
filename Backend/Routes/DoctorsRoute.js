import express from "express";
import Doctor from "../Models/Doctors.js";

const router = express.Router();

/* Add Doctor */

router.post("/", async (req, res) => {
    try {

        const exists = await Doctor.findOne({
            email: req.body.email,
        });

        if (exists) {
            return res.status(400).json({
                message: "Doctor profile already exists",
            });
        }

        const doctor = new Doctor(req.body);

        // console.log(doctor)
        await doctor.save();

        res.json(doctor);
    } catch (err) {
        res.status(500).json({
            message: error.message,
        });
    }
});

/* Get All Doctors */

router.get("/", async (req, res) => {
    try {
        const doctors = await Doctor.find();

        res.json(doctors);
    } catch (err) {
        res.status(500).json(err);
    }
});

/* Update Doctor */

router.put("/:id", async (req, res) => {
    try {
        const doctor =
            await Doctor.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    returnDocument: "after",
                }
            );

        res.json(doctor);
    } catch (err) {
        res.status(500).json(err);
    }
});

/* Delete Doctor */

router.delete("/:id", async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Doctor Deleted",
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;