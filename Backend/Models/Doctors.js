import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        //     name: {
        //         type: String,
        //         required: true,
        //     },

        //     email: {
        //         type: String,
        //         required: true,
        //         unique: true,
        //     },

        //     specialization: {
        //         type: String,
        //         required: true,
        //     },

        //     qualification: {
        //         type: String,
        //         required: true,
        //     },

        //     experience: {
        //         type: Number,
        //         required: true,
        //     },

        //     chamberDay: {
        //         type: String,
        //         required: true,
        //     },

        //     startTime: {
        //         type: String,
        //         required: true,
        //     },

        //     endTime: {
        //         type: String,
        //         required: true,
        //     },

        //     roomNumber: {
        //         type: String,
        //         required: true,
        //     },

        //     consultationFee: {
        //         type: Number,
        //         required: true,
        //     },

        //     image: {
        //         type: String,
        //         default:
        //             "https://i.pravatar.cc/300",
        //     },

        //     status: {
        //         type: String,
        //         default: "Available",
        //     },
        // },
        // {
        //     timestamps: true,
        userId: {
            type: String
        },
        name: String,
        email: String,
        specialization: String,
        qualification: String,
        experience: String,
        chamberDays: [
            {
                type: String,
            },
        ],
        startTime: String,
        endTime: String,
        roomNumber: String,
        consultationFee: Number,
        image: String,
        status: {
            type: String,
            default: "Available",
        },
    }
);

export default mongoose.model(
    "Doctor",
    doctorSchema
);