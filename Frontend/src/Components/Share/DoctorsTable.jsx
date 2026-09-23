import axios from "axios";
import toast from "react-hot-toast";

export default function DoctorsTable({
    doctors,
    fetchDoctors,
}) {

    const deleteDoctor = async (id) => {

        if (!window.confirm("Delete doctor?")) return;

        await axios.delete(
            `http://localhost:5000/api/doctors/${id}`
        );

        toast.success("Deleted");

        fetchDoctors();

    };

    return (

        <div className="overflow-x-auto bg-white rounded-xl shadow">

            <table className="table w-full">

                <thead className="bg-blue-600 text-white">

                    <tr>

                        <th>Name</th>

                        <th>Specialization</th>

                        <th>Day</th>

                        <th>Time</th>

                        <th>Fee</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {doctors.map((doctor) => (

                        <tr key={doctor._id}>

                            <td>{doctor.name}</td>

                            <td>{doctor.specialization}</td>

                            <td>{doctor.chamberDay}</td>

                            <td>
                                {doctor.startTime} - {doctor.endTime}
                            </td>

                            <td>
                                ৳{doctor.consultationFee}
                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        deleteDoctor(doctor._id)
                                    }
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}