import express from "express";
import Notification from "../Models/Notification.js";

const router = express.Router();


// =====================================================
// GET USER NOTIFICATIONS
// =====================================================

router.get(
    "/user/:email",
    async (req, res) => {

        try {

            const notifications =
                await Notification.find({
                    recipientEmail:
                        req.params.email,
                })
                    .sort({
                        createdAt: -1,
                    });


            res.json(notifications);

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });

        }

    }
);


// =====================================================
// GET UNREAD COUNT
// =====================================================

router.get(
    "/user/:email/unread-count",
    async (req, res) => {

        try {

            const count =
                await Notification.countDocuments({
                    recipientEmail:
                        req.params.email,

                    isRead: false,
                });


            res.json({
                count,
            });

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });

        }

    }
);


// =====================================================
// MARK ONE AS READ
// =====================================================

router.put(
    "/:id/read",
    async (req, res) => {

        try {

            const updated =
                await Notification.findByIdAndUpdate(
                    req.params.id,

                    {
                        isRead: true,
                    },

                    {
                        returnDocument: "after",
                    }
                );


            res.json(updated);

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });

        }

    }
);


// =====================================================
// MARK ALL AS READ
// =====================================================

router.put(
    "/user/:email/read-all",
    async (req, res) => {

        try {

            await Notification.updateMany(

                {
                    recipientEmail:
                        req.params.email,

                    isRead: false,
                },

                {
                    $set: {
                        isRead: true,
                    },
                }

            );


            res.json({

                message:
                    "All notifications marked as read",

            });

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });

        }

    }
);


// =====================================================
// DELETE NOTIFICATION
// =====================================================

router.delete(
    "/:id",
    async (req, res) => {

        try {

            await Notification.findByIdAndDelete(
                req.params.id
            );


            res.json({

                message:
                    "Notification deleted",

            });

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });

        }

    }
);


export default router;
// import express from "express";
// import Notification from "../Models/Notification.js";

// const router = express.Router();

// // ==========================================
// // GET UNREAD COUNT
// // ==========================================

// router.get("/:email/unread-count", async (req, res) => {
//     try {

//         const count = await Notification.countDocuments({
//             recipientEmail: req.params.email,
//             isRead: false,
//         });

//         res.json({
//             count,
//         });

//     } catch (error) {

//         res.status(500).json({
//             message: error.message,
//         });

//     }
// });


// // ==========================================
// // GET NOTIFICATIONS FOR A USER
// // ==========================================

// router.get("/:email", async (req, res) => {
//     try {

//         const notifications = await Notification.find({
//             recipientEmail: req.params.email,
//         })
//             .sort({ createdAt: -1 });

//         res.json(notifications);

//     } catch (error) {

//         res.status(500).json({
//             message: error.message,
//         });

//     }
// });

// // ==========================================
// // MARK ONE NOTIFICATION AS READ
// // ==========================================

// router.put("/:id/read", async (req, res) => {
//     try {

//         const updated =
//             await Notification.findByIdAndUpdate(
//                 req.params.id,
//                 {
//                     isRead: true,
//                 },
//                 {
//                     returnDocument: "after",
//                 }
//             );

//         res.json(updated);

//     } catch (error) {

//         res.status(500).json({
//             message: error.message,
//         });

//     }
// });


// // ==========================================
// // MARK ALL NOTIFICATIONS AS READ
// // ==========================================

// router.put("/user/:email/read-all", async (req, res) => {
//     try {

//         await Notification.updateMany(
//             {
//                 recipientEmail: req.params.email,
//                 isRead: false,
//             },
//             {
//                 $set: {
//                     isRead: true,
//                 },
//             }
//         );

//         res.json({
//             message: "All notifications marked as read",
//         });

//     } catch (error) {

//         res.status(500).json({
//             message: error.message,
//         });

//     }
// });


// // ==========================================
// // DELETE NOTIFICATION
// // ==========================================

// router.delete("/:id", async (req, res) => {
//     try {

//         await Notification.findByIdAndDelete(
//             req.params.id
//         );

//         res.json({
//             message: "Notification deleted",
//         });

//     } catch (error) {

//         res.status(500).json({
//             message: error.message,
//         });

//     }
// });


// export default router;