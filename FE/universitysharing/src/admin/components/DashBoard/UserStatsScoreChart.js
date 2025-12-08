import { Empty, Spin } from "antd";
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const UserStatsScoreChart = () => {
  // Lấy dữ liệu userStatsScore từ Redux
  // Lúc này userStatsScore sẽ có dạng: { labels: [...], data: [...] } do Backend trả về
  const { userStatsScore, loading } = useSelector((state) => state.dashboard);

  // Kiểm tra dữ liệu hợp lệ
  const hasData =
    userStatsScore &&
    userStatsScore.labels &&
    userStatsScore.data &&
    userStatsScore.data.some((val) => val > 0); // Kiểm tra có ít nhất 1 giá trị > 0

  const data = {
    // Sử dụng trực tiếp Labels từ Backend trả về: ["Thấp...", "Trung bình...", "Cao..."]
    labels: userStatsScore?.labels || [],
    datasets: [
      {
        label: "Số lượng người dùng",
        // Sử dụng trực tiếp Data từ Backend: [5, 10, 15]
        data: userStatsScore?.data || [],
        backgroundColor: [
          "#ff4d4f", // Đỏ (Thấp)
          "#faad14", // Vàng (Trung bình)
          "#52c41a", // Xanh (Cao)
        ],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          font: {
            size: 12,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#f0f0f0",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.chart._metasets[context.datasetIndex].total;
            // Tính phần trăm
            const percentage = total > 0 ? Math.round((value / total) * 100) + "%" : "0%";
            return ` ${label}: ${value} người (${percentage})`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="default" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Empty
          description="Chưa có dữ liệu thống kê"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div style={{ height: "300px", width: "100%", padding: "10px" }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default UserStatsScoreChart;