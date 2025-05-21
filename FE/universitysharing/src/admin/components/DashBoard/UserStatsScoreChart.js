import React from "react";
import { useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const UserStatsScoreChart = () => {
  const { userStatsScore } = useSelector((state) => state.dashboard);

  const labels = userStatsScore?.labels || [];
  const dataPoints = userStatsScore?.data || [];

  const data = {
    labels,
    datasets: [
      {
        label: "Phân bổ người dùng",
        data: dataPoints,
        backgroundColor: ["#52c41a", "#ff4d4f"],
        borderColor: ["#fff", "#fff"],
        borderWidth: 2,
        hoverOffset: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "Phân bổ người dùng theo độ uy tín",
        color: "#333",
        font: { size: 16 },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default UserStatsScoreChart;
