import {Typography, Card, Row, Col, Statistic, Button, Space, Divider, Layout,} from "antd";
import {TrophyOutlined, FlagOutlined, TeamOutlined, HistoryOutlined,} from "@ant-design/icons";
import Navbar from "./Navbar";
import "./Home.css";
import Footer from "./Footer.tsx";

const { Title, Text } = Typography;
const { Header, Content } = Layout;

export default function Home() {
  return (

    <Layout className="main-layout">

        {/* Header */}
        <Header className="main-header">
            <Navbar />
        </Header>

        {/* Content */}
        <Content className="main-content">
            
            <div className="hero-container">
                <div className="hero-overlay">
                    <Title className="hero-title">Temporada 2025 MotoGP</Title>
                    <Text className="hero-description">Administra y analiza los resultados de todas las carreras en un solo lugar</Text>
                    <Button type="primary" size="large" className="hero-button">Ver última carrera</Button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="content-section">
            <Title level={3} className="section-title">
                Estadísticas de la temporada
            </Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                <Card bordered={false} className="stats-card-red">
                    <Statistic
                    title={<Text strong className="stats-title">Carreras</Text>}
                    value={8}
                    prefix={<FlagOutlined />}
                    valueStyle={{ color: "white" }}
                    suffix={<Text className="stats-suffix">/ 20</Text>}
                    />
                </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                <Card bordered={false} className="stats-card-purple">
                    <Statistic
                    title={<Text strong className="stats-title">Pilotos</Text>}
                    value={22}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: "white" }}
                    />
                </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                <Card bordered={false} className="stats-card-blue">
                    <Statistic
                    title={<Text strong className="stats-title">Equipos</Text>}
                    value={11}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: "white" }}
                    />
                </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                <Card bordered={false} className="stats-card-green">
                    <Statistic
                    title={<Text strong className="stats-title">Puntos líder</Text>}
                    value={186}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: "white" }}
                    />
                </Card>
                </Col>
            </Row>

            {/* Next Races Section */}
            <Title level={3} className="section-title-spaced">
                Próximas carreras
            </Title>
            <Row gutter={[16, 16]}>
                {[
                { title: "GP de España", date: "12 Mar 2025", location: "Circuito de Jerez" },
                { title: "GP de Francia", date: "26 Mar 2025", location: "Le Mans" },
                { title: "GP de Italia", date: "9 Abr 2025", location: "Mugello" },
                ].map((race, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                    <Card hoverable className="race-card">
                    <Title level={4} style={{ marginBottom: "8px" }}>
                        {race.title}
                    </Title>
                    <Space direction="vertical" size={1} style={{ width: "100%" }}>
                        <Text type="secondary">
                        <HistoryOutlined /> {race.date}
                        </Text>
                        <Text>{race.location}</Text>
                    </Space>
                    </Card>
                </Col>
                ))}
            </Row>

            {/* Quick Actions */}
            <Divider />
            <Space className="actions-container">
                <Button
                type="primary"
                icon={<TrophyOutlined />}
                size="large"
                className="action-button-primary"
                >
                Clasificación
                </Button>
                <Button icon={<TeamOutlined />} size="large">
                Pilotos
                </Button>
                <Button icon={<FlagOutlined />} size="large">
                Calendario
                </Button>
            </Space>
            </div>

            <Footer />

        </Content>

    </Layout>
  );
}