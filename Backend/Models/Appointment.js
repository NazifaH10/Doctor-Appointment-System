import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientName: String,
  email: String,
  doctorName: String,
  doctorEmail: String,
  appointmentDate: String,
  appointmentDay: String,
  time: String,
  problem: String,
  consultationFee: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    default: "Unpaid"
  },

  paymentMethod: String,

  transactionId: String
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;