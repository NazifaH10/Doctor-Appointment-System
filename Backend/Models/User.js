import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  role: {
    type: String,
    enum: ['admin', 'doctor', 'patient'],
    default: "patient",
  },
});

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;