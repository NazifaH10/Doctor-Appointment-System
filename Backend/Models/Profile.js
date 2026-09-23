import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },

        name: String,

        role: String,

        phone: String,

        gender: String,

        address: String,

        age: String,

        bloodGroup: String,

        specialization: String,

        qualification: String,

        experience: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "Profile",
    profileSchema
);