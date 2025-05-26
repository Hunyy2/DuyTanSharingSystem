import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.scss"; // Ensure you have the appropriate CSS file for styling

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Môi trường giao tiếp chuyên biệt",
      description: "Nền tảng an toàn để sinh viên trao đổi thông tin, chia sẻ kiến thức và kinh nghiệm học tập.",
      icon: "💬"
    },
    {
      title: "Chia sẻ đa dạng thông tin",
      description: "Đăng tải hành trình đi lại, tài liệu học tập, đồ dùng cá nhân và các hoạt động hỗ trợ.",
      icon: "📚"
    },
    {
      title: "Chia sẻ chuyến đi",
      description: "Tạo, chia sẻ và tham gia các chuyến đi giữa các cơ sở hoặc đến trường.",
      icon: "🚗"
    },
    {
      title: "Trải nghiệm người dùng hiện đại",
      description: "Nhắn tin, thông báo, tìm kiếm thông minh và gợi ý bài đăng theo sở thích.",
      icon: "✨"
    },
    {
      title: "Hỗ trợ AI",
      description: "Tìm kiếm thông tin nhanh chóng và tương tác với hệ thống một cách tự nhiên.",
      icon: "🤖"
    },
    {
      title: "Bảo mật và kiểm duyệt",
      description: "Giải pháp bảo mật hiện đại với hệ thống kiểm duyệt nội dung chặt chẽ.",
      icon: "🔒"
    }
  ];

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
            Kết nối - Chia sẻ - Học hỏi
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
          >
            University Sharing - Nền tảng mạng xã hội dành riêng cho sinh viên
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-buttons"
          >
            <button 
              onClick={() => navigate("/login")}
              className="btn-primary"
            >
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
        <div className="hero-image">
          <img src="/images/hero-image.png" alt="Students collaborating" />
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
                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="feature-icon">{feature.icon}</div>
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
        <div className="testimonials-grid">
          <motion.div 
            whileHover={{ y: -10 }}
            className="testimonial-card"
          >
            <p>"University Sharing giúp tôi tìm được nhóm học tập phù hợp và chia sẻ tài liệu dễ dàng hơn bao giờ hết!"</p>
            <div className="testimonial-author">
              <img src="/images/avatar1.jpg" alt="Nguyễn Văn A" />
              <div>
                <h4>Nguyễn Văn A</h4>
                <span>Sinh viên CNTT</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -10 }}
            className="testimonial-card"
          >
            <p>"Nhờ tính năng chia sẻ chuyến đi, tôi đã tiết kiệm được rất nhiều chi phí đi lại giữa các cơ sở."</p>
            <div className="testimonial-author">
              <img src="/images/avatar2.jpg" alt="Trần Thị B" />
              <div>
                <h4>Trần Thị B</h4>
                <span>Sinh viên Kinh tế</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -10 }}
            className="testimonial-card"
          >
            <p>"Hệ thống AI hỗ trợ tìm kiếm tài liệu thật sự hữu ích, giúp tôi tiết kiệm thời gian nghiên cứu."</p>
            <div className="testimonial-author">
              <img src="/images/avatar3.jpg" alt="Lê Văn C" />
              <div>
                <h4>Lê Văn C</h4>
                <span>Sinh viên Ngoại ngữ</span>
              </div>
            </div>
          </motion.div>
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
              className="btn-primary"
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