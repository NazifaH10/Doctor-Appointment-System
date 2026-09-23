import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import appointmentRoutes from './Routes/Appointroutes.js';
import userRoutes from "./Routes/Userroutes.js";
import profileRoutes from "./Routes/ProfileRoute.js";
import doctorRoutes from "./Routes/DoctorsRoute.js";
import notificationRoutes from "./Routes/NotificationRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('MongoDB Connected');
    console.log(
      "Database Name:",
      mongoose.connection.db.databaseName
    );
  })
  .catch(err => console.log(err));

// Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/profile", profileRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes)

app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));