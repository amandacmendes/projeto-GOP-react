import '../../css/style.css';
import '../../css/card_mainpage.css';

import { ContentBase } from '../../components/ContentBase';
import dashboard_img from '../../img/dashboard-edit-2.jpg';
import operacao_img from '../../img/policial-1.png';
import { Card, Col, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export function MainPage() {
    return (
        <>
            <ContentBase />
            <div className='container'>
                <h1>Página Principal</h1>

                <Row className='mt-5'>
                    <Col>
                        <Link to="/operation">
                            <Card style={{ height: "250px" }} >
                                <Card.Img src={operacao_img} alt="operation-image" className="mb-3 h-100" />
                                <div className="card-overlay"></div>
                                <Card.ImgOverlay>
                                    <Card.Title className='text-light h-100 d-flex align-items-center justify-content-center'
                                    >
                                        <h2>
                                            Operações Policiais
                                        </h2>
                                    </Card.Title>
                                </Card.ImgOverlay>
                            </Card>
                        </Link>

                    </Col>
                    <Col>
                        <Link to="/dashboard">
                            <Card style={{ height: "250px" }}>
                                <Card.Img src={dashboard_img} alt="dashboard-image" className="img-fluid mb-3 h-100" />
                                <div className="card-overlay "></div>
                                <Card.ImgOverlay>
                                    <Card.Title className='text-light h-100 d-flex align-items-center justify-content-center'>
                                        <h2>
                                            Dashboard
                                        </h2>
                                    </Card.Title>
                                </Card.ImgOverlay>
                            </Card>
                        </Link>
                    </Col>
                </Row>

            </div>
        </>
    );
}

