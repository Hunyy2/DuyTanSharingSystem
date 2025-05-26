import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logowhile from "../../src/assets/Logo white.png";
import AI from "../../src/assets/ai.png";
import giaotiep from "../../src/assets/giatieppchuyenbiet.png";
import info from "../../src/assets/dadangthongtin.png";
import chiasexe from "../../src/assets/chiasexe.png";
import baomat from "../../src/assets/baomat.png";
import trainghiem from "../../src/assets/trainghiemnguoidunghiendai.png";
import avt from "../../src/assets/avatar-intro/avata.jpg";
import avt1 from "../../src/assets/avatar-intro/avata8.jpg";
import avt2 from "../../src/assets/avatar-intro/avata1.jpg";
import avt3 from "../../src/assets/avatar-intro/avata2.jpg";
import avt4 from "../../src/assets/avatar-intro/avata3.jpg";
import avt5 from "../../src/assets/avatar-intro/avata4.jpg";
import avt6 from "../../src/assets/avatar-intro/avata5.jpg";
import avt7 from "../../src/assets/avatar-intro/avata6.jpg";
import avt8 from "../../src/assets/avatar-intro/avata7.jpg";
import "../styles/LandingPage.scss"; // Ensure you have the appropriate CSS file for styling

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      title: "Môi trường giao tiếp chuyên biệt",
      description:
        "Nền tảng an toàn để sinh viên trao đổi thông tin, chia sẻ kiến thức và kinh nghiệm học tập.",
      image: giaotiep,
    },
    {
      title: "Chia sẻ đa dạng thông tin",
      description:
        "Đăng tải hành trình đi lại, tài liệu học tập, đồ dùng cá nhân và các hoạt động hỗ trợ.",
      image: info,
    },
    {
      title: "Chia sẻ chuyến đi",
      description:
        "Tạo, chia sẻ và tham gia các chuyến đi giữa các cơ sở hoặc đến trường.",
      image: chiasexe,
    },
    {
      title: "Trải nghiệm người dùng hiện đại",
      description:
        "Nhắn tin, thông báo, tìm kiếm thông minh và gợi ý bài đăng theo sở thích.",
      image: trainghiem,
    },
    {
      title: "Hỗ trợ AI",
      description:
        "Tìm kiếm thông tin nhanh chóng và tương tác với hệ thống một cách tự nhiên.",
      image: AI,
    },
    {
      title: "Bảo mật và kiểm duyệt",
      description:
        "Giải pháp bảo mật hiện đại với hệ thống kiểm duyệt nội dung chặt chẽ.",
      image: baomat,
    },
  ];
  // Danh sách testimonials (9 thẻ)
  const testimonials = [
    {
      feedback:
        "University Sharing giúp tôi tìm được nhóm học tập phù hợp và chia sẻ tài liệu dễ dàng hơn bao giờ hết!",
      name: "Hồng Nhung",

      avatar: avt,
    },
    {
      feedback:
        "Nhờ tính năng chia sẻ chuyến đi, tôi đã tiết kiệm được rất nhiều chi phí đi lại giữa các cơ sở.",
      name: "Trần Văn Sơn",

      avatar: avt1,
    },
    {
      feedback:
        "Hệ thống AI hỗ trợ tìm kiếm tài liệu thật sự hữu ích, giúp tôi tiết kiệm thời gian nghiên cứu.",
      name: "Nguyễn Hồng",

      avatar: avt2,
    },
    {
      feedback:
        "Tôi rất thích tính năng nhắn tin trên University Sharing, nó giúp tôi kết nối với bạn bè nhanh chóng!",
      name: "Luyến Kim",

      avatar: avt3,
    },
    {
      feedback:
        "Chia sẻ đồ dùng cá nhân trên nền tảng thật tiện lợi, tôi đã tìm được sách giáo trình cũ với giá rất rẻ.",
      name: "Hồ Ngọc Lam",

      avatar: avt4,
    },
    {
      feedback:
        "University Sharing đã giúp tôi tìm được bạn cùng phòng lý tưởng cho kỳ học mới. Rất tuyệt vời!",
      name: "Trịnh Thư Thư",

      avatar: avt5,
    },
    {
      feedback:
        "Tính năng thông báo thông minh giúp tôi không bỏ lỡ bất kỳ sự kiện quan trọng nào của trường.",
      name: "Ngô Nguyễn Đàm Lê ",

      avatar: avt6,
    },
    {
      feedback:
        "Tôi đã tham gia một câu lạc bộ mới nhờ gợi ý bài đăng trên University Sharing. Thật sự rất hữu ích!",
      name: "Nguyễn Dung",

      avatar: avt7,
    },
    {
      feedback:
        "Nền tảng bảo mật tốt, tôi cảm thấy yên tâm khi chia sẻ thông tin cá nhân và tài liệu học tập.",
      name: "Phan Lê",

      avatar: avt8,
    },
  ];

  // Số lượng thẻ hiển thị cùng lúc
  const cardsPerPage = 3;
  const totalCards = testimonials.length; // 9 thẻ

  // Hàm chuyển đến thẻ tiếp theo
  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + cardsPerPage;
      return newIndex >= totalCards ? 0 : newIndex; // Quay lại thẻ đầu tiên nếu vượt quá
    });
  };

  // Hàm chuyển đến thẻ trước đó
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - cardsPerPage;
      return newIndex < 0 ? totalCards - cardsPerPage : newIndex; // Quay lại thẻ cuối nếu nhỏ hơn 0
    });
  };

  // Lấy danh sách thẻ hiển thị dựa trên currentIndex
  const displayedTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + cardsPerPage
  );

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            <img
              src={logowhile}
              alt="University Sharing Logo"
              className="hero-logo"
            />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
          >
            Nền tảng mạng xã hội dành riêng cho sinh viên <p />
            Kết nối - Chia sẻ - Học hỏi
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-buttons"
          >
            <button onClick={() => navigate("/login")} className="btn-primary">
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn-secondary"
            >
              Đăng ký
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Tính năng nổi bật</h2>
        <div className="features-container">
          <div className="features-list">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`feature-card ${
                  activeFeature === index ? "active" : ""
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="feature-image"
                  loading="lazy" // Tối ưu hóa hiệu suất
                />
                <h3>{feature.title}</h3>
              </motion.div>
            ))}
          </div>
          <div className="feature-detail">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="feature-content"
            >
              <h3>{features[activeFeature].title}</h3>
              <p>{features[activeFeature].description}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">Sinh viên nói gì về chúng tôi</h2>
        <div className="testimonials-container">
          <button className="arrow-btn prev-btn" onClick={handlePrev}>
            &#10094; {/* Mũi tên trái */}
          </button>
          <div className="testimonials-grid">
            {displayedTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="testimonial-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p>"{testimonial.feedback}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.major}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="arrow-btn next-btn" onClick={handleNext}>
            &#10095; {/* Mũi tên phải */}
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Bạn đã sẵn sàng trải nghiệm?</h2>
          <p>Tham gia ngay để kết nối với cộng đồng sinh viên trong trường</p>
          <div className="cta-buttons">
            <button
              onClick={() => navigate("/register")}
              className="btn-primary-footer"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
