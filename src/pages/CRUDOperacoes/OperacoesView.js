import { useEffect, useState } from "react";
import { Card, Col, Form, ListGroup, Row, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import OperationService from '../../services/OperationService';
import { useParams } from "react-router-dom";

export function OperacoesView(props) {
    let params = useParams();

    return (
        <>
            <ContentBase />
            <div className='container'>
                <Stack gap={5}>
                    <h1>{props.pagetitle}</h1>
                    <Content id={params.id} isDisabled={props.isDisabled} />
                    <br /><br />
                </Stack>
            </div>
        </>
    );
}

function Content(props) {

    const [visibility, setVisibility] = useState([]);
    const [operation, setOperation] = useState([]);

    const operationService = new OperationService();

    if (!isNaN(props.id)) {
        console.log('new operation')
        fetchOperation(props.id);
    }

    async function fetchOperation(id) {
        await operationService.getOperationById(id)
            .then((result) => {
                setOperation(result.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
    }, []);

    return <>
        <Form>
            <Card className="mb-3">
                <Card.Body>

                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-name">Nome da Operação</Form.Label>
                        <Form.Control type="text" disabled={props.isDisabled}>{operation.operation_name}</Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-place">Local da Operação</Form.Label>
                        <Form.Control type="text" disabled={props.isDisabled}>{operation.operation_place}</Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-date">Data da Operação</Form.Label>
                        <Form.Control type="date" disabled={props.isDisabled}>{operation.operation_date}</Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-leader">Responsavel pela Operação</Form.Label>
                        <Form.Select disabled={props.isDisabled}>
                            <option>Selecione um oficial</option>
                            {operation &&
                                <option value='1'>{operation.operation_name}</option>
                            }

                        </Form.Select>
                    </Form.Group>

                </Card.Body>
            </Card>

            <h3>Recursos</h3>
            <Card className="my-3">
                <Card.Body>

                    <Form.Label>Efetivos</Form.Label>
                    <ListGroup variant="flush">
                        {['checkbox', 'radio'].map((type) => (
                            <div key={`default-${type}`} className="mb-3">
                                <ListGroup.Item>
                                    <Form.Check // prettier-ignore
                                        type={"checkbox"}
                                        id={`default-${type}`}
                                        label={`default ${type}`}
                                    />
                                </ListGroup.Item>
                            </div>
                        ))}
                    </ListGroup>

                    <Form.Label>Viaturas</Form.Label>
                    <ListGroup variant="flush">
                        {['checkbox', 'radio'].map((type) => (
                            <div key={`default-${type}`} className="mb-3">
                                <ListGroup.Item>
                                    <Form.Check // prettier-ignore
                                        type={"checkbox"}
                                        id={`default-${type}`}
                                        label={`default ${type}`}
                                    />
                                </ListGroup.Item>
                            </div>
                        ))}
                    </ListGroup>


                    <Form.Label>Apoio</Form.Label>
                    <ListGroup variant="flush">
                        {['checkbox', 'radio'].map((type) => (
                            <div key={`default-${type}`} className="mb-3">
                                <ListGroup.Item>
                                    <Form.Check // prettier-ignore
                                        type={"checkbox"}
                                        id={`default-${type}`}
                                        label={`default ${type}`}
                                    />
                                </ListGroup.Item>
                            </div>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
            <h3>Motivação</h3>


            <Card className="my-3">
                <Card.Body>
                    <Form.Group className="pb-2">
                        <Row>
                            <Col className="col-4">
                                <Form.Label className="mb-2" controlId="form-label-reason">Objeto de trabalho policial</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label className="mb-2" controlId="form-label-reason">Descrição</Form.Label>
                            </Col>
                        </Row>


                        {['checkbox', 'radio'].map((type) => (
                            <Row className="mb-2">
                                <Col className="col-4">
                                    <Form.Select>
                                        <option>Selecione um oficial </option>
                                        <option value='1'> </option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Control type="text" ></Form.Control>
                                </Col>
                            </Row>
                        ))}
                    </Form.Group>

                </Card.Body>
            </Card>
        </Form >
    </>
}