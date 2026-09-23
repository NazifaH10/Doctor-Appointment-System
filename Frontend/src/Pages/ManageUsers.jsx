import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import toast, { Toaster } from 'react-hot-toast';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

export default function ManageUsers() {
    const [users, setUsers] =
        useState([]);

    const navigate = useNavigate();

    // FETCH USERS
    const fetchUsers = async () => {
        try {
            const res =
                await axios.get(
                    "http://localhost:5000/api/users"
                );

            setUsers(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // UPDATE ROLE
    // const updateRole = async (
    //     id,
    //     role
    // ) => {
    //     try {
    //         await axios.put(
    //             `http://localhost:5000/api/users/${id}`,
    //             { role }
    //         );

    //         toast.success(
    //             "Role Updated"
    //         );

    //         fetchUsers();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const promoteDoctor = async (user) => {

        await axios.put(
            `http://localhost:5000/api/users/${user._id}`,
            {
                role: "doctor"
            }
        );

        toast.success("Doctor Promoted");

        navigate(`/manageDoctors/${user._id}`, {
            state: {
                user,
            },
        });

    }

    return (
        <div className="p-6">

            <div className="flex">
                <Link to='/dashboard'><button className="bg-black text-white text-2xl p-3 rounded-md"><FaRegArrowAltCircleLeft /></button></Link>
            </div>

            <h1 className="text-3xl font-bold m-5">
                Manage Users
            </h1>

            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4">
                                Name
                            </th>

                            <th className="p-4">
                                Email
                            </th>

                            <th className="p-4">
                                Role
                            </th>

                            <th className="p-4">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                className="border-b"
                            >
                                <td className="p-4">
                                    {user.name}
                                </td>

                                <td className="p-4">
                                    {user.email}
                                </td>

                                <td className="p-4 capitalize">
                                    {user.role}
                                </td>

                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() =>
                                            updateRole(
                                                user._id,
                                                "admin"
                                            )
                                        }
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Admin
                                    </button>

                                    {/* <button
                                        // onClick={() =>
                                        //     updateRole(
                                        //         user._id,
                                        //         "doctor"
                                        //     )
                                        // }
                                        onClick={()=>promoteDoctor(user)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                       Promote to Doctor
                                    </button> */}
                                    {user.role !== "doctor" && (
                                        <button
                                            onClick={() => promoteDoctor(user)}
                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                        >
                                            Promote to Doctor
                                        </button>
                                    )}

                                    <button
                                        onClick={() =>
                                            updateRole(
                                                user._id,
                                                "patient"
                                            )
                                        }
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        Patient
                                    </button>
                                    <Toaster />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}