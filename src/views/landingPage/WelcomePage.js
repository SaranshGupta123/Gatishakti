import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { loadFull } from "tsparticles";
import images from "component/Image";
import "./welcome.css";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle, FaDesktop, FaRobot } from "react-icons/fa";

const LandingPage = () => {
  useEffect(() => {
    loadFull(window.tsParticles);
  }, []);
  const navigate = useNavigate();
  const modules = [
    {
      title: "Template",
      icon: FaFileAlt,
      description: "Create and manage document templates",
      color: "linear-gradient(135deg,rgb(240, 116, 157),rgb(138, 25, 158))",
      path: "/template",
    },
    {
      title: "SOR Check",
      icon: FaCheckCircle,
      description: "Verify and validate SOR Check documents",
      color: "linear-gradient(135deg,rgb(240, 116, 157),rgb(138, 25, 158))",
      path: "/sor",
    },
    {
      title: "PPT Generation",
      icon: FaDesktop,
      description: "Generate professional presentations PPT",
      color: "linear-gradient(135deg,rgb(240, 116, 157),rgb(138, 25, 158))",
      path: "/ppt-generation",
    },
    {
      title: "Rag ChatBot",
      icon: FaRobot,
      description: "Interact with AI-powered chatbot using RAG",
      color: "linear-gradient(135deg,rgb(240, 116, 157),rgb(138, 25, 158))",
      path: "/chatbot",
    },
  ];
  const handleNavigate = (path) => {
    console.log("Navigating to", path);
    navigate(path);
  };


  return (
    <div className="main-content">
      <Container className="mb-4">
        <img
          className="logo-container"
          src={images.CompanyLogo}
          alt="Railway Company Logo"
        />
        <img className="main-logo" src={images.railLogo} alt="main logo" />
        <Row className="justify-content-center InfoContainer" >
          <Col xs={12} sm={10} md={8} className="text-center">
            <h1 className="gradient-text mb-4">Welcome to AiEnsured</h1>
            <p className="lead text-light mb-5">
              We specialize in delivering cutting-edge solutions for the railway
              industry. Explore our modules to learn more about our innovative
              responsible AI product services.
            </p>
          </Col>
        </Row>
      </Container>

      <Container>
        <h1 className="text-center text-white mb-5 display-6 fw-bold">
          Select a Module
        </h1>
        <Row className="justify-content-center">
          {modules.map((module, index) => (
            <Col
              key={module.title}
              xs={12}
              md={6}
              lg={3}
              className="d-flex justify-content-center"
            >
              <Card
                onClick={() => handleNavigate(module.path)}
                className="module-card mb-4 same-width-card"
              >
                <div
                  className="card-gradient"
                  style={{
                    background: module.color,
                  }}
                ></div>
                <Card.Body className="feature-card d-flex flex-column justify-content-between position-relative">
                  <div>
                    <div className="icon-wrapper mb-3 d-flex align-items-center justify-content-center">
                      <module.icon className="feature-icon" />
                    </div>
                    <Card.Title>{module.title}</Card.Title>
                    <Card.Text>{module.description}</Card.Text>
                  </div>
                  <div className="bottom-line"></div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

    </div>
  );
};

export default LandingPage;
