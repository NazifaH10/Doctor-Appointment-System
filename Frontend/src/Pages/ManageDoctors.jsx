import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DoctorsTable from "../Components/Share/DoctorsTable";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    // const selectedUser = location.state?.user;
    const fetchUser = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/users/id/${id}`

            );
            setSelectedUser(res.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const [formData, setFormData] = useState({
        userId: "",
        name: "",
        email: "",
        specialization: "",
        qualification: "",
        experience: "",
        chamberDays: [],
        startTime: "",
        endTime: "",
        roomNumber: "",
        consultationFee: "",
        image: "",
    });

    const fetchDoctors = async () => {
        const res = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(res.data);
    };

    useEffect(() => {
        fetchDoctors();
        fetchUser();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            setFormData(prev => ({
                ...prev,
                userId: selectedUser._id,
                name: selectedUser.name,
                email: selectedUser.email,
            }));
        }

    }, [selectedUser]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(formData);
            await axios.post(
                "http://localhost:5000/api/doctors",
                formData
            );

            toast.success("Doctor Added");

            fetchDoctors();

            setFormData({
                userId: selectedUser?._id || "",

                name: selectedUser?.name || "",

                email: selectedUser?.email || "",
                specialization: "",
                qualification: "",
                experience: "",
                chamberDays: [],
                startTime: "",
                endTime: "",
                roomNumber: "",
                consultationFee: "",
                image: "",
            });
            console.log(formData)
            navigate('/manageUsers')

        } catch (error) {
            toast.error("Failed");
        }
    };

    return (
        <div className="p-8">

            <div className="flex">
                <Link to='/dashboard'><button className="bg-black text-white text-2xl p-3 rounded-md"><FaRegArrowAltCircleLeft /></button></Link>
            </div>

            <h1 className="text-3xl font-bold mb-8">
                Manage Doctors
            </h1>

            <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow"
            >

                <input
                    name="name"
                    placeholder="Doctor Name"
                    className="border p-3 rounded"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    readOnly={!!selectedUser}
                />

                <input
                    name="email"
                    placeholder="Email"
                    className="border p-3 rounded"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly={!!selectedUser}
                />

                <input
                    name="specialization"
                    placeholder="Specialization"
                    className="border p-3 rounded"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                />

                <input
                    name="qualification"
                    placeholder="Qualification"
                    className="border p-3 rounded"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                />

                <input
                    name="experience"
                    placeholder="Experience"
                    className="border p-3 rounded"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                />

                {/* <input
                    name="chamberDay"
                    placeholder="Sunday - Thursday"
                    className="border p-3 rounded"
                    value={formData.chamberDay}
                    onChange={handleChange}
                /> */}

                <div className="md:col-span-2">
                    <label className="font-semibold block mb-2">
                        Chamber Days
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                        {[
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                        ].map((day) => (

                            <label
                                key={day}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="checkbox"
                                    value={day}
                                    checked={(formData.chamberDays || []).includes(day)}
                                    onChange={(e) => {

                                        if (e.target.checked) {
                                            
                                            setFormData({
                                                ...formData,
                                                chamberDays: [
                                                    ...(formData.chamberDays || []),
                                                    day,
                                                ],
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                chamberDays:
                                                    (formData.chamberDays || []).filter(
                                                        (item) => item !== day
                                                    ),
                                            });
                                        }
                                    }}
                                />
                                {day}
                            </label>
                        ))}
                    </div>
                </div>

                <input
                    type="time"
                    name="startTime"
                    className="border p-3 rounded"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                />

                <input
                    type="time"
                    name="endTime"
                    className="border p-3 rounded"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                />

                <input
                    name="roomNumber"
                    placeholder="Room Number"
                    className="border p-3 rounded"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    required
                />

                <input
                    name="consultationFee"
                    placeholder="Consultation Fee"
                    className="border p-3 rounded"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    required
                />

                <input
                    name="image"
                    placeholder="Image URL"
                    className="border p-3 rounded"
                    value={formData.image}
                    onChange={handleChange}
                    required
                />

                <button className="bg-blue-600 text-white rounded p-3 col-span-2">
                    Add Doctor
                </button>

            </form>

            <div className="mt-10">
                <DoctorsTable doctors={doctors} fetchDoctors={fetchDoctors} />
            </div>

        </div>
    );
}