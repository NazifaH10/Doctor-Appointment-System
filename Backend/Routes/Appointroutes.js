import express from "express";

import Appointment from "../Models/Appointment.js";
import Notification from "../Models/Notification.js";

import User from "../Models/User.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// =====================================================
// GET ALL APPOINTMENTS - PUBLIC
// =====================================================

router.get("/all", async (req, res) => {
  try {

    const data = await Appointment.find();

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});


// =====================================================
// GET DOCTOR APPOINTMENTS
// =====================================================

router.get(
  "/doctor/:email",
  authMiddleware,
  async (req, res) => {

    try {

      const appointments =
        await Appointment.find({
          doctorEmail: req.params.email,
        });

      res.json(appointments);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);


// =====================================================
// GET BOOKED TIMES
// =====================================================

router.get(
  "/booked-times",
  async (req, res) => {

    try {

      const {
        doctorName,
        appointmentDate,
      } = req.query;


      const appointments =
        await Appointment.find({
          doctorName,
          appointmentDate,
        });


      const bookedTimes =
        appointments.map(
          (item) => item.time
        );


      res.json(bookedTimes);


    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

// =====================================================
// CHECK DAILY APPOINTMENT CAPACITY
// Maximum 10 patients per doctor per day
// =====================================================

router.get("/daily-capacity", async (req, res) => {
  try {
    const { doctorName, appointmentDate } = req.query;

    if (!doctorName || !appointmentDate) {
      return res.status(400).json({
        message: "Doctor name and appointment date are required.",
      });
    }

    const appointmentCount = await Appointment.countDocuments({
      doctorName,
      appointmentDate,
    });

    const MAX_PATIENTS = 6;

    res.json({
      doctorName,
      appointmentDate,
      appointmentCount,
      maxPatients: MAX_PATIENTS,
      remainingPatients: Math.max(
        MAX_PATIENTS - appointmentCount,
        0
      ),
      isFull: appointmentCount >= MAX_PATIENTS,
    });

  } catch (error) {
    console.error("Daily Capacity Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// =====================================================
// CREATE APPOINTMENT
// Maximum 6 patients per doctor per day
// =====================================================

router.post("/", authMiddleware, async (req, res) => {
  try {

    const {
      doctorName,
      appointmentDate,
      time,
    } = req.body;


    // -------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------

    if (
      !doctorName ||
      !appointmentDate ||
      !time
    ) {
      return res.status(400).json({
        message:
          "Doctor, appointment date and time are required.",
      });
    }


    // -------------------------------------------------
    // CHECK DAILY LIMIT
    // -------------------------------------------------

    const MAX_PATIENTS = 6;

    const appointmentCount =
      await Appointment.countDocuments({
        doctorName,
        appointmentDate,
      });


    if (appointmentCount >= MAX_PATIENTS) {

      return res.status(400).json({
        message:
          "This doctor has already reached the maximum of 10 patients for this day. Please select another date.",
        appointmentCount,
        maxPatients: MAX_PATIENTS,
      });

    }


    // -------------------------------------------------
    // CHECK SPECIFIC TIME SLOT
    // -------------------------------------------------

    const existingAppointment =
      await Appointment.findOne({
        doctorName,
        appointmentDate,
        time,
      });


    if (existingAppointment) {

      return res.status(400).json({
        message:
          "This appointment slot is already booked.",
      });

    }


    // -------------------------------------------------
    // CREATE APPOINTMENT
    // -------------------------------------------------

    const newAppointment =
      new Appointment(req.body);


    await newAppointment.save();

    // =================================================
    //       NOTIFICATION → ADMIN
    // =================================================

    const admins =
      await User.find({
        role: "admin",
      });


    for (const admin of admins) {

      await Notification.create({

        recipientEmail:
          admin.email,

        recipientRole:
          "admin",

        title:
          "New Appointment",

        message:
          `${req.body.patientName} booked an appointment with ${req.body.doctorName}.`,

        type:
          "appointment",

        relatedAppointmentId:
          newAppointment._id,

      });

    }


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.status(201).json(newAppointment);


  } catch (err) {

    console.error(
      "Create Appointment Error:",
      err
    );

    res.status(500).json({
      error: err.message,
    });

  }
});

// router.post(
//   "/",
//   authMiddleware,
//   async (req, res) => {

//     try {

//       // -----------------------------------------------
//       // CHECK EXISTING SLOT
//       // -----------------------------------------------

//       const existingAppointment =
//         await Appointment.findOne({
//           doctorName:
//             req.body.doctorName,

//           appointmentDate:
//             req.body.appointmentDate,

//           time:
//             req.body.time,
//         });


//       if (existingAppointment) {

//         return res.status(400).json({
//           message:
//             "This appointment slot is already booked.",
//         });

//       }


//       // -----------------------------------------------
//       // CREATE APPOINTMENT
//       // -----------------------------------------------

//       const newAppointment =
//         new Appointment(req.body);


//       await newAppointment.save();


//       // =================================================
//       // NOTIFICATION → ADMIN
//       // =================================================

//       const admins =
//         await User.find({
//           role: "admin",
//         });


//       for (const admin of admins) {

//         await Notification.create({

//           recipientEmail:
//             admin.email,

//           recipientRole:
//             "admin",

//           title:
//             "New Appointment",

//           message:
//             `${req.body.patientName} booked an appointment with ${req.body.doctorName}.`,

//           type:
//             "appointment",

//           relatedAppointmentId:
//             newAppointment._id,

//         });

//       }


//       // -----------------------------------------------
//       // RESPONSE
//       // -----------------------------------------------

//       res.json(newAppointment);


//     } catch (err) {

//       console.error(
//         "Create Appointment Error:",
//         err
//       );

//       res.status(500).json({
//         error: err.message,
//       });

//     }

//   }
// );


// =====================================================
// GET ALL APPOINTMENTS
// =====================================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const data =
        await Appointment.find();

      res.json(data);

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }

  }
);



// =====================================================
// UPDATE APPOINTMENT STATUS
// =====================================================

router.put(
  "/:id",
  async (req, res) => {

    try {

      // -----------------------------------------------
      // FIND APPOINTMENT
      // -----------------------------------------------

      const appointment =
        await Appointment.findById(
          req.params.id
        );


      if (!appointment) {

        return res.status(404).json({
          message:
            "Appointment not found.",
        });

      }


      const oldStatus =
        appointment.status;

      const newStatus =
        req.body.status;


      // -----------------------------------------------
      // UPDATE STATUS
      // -----------------------------------------------

      appointment.status =
        newStatus;

      await appointment.save();


      // =================================================
      // STATUS → APPROVED
      // =================================================

      if (
        oldStatus !== "approved" &&
        newStatus === "approved"
      ) {


        // ---------------------------------------------
        // PATIENT NOTIFICATION
        // ---------------------------------------------

        if (appointment.email) {

          await Notification.create({

            recipientEmail:
              appointment.email,

            recipientRole:
              "patient",

            title:
              "Appointment Approved",

            message:
              `Your appointment with ${appointment.doctorName} on ${appointment.appointmentDate} at ${appointment.time} has been approved.`,

            type:
              "appointment-approved",

            relatedAppointmentId:
              appointment._id,

          });

        }


        // ---------------------------------------------
        // DOCTOR NOTIFICATION
        // ---------------------------------------------

        if (appointment.doctorEmail) {

          await Notification.create({

            recipientEmail:
              appointment.doctorEmail,

            recipientRole:
              "doctor",

            title:
              "New Appointment Assigned",

            message:
              `You have a new appointment with ${appointment.patientName} on ${appointment.appointmentDate} at ${appointment.time}.`,

            type:
              "appointment-approved",

            relatedAppointmentId:
              appointment._id,

          });

        }

      }


      // =================================================
      // STATUS → COMPLETED
      // =================================================

      if (
        oldStatus !== "completed" &&
        newStatus === "completed"
      ) {

        if (appointment.email) {

          await Notification.create({

            recipientEmail:
              appointment.email,

            recipientRole:
              "patient",

            title:
              "Appointment Completed",

            message:
              `Your appointment with ${appointment.doctorName} has been completed.`,

            type:
              "appointment-completed",

            relatedAppointmentId:
              appointment._id,

          });

        }

      }


      // -----------------------------------------------
      // RESPONSE
      // -----------------------------------------------

      res.json(appointment);


    } catch (error) {

      console.error(
        "Update Appointment Error:",
        error
      );

      res.status(500).json({

        message:
          error.message,

      });

    }

  }
);


// =====================================================
// DELETE APPOINTMENT
// =====================================================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      await Appointment.findByIdAndDelete(
        req.params.id
      );


      res.json({
        message:
          "Appointment Deleted",
      });


    } catch (error) {

      res.status(500).json({

        message:
          "Appointment Deleted",

      });

    }

  }
);


export default router;

