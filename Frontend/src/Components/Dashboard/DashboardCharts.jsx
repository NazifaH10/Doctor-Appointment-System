import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
// import { motion } from "framer-motion";

export default function DashboardChart({
  appointments,
}) {
  // Statistics
  const pending = appointments.filter(
    (a) => a.status === "pending"
  ).length;

  const approved = appointments.filter(
    (a) => a.status === "approved"
  ).length;

  const completed = appointments.filter(
    (a) => a.status === "completed"
  ).length;

  // Pie Chart Data
  const pieData = [
    {
      name: "Pending",
      value: pending,
    },

    {
      name: "Approved",
      value: approved,
    },

    {
      name: "Completed",
      value: completed,
    },
  ];

  // Bar Chart Data
  const barData = [
    {
      name: "Pending",
      total: pending,
    },

    {
      name: "Approved",
      total: approved,
    },

    {
      name: "Completed",
      total: completed,
    },
  ];

  // Colors
  const COLORS = [
    "#facc15",
    "#22c55e",
    "#3b82f6",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* PIE CHART */}
      <div className="bg-gradient-to-br from-white to-blue-300 hover:scale-105 transition-all duration-300 p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6">
          Appointment Status Pie Chart
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="bg-gradient-to-br from-white to-blue-300 hover:scale-105 transition-all duration-300 p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6">
          Appointment Status Bar Chart
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="total"
              fill="#3b82f6"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}