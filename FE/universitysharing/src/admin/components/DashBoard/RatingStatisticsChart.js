import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RatingStatisticsChart = ({ ratingStatistics }) => {
  // Kiểm tra xem tất cả giá trị có phải đều là 0 không
  const isEmpty =
    ratingStatistics.poorPercentage === 0 &&
    ratingStatistics.averagePercentage === 0 &&
    ratingStatistics.goodPercentage === 0 &&
    ratingStatistics.excellentPercentage === 0;

  // Nếu không có dữ liệu, hiển thị thông điệp
  if (isEmpty) {
    return (
      <p style={{ textAlign: "center" }}>
        Không có dữ liệu đánh giá nào để hiển thị.
      </p>
    );
  }

  const data = {
    labels: [
      "Thấp (Poor)",
      "Trung bình (Average)",
      "Tốt (Good)",
      "Xuất sắc (Excellent)",
    ],
    datasets: [
      {
        label: "Phần trăm đánh giá",
        data: [
          ratingStatistics.poorPercentage,
          ratingStatistics.averagePercentage,
          ratingStatistics.goodPercentage,
          ratingStatistics.excellentPercentage,
        ],
        backgroundColor: [
          "#FF4D4F", // Poor: Đỏ
          "#FAAD14", // Average: Vàng
          "#52C41A", // Good: Xanh lá
          "#1890FF", // Excellent: Xanh dương
        ],
        borderWidth: 1,
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
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default RatingStatisticsChart;
