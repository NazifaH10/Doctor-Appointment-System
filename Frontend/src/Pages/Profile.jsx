import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
    AuthContext,
} from "../Context/AuthContext";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Profile() {
    const { user, role } =
        useContext(AuthContext);

    const [formData, setFormData] =
        useState({
            email: "",
            name: "",
            role: "",
            phone: "",
            gender: "",
            address: "",
            age: "",
            bloodGroup: "",
            specialization: "",
            qualification: "",
            experience: "",
        });

    const fetchProfile =
        async () => {
            try {
                const res =
                    await axios.get(
                        `http://localhost:5000/api/profile/${user.email}`
                    );

                if (res.data) {
                    setFormData(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

    useEffect(() => {
        if (user?.email) {
            fetchProfile();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            try {
                await axios.post(
                    "http://localhost:5000/api/profile",
                    {
                        ...formData,
                        email: user.email,
                        name:
                            user.displayName ||
                            formData.name,
                        role,
                    }
                );

                toast.success(
                    "Profile Saved"
                );
            } catch (error) {
                console.log(error);

                toast.error(
                    "Save Failed"
                );
            }
        };

    return (
        <div className="max-w-4xl mx-auto p-6">

            <div className="flex">
                <Link to='/dashboard'><button className="bg-black text-white text-2xl p-3 rounded-md"><FaRegArrowAltCircleLeft /></button></Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">

                <h1 className="text-3xl font-bold mb-6">
                    My Profile
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-2 gap-4"
                >
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                    />

                    <select
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                    >
                        <option value="">
                            Select Gender
                        </option>

                        <option value="Male">
                            Male
                        </option>

                        <option value="Female">
                            Female
                        </option>
                    </select>

                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                    />

                    {user?.role === "patient" && (
                        <>
                            <input
                                type="number"
                                name="age"
                                placeholder="Age"
                                value={formData.age || ""}
                                onChange={handleChange}
                                className="border p-3 rounded-lg"
                            />

                            <input
                                type="text"
                                name="bloodGroup"
                                placeholder="Blood Group"
                                value={
                                    formData.bloodGroup || ""
                                }
                                onChange={handleChange}
                                className="border p-3 rounded-lg"
                            />
                        </>
                    )}

                    {role === "doctor" && (
                        <>
                            <input
                                type="text"
                                name="specialization"
                                placeholder="Specialization"
                                value={
                                    formData.specialization ||
                                    ""
                                }
                                onChange={handleChange}
                                className="border p-3 rounded-lg"
                            />

                            <input
                                type="text"
                                name="qualification"
                                placeholder="Qualification"
                                value={
                                    formData.qualification ||
                                    ""
                                }
                                onChange={handleChange}
                                className="border p-3 rounded-lg"
                            />

                            <input
                                type="text"
                                name="experience"
                                placeholder="Experience"
                                value={
                                    formData.experience || ""
                                }
                                onChange={handleChange}
                                className="border p-3 rounded-lg"
                            />
                        </>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-3 rounded-lg col-span-2"
                    >
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    )
}