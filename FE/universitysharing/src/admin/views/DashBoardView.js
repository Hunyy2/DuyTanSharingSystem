import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Table,
  Typography,
  Divider,
  Spin,
  Radio,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardOverview,
  fetchUserStats,
  fetchReportStats,
  fetchRecentPosts,
  fetchUserTrend,
  fetchInteractionActivity,
  fetchUserStatsScore,
  fetchRatingStatistics, // Thêm action mới
  fetchRideStatusStatistics, // Thêm action mới
} from "../../stores/action/dashboardActions";
import AppHeader from "../components/HeaderBar";
import AppSidebar from "../components/SideBarMenu";
import UserTrendChart from "../components/DashBoard/UserTrendChart";
import InteractionActivityChart from "../components/DashBoard/InteractionActivityChart";
import UserStatsScoreChart from "../components/DashBoard/UserStatsScoreChart";
import RatingStatisticsChart from "../components/DashBoard/RatingStatisticsChart"; // Thêm component mới
import RideStatusStatisticsChart from "../components/DashBoard/RideStatusStatisticsChart"; // Thêm component mới
import { toast } from "react-toastify";

const { Content } = Layout;
const { Title } = Typography;

const columns = [
  {
    title: "Tác giả",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "Nội dung bài viết",
    dataIndex: "content",
    key: "content",
    render: (text) => <span>{text?.replace(/\r\n/g, " ") || ""}</span>,
  },
  {
    title: "Trạng thái",
    dataIndex: "approvalStatus",
    key: "approvalStatus",
    render: (status) => {
      switch (status) {
        case 1:
          return "Đã duyệt";
        case 0:
          return "Chờ duyệt";
        default:
          return "Không xác định";
      }
    },
  },
  {
    title: "Thời gian tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : "-"),
  },
  {
    title: "Số báo cáo",
    dataIndex: "reportCount",
    key: "reportCount",
    render: (count) => count ?? 0,
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    overview,
    recentPosts,
    ratingStatistics,
    rideStatusStatistics,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  const [groupBy, setGroupBy] = useState("day"); // Mặc định nhóm theo ngày

  useEffect(() => {
    dispatch(fetchDashboardOverview());
    dispatch(fetchUserStats());
    dispatch(fetchReportStats());
    dispatch(fetchRecentPosts({ pageNumber: 1, pageSize: 5 }));
    dispatch(fetchUserTrend({ timeRange: "month" }));
    dispatch(fetchInteractionActivity());
    dispatch(fetchUserStatsScore());
    dispatch(fetchRatingStatistics()); // Gọi action mới
    dispatch(fetchRideStatusStatistics({ groupBy })); // Gọi action mới
  }, [dispatch, groupBy]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSidebar />
      <Layout style={{ marginLeft: 200 }}>
        <AppHeader />
        <Content style={{ margin: "20px" }}>
          <Title level={3}>Dashboard</Title>
          {loading ? (
            <div style={{ textAlign: "center", margin: "50px 0" }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Card title="Tổng số người dùng">
                    <Title level={4} style={{ color: "green" }}>
                      {overview?.totalUsers?.toLocaleString() || 0}
                    </Title>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card title="Người dùng bị khóa">
                    <Title level={4} style={{ color: "red" }}>
                      {overview?.totalLockedUsers?.toLocaleString() || 0}
                    </Title>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card title="Báo cáo người dùng">
                    <Title level={4} style={{ color: "orange" }}>
                      {overview?.totalUserReports?.toLocaleString() || 0}
                    </Title>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card title="Báo cáo bài viết">
                    <Title level={4} style={{ color: "orange" }}>
                      {overview?.totalPostReports?.toLocaleString() || 0}
                    </Title>
                  </Card>
                </Col>
              </Row>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title="Xu hướng người dùng">
                    <UserTrendChart />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Hoạt động tương tác">
                    <InteractionActivityChart />
                  </Card>
                </Col>
              </Row>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title="Phân bổ người dùng theo độ uy tín">
                    <UserStatsScoreChart />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Thống kê phần trăm đánh giá chuyến đi">
                    <RatingStatisticsChart
                      ratingStatistics={ratingStatistics}
                    />
                  </Card>
                </Col>
              </Row>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    title="Thống kê số lượng chuyến đi theo trạng thái"
                    extra={
                      <Radio.Group
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                      >
                        <Radio.Button value="day">Theo ngày</Radio.Button>
                        <Radio.Button value="week">Theo tuần</Radio.Button>
                        <Radio.Button value="month">Theo tháng</Radio.Button>
                      </Radio.Group>
                    }
                  >
                    <RideStatusStatisticsChart
                      rideStatusStatistics={rideStatusStatistics}
                    />
                  </Card>
                </Col>
              </Row>

              <Divider />

              <Card title="Bài viết mới từ người dùng">
                <Table
                  dataSource={
                    recentPosts?.map((post) => ({
                      ...post,
                      key: post?.id || Math.random(),
                    })) || []
                  }
                  columns={columns}
                  pagination={false}
                />
              </Card>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
