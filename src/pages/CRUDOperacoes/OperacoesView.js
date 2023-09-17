import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, ListGroup, Row, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import OperationService from '../../services/OperationService';
import { useNavigate, useParams } from "react-router-dom";
import OfficerService from "../../services/OfficerService";

export function OperacoesView(props) {

    const navigate = useNavigate();
    let params = useParams();
    let pagetitle = '';

    if (props.pagetitle) {
        pagetitle = props.pagetitle;
    }


    if (params.action === 'view') {
        pagetitle = 'Visualizar Operação'
    } else if (params.action === 'edit') {
        pagetitle = 'Editar Operação'
    }

    if (pagetitle === '') {
        navigate('/*')
    }

    return (
        <>
            <ContentBase />
            <div className='container'>
                <Stack gap={5}>
                    <h1>{pagetitle}</h1>
                    <Content id={params.id} isDisabled={props.isDisabled} />
                    <br /><br />
                </Stack>
            </div>
        </>
    );
}

function Content(props) {

    const [operation, setOperation] = useState([]);
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState();

    const [officers, setOfficers] = useState([]);
    const [reasontypes, setReasonTypes] = useState([]);

    const [reasonSize, setReasonSize] = useState(1);

    const operationService = new OperationService();
    const officerService = new OfficerService();

    if (!!props.id) {
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
                setErrorMessage('Erro: A operação que está tentando visualizar não existe.')
            });
    }

    async function loadInfo() {
        // for New Operation - load officers, resources and reason types

        await officerService.getOfficersWithTeams()
            .then((result) => {
                setOfficers(result)
                console.log(officers.forEach(officer => { console.log(officer.name, officer.id) }))
                console.log(officers.length)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(`Erro: ${error}`)
            });

    }

    useEffect(() => {
        loadInfo()
    }, []);

    function handleAddReasonClick() {
        setReasonSize(reasonSize + 1)
    }
    function handleMinusReasonClick() {
        if (reasonSize > 0) {
            setReasonSize(reasonSize - 1)
        }
    }

    return <>
        <Form >
            {!show &&
                <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                    {errorMessage}
                </Alert>
            }

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
                        <Form.Select disabled={props.isDisabled} >
                            <option>Selecione um oficial</option>
                            {officers.map((officer) => (
                                <option key={officer.id} value={officer.id}>
                                    {officer.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                </Card.Body>
            </Card>

            <h3>Recursos</h3>
            <Card className="my-3">
                <Card.Body>

                    <Form.Label>Efetivos</Form.Label>
                    <ListGroup >
                        {officers.map((officer) => (
                            <ListGroup.Item>
                                <Form.Check
                                    type={"checkbox"}
                                    id={officer.id}
                                    label={officer.name}
                                />
                            </ListGroup.Item>

                        ))}
                    </ListGroup>
                    <br />

                    <Form.Label>Viaturas</Form.Label>
                    <ListGroup >
                        {['checkbox', 'radio'].map((type) => (
                            <ListGroup.Item>
                                <Form.Check // prettier-ignore
                                    type={"checkbox"}
                                    id={`default-${type}`}
                                    label={`default ${type}`}
                                />
                            </ListGroup.Item>
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
                            <Col className="d-flex flex-row-reverse">
                                <Button onClick={handleAddReasonClick}>
                                    Adicionar
                                </Button>
                            </Col>
                        </Row>

                        {Array.from({ length: reasonSize }).map((_, index) => (
                            <Row className="mb-2" key={index}>
                                <Col className="col-4">
                                    <Form.Select>
                                        <option>Selecione</option>
                                        {reasontypes.map((reasontype) => (
                                            <option key={reasontype.id} value={reasontype.id}>
                                                {reasontype.description}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col className="d-flex flex-row">
                                    <Form.Control type="text" />
                                    <Button className="ms-2" onClick={handleMinusReasonClick}> - </Button>
                                </Col>
                            </Row>
                        ))}

                    </Form.Group>

                </Card.Body>
            </Card>
        </Form >
    </>
}

