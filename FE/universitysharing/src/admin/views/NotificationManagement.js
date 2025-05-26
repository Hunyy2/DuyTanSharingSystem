import React, { useEffect } from "react";
import { Layout, Table, Tag, Typography, Spin, Alert } from "antd";
import moment from "moment";
import AppHeader from "../components/HeaderBar";
import AppSidebar from "../components/SideBarMenu";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../stores/action/adminActions";

const { Title } = Typography;
const { Header, Content } = Layout;

const NotificationAdmin = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(
    (state) => state.reportAdmintSlice
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ride ID",
      dataIndex: "rideId",
      key: "rideId",
      render: (text) => <span>{text.slice(0, 8)}...</span>,
    },
    {
      title: "Tên hành khách",
      dataIndex: "namePassenger",
      key: "namePassenger",
      render: (text) => <span>{text || "Không có"}</span>,
    },
    {
      title: "Tên tài xế",
      dataIndex: "nameDriver",
      key: "nameDriver",
      render: (text) => <span>{text || "Không có"}</span>,
    },
    {
      title: "Số điện thoại hành khách",
      dataIndex: "phonePassenger",
      key: "phonePassenger",
      render: (text) => <span>{text || "Không có"}</span>,
    },
    {
      title: "Số điện thoại tài xế",
      dataIndex: "phoneDriver",
      key: "phoneDriver",
      render: (text) => <span>{text || "Không có"}</span>,
    },
    {
      title: "SĐT người thân hành khách",
      dataIndex: "relativePhonePassenger",
      key: "relativePhonePassenger",
      render: (text) => <span>{text || "Không có"}</span>,
    },
    {
      title: "SĐT người thân tài xế",
      dataIndex: "relativePhoneDriver",
      key: "relativePhoneDriver",
      render: (text) => <span>{text || "Không có"}</span>,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Loại cảnh báo",
      dataIndex: "alertType",
      key: "alertType",
      render: (type) => (
        <Tag color={type === 0 ? "red" : "orange"}>
          {type === 0 ? "Nghiêm trọng" : "Cảnh báo"}
        </Tag>
      ),
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSidebar />
      <Layout>
        <AppHeader />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: 280,
            marginLeft: 200,
          }}
        >
          <Title level={2}>Thông báo chuyến đi</Title>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: "16px" }}
            />
          )}
          {loading ? (
            <Spin
              size="large"
              style={{ display: "block", margin: "50px auto" }}
            />
          ) : (
            <Table
              columns={columns}
              dataSource={notifications}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default NotificationAdmin;
