import React, { useEffect, useCallback, useState } from "react";
import {
  Layout,
  Card,
  Typography,
  message,
  Spin,
  Row,
  Col,
  Tabs,
  Button,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AppHeader from "../components/HeaderBar";
import AppSidebar from "../components/SideBarMenu";
import { fetchRideDetails } from "../../stores/action/adminActions";
import { clearRideState } from "../../stores/reducers/adminReducer";
import { userProfile } from "../../stores/action/profileActions";
import "../../admin/styles/AdminRideDetails.scss";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

// Define custom icons with colors only
const driverIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  className: "driver-marker",
});

const passengerIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  className: "passenger-marker",
});

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminRideDetails = () => {
  const { rideId } = useParams();
  const dispatch = useDispatch();
  const [showMap, setShowMap] = useState(false);
  const [activeTab, setActiveTab] = useState("both");

  const usersState = useSelector((state) => state.users || {});
  const { users } = usersState;
  const reportAdminSlice = useSelector(
    (state) => state.reportAdmintSlice || {}
  );
  const { rideDetails, loading, error, success } = reportAdminSlice;

  // Da Nang bounds
  const daNangBounds = L.latLngBounds(
    L.latLng(15.975, 108.05),
    L.latLng(16.15, 108.35)
  );

  const fetchData = useCallback(async () => {
    if (!rideId) {
      message.error("Invalid ride ID");
      return;
    }
    try {
      await dispatch(fetchRideDetails(rideId)).unwrap();
    } catch (err) {
      message.error(err.message || "Lỗi khi lấy chi tiết chuyến đi");
    }
  }, [dispatch, rideId]);

  useEffect(() => {
    fetchData();
    return () => dispatch(clearRideState());
  }, [fetchData]);

  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) message.error(error);
    if (success && rideDetails)
      message.success("Lấy chi tiết chuyến đi thành công");
  }, [error, success, rideDetails]);
  console.log("Ride Details:", rideDetails);
  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <AppSidebar />
        <Layout style={{ marginLeft: 200 }}>
          <AppHeader usersProfile={users} />
          <Content style={{ margin: "20px" }}>
            <Spin tip="Đang tải..." size="large" />
          </Content>
        </Layout>
      </Layout>
    );
  }

  if (!rideDetails) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <AppSidebar />
        <Layout style={{ marginLeft: 200 }}>
          <AppHeader usersProfile={users} />
          <Content style={{ margin: "20px" }}>
            <Title level={3}>Chi tiết chuyến đi</Title>
            <Text>Không tìm thấy chuyến đi.</Text>
          </Content>
        </Layout>
      </Layout>
    );
  }

  // Render markers and polylines based on active tab
  const renderMapElements = () => {
    const elements = [];

    // Sort locations by timestamp to ensure chronological order
    const sortedDriverLocations = [...(rideDetails.driverLocations || [])].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    const sortedPassengerLocations = [
      ...(rideDetails.passengerLocations || []),
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Driver markers and polyline
    if (activeTab === "both" || activeTab === "driver") {
      // Add markers with numbering
      sortedDriverLocations.forEach((loc, index) => {
        const position = [loc.latitude, loc.longitude];
        elements.push(
          <Marker key={`driver-${index}`} position={position} icon={driverIcon}>
            <Popup>
              Tài xế
              <br />
              Tọa độ: {loc.latitude}, {loc.longitude}
              <br />
              Thời gian: {new Date(loc.timestamp).toLocaleString()}
            </Popup>
          </Marker>
        );
      });

      // Add polyline to connect driver locations
      if (sortedDriverLocations.length > 1) {
        const driverPath = sortedDriverLocations.map((loc) => [
          loc.latitude,
          loc.longitude,
        ]);
        elements.push(
          <Polyline
            key="driver-path"
            positions={driverPath}
            color="#3182ce"
            weight={4}
            opacity={0.7}
          />
        );
      }
    }

    // Passenger markers and polyline
    if (activeTab === "both" || activeTab === "passenger") {
      // Add markers with numbering
      sortedPassengerLocations.forEach((loc, index) => {
        const position = [loc.latitude, loc.longitude];
        elements.push(
          <Marker
            key={`passenger-${index}`}
            position={position}
            icon={passengerIcon}
          >
            <Popup>
              Hành khách
              <br />
              Tọa độ: {loc.latitude}, {loc.longitude}
              <br />
              Thời gian: {new Date(loc.timestamp).toLocaleString()}
            </Popup>
          </Marker>
        );
      });

      // Add polyline to connect passenger locations
      if (sortedPassengerLocations.length > 1) {
        const passengerPath = sortedPassengerLocations.map((loc) => [
          loc.latitude,
          loc.longitude,
        ]);
        elements.push(
          <Polyline
            key="passenger-path"
            positions={passengerPath}
            color="#28a745"
            weight={4}
            opacity={0.7}
          />
        );
      }
    }

    return elements;
  };

  return (
    <div className="admin-ride-details">
      <Layout style={{ minHeight: "100vh" }}>
        <AppSidebar />
        <Layout style={{ marginLeft: 200 }}>
          <AppHeader usersProfile={users} />
          <Content style={{ padding: "24px" }}>
            <Title level={2} className="page-title">
              Chi tiết chuyến đi
            </Title>

            {/* Row 1: Ride Information */}
            <Card className="ride-card" title="Thông tin chuyến đi">
              <Row gutter={16}>
                <Col span={24}>
                  <div className="info-item">
                    <Text strong>Nội dung:</Text>
                    <Text>{rideDetails.ridePost?.content}</Text>
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <div className="info-item">
                    <Text strong>Điểm bắt đầu:</Text>
                    <Text>{rideDetails.ridePost?.startLocation}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="info-item">
                    <Text strong>Điểm kết thúc:</Text>
                    <Text>{rideDetails.ridePost?.endLocation}</Text>
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <div className="info-item">
                    <Text strong>Thời gian bắt đầu:</Text>
                    <Text>
                      {rideDetails.ridePost?.startTime
                        ? new Date(
                            rideDetails.ridePost.startTime
                          ).toLocaleString()
                        : "N/A"}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="info-item">
                    <Text strong>Ngày tạo:</Text>
                    <Text>
                      {rideDetails.ridePost?.createdAt
                        ? new Date(
                            rideDetails.ridePost.createdAt
                          ).toLocaleString()
                        : "N/A"}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Row 2: Driver and Passenger Information */}
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card className="user-card" title="Thông tin tài xế">
                  <div className="info-item">
                    <Text strong>Họ tên:</Text>
                    <Text>{rideDetails.driver?.fullName}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Email:</Text>
                    <Text>{rideDetails.driver?.email}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Điểm uy tín:</Text>
                    <Text>{rideDetails.driver?.trustScore}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Số điện thoại:</Text>
                    <Text>{rideDetails.driver?.phone}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Số điện thoại người thân:</Text>
                    <Text>{rideDetails.driver?.relativePhone}</Text>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card className="user-card" title="Thông tin hành khách">
                  <div className="info-item">
                    <Text strong>Họ tên:</Text>
                    <Text>{rideDetails.passenger?.fullName}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Email:</Text>
                    <Text>{rideDetails.passenger?.email}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Điểm uy tín:</Text>
                    <Text>{rideDetails.passenger?.trustScore}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Số điện thoại:</Text>
                    <Text>{rideDetails.passenger?.phone}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Số điện thoại người thân:</Text>
                    <Text>{rideDetails.passenger?.relativePhone}</Text>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Row 3: Location Information */}
            {/* <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card className="location-card" title="Vị trí tài xế">
                  {rideDetails.driverLocations?.length > 0 ? (
                    <div className="location-list">
                      {rideDetails.driverLocations.map((loc, index) => (
                        <div key={index} className="location-item">
                          <Text>
                            Vị trí: ({loc.latitude}, {loc.longitude})
                          </Text>
                          <Text>
                            Thời gian:{" "}
                            {new Date(loc.timestamp).toLocaleString()}
                          </Text>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Text>Không có dữ liệu vị trí</Text>
                  )}
                </Card>
              </Col>
              <Col span={12}>
                <Card className="location-card" title="Vị trí hành khách">
                  {rideDetails.passengerLocations?.length > 0 ? (
                    <div className="location-list">
                      {rideDetails.passengerLocations.map((loc, index) => (
                        <div key={index} className="location-item">
                          <Text>
                            Vị trí: ({loc.latitude}, {loc.longitude})
                          </Text>
                          <Text>
                            Thời gian:{" "}
                            {new Date(loc.timestamp).toLocaleString()}
                          </Text>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Text>Không có dữ liệu vị trí</Text>
                  )}
                </Card>
              </Col>
            </Row> */}

            {/* Row 4: Map Display */}
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="Bản đồ vị trí">
                  <Button
                    type="primary"
                    className="toggle-map-btn"
                    onClick={() => setShowMap(!showMap)}
                  >
                    {showMap ? "Ẩn bản đồ" : "Hiện bản đồ"}
                  </Button>
                  <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    style={{ marginTop: 16 }}
                  >
                    <TabPane tab="Cả hai" key="both" />
                    <TabPane tab="Tài xế" key="driver" />
                    <TabPane tab="Hành khách" key="passenger" />
                  </Tabs>

                  {showMap &&
                    rideDetails &&
                    (rideDetails.driverLocations?.length > 0 ||
                      rideDetails.passengerLocations?.length > 0) && (
                      <div
                        className="map-container"
                        style={{
                          height: "400px",
                          width: "100%",
                          marginTop: 16,
                        }}
                      >
                        <MapContainer
                          center={[16.06, 108.22]}
                          zoom={13}
                          minZoom={12} // Prevent zooming out too far
                          maxZoom={18} // Allow detailed zooming in
                          style={{ height: "100%", width: "100%" }}
                          maxBounds={daNangBounds}
                          maxBoundsViscosity={1.0}
                          zoomControl={true}
                          scrollWheelZoom={true} // Enable scroll wheel zoom
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          {renderMapElements()}
                        </MapContainer>
                      </div>
                    )}

                  {showMap &&
                    (!rideDetails ||
                      (rideDetails.driverLocations?.length === 0 &&
                        rideDetails.passengerLocations?.length === 0)) && (
                      <Text>Không có đủ dữ liệu để hiển thị bản đồ.</Text>
                    )}
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminRideDetails;
