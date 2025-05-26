import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Thêm plugin

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartDataLabels // Đăng ký plugin
);

const RideStatusStatisticsChart = ({ rideStatusStatistics }) => {
  // Kiểm tra nếu dữ liệu quá ít
  if (rideStatusStatistics.length < 3) {
    return (
      <p style={{ textAlign: "center" }}>
        Dữ liệu quá ít để hiển thị biểu đồ (cần ít nhất 3 ngày dữ liệu).
      </p>
    );
  }

  const data = {
    labels: rideStatusStatistics.map((item) => item.timeLabel),
    datasets: [
      {
        label: "Từ chối (Rejected)",
        data: rideStatusStatistics.map((item) => item.rejectedCount),
        borderColor: "#FF4D4F",
        backgroundColor: "#FF4D4F",
        fill: false,
      },
      {
        label: "Đang đi (Accepted)",
        data: rideStatusStatistics.map((item) => item.acceptedCount),
        borderColor: "#FAAD14",
        backgroundColor: "#FAAD14",
        fill: false,
      },
      {
        label: "Hoàn thành (Completed)",
        data: rideStatusStatistics.map((item) => item.completedCount),
        borderColor: "#52C41A",
        backgroundColor: "#52C41A",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
      datalabels: {
        // Hiển thị giá trị trực tiếp trên điểm dữ liệu
        display: true,
        color: "#000",
        formatter: (value) => (value > 0 ? value : ""), // Chỉ hiển thị nếu giá trị > 0
        anchor: "end",
        align: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
      },
      y: {
        title: {
          display: true,
          text: "Số lượng chuyến đi",
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default RideStatusStatisticsChart;
