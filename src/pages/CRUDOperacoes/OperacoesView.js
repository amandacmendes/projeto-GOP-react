import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, ListGroup, Row, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import OperationService from '../../services/OperationService';
import { useNavigate, useParams } from "react-router-dom";
import OfficerService from "../../services/OfficerService";
import ReasonService from "../../services/ReasonService";
import ResourceService from "../../services/ResourceService";

export function OperacoesView(props) {

    const navigate = useNavigate();
    let params = useParams();
    let pagetitle = '';
    let isDisabled = false;

    if (props.pagetitle) {
        pagetitle = props.pagetitle;
    }

    if (params.action === 'view') {
        pagetitle = 'Visualizar Operação'
        isDisabled = true;
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
                    <Content id={params.id} isDisabled={isDisabled} />
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
    const [reason, setReason] = useState([]);
    const [reasontypes, setReasonTypes] = useState([]);
    const [resources, setResources] = useState([]);

    const [reasonSize, setReasonSize] = useState(1);

    const operationService = new OperationService();
    const reasonService = new ReasonService();
    const officerService = new OfficerService();
    const resourceService = new ResourceService();

    const [selectedOfficers, setSelectedOfficers] = useState([]);
    const [selectedResources, setSelectedResources] = useState([]);
    


    async function loadInfo() {
        // for New Operation - load officers, resources and reason types
        await officerService.getOfficersWithTeams()
            .then((result) => {
                setOfficers(result)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(`Erro: ${error.response.data.error}`)
            });

        await reasonService.getReasonTypes()
            .then((result) => {
                console.log(result.data)
                setReasonTypes(result.data)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(`Erro: ${error.response.data.error}`)
            });

        await resourceService.getResources()
            .then((result) => {
                console.log(result.data)
                setResources(result.data)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(`Erro: ${error.response.data.error}`)
            });

        //for View and Edit - load operation from db
        if (!!props.id) {
            fetchOperation(props.id);
            fetchSelectedOfficers(props.id);
            fetchSelectedResources(props.id);
        }
    }

    async function fetchSelectedOfficers(operation_id) {

        await officerService.getAllOfficersFromOperation({ id: operation_id })
            .then((result) => {
                const selOfficers = result.data.reduce((acc, officer) => {
                    acc[officer.officer_id] = officer;
                    return acc;
                }, {})
                setSelectedOfficers(selOfficers)
            })
        console.log(selectedOfficers)
    }
    
    async function fetchSelectedResources(operation_id) {

        await resourceService.getAllResourcesFromOperation({ id: operation_id })
            .then((result) => {
                const selResources = result.data.reduce((acc, resource) => {
                    acc[resource.resource_id] = resource;
                    return acc;
                }, {})
                setSelectedResources(selResources)
            })
        console.log(selectedResources)
    }

    async function fetchOperation(id) {
        var op = await operationService.getOperationById(id)
            .then((result) => {
                console.log('aaaa ' + result.data)
                setOperation(result.data)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage('Erro: A operação que está tentando visualizar não existe.')
            });

        //get all reason of operation 
        await reasonService.getReasonfromOperation(id)
            .then((result) => {
                console.log(result.data)
                setReason(result.data)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage('Erro: Erro ao buscar motivações da operação.')
            });
    }

    useEffect(() => {
        loadInfo()
    }, []);

    function handleAddReasonClick() {
        setReasonSize(reasonSize + 1)
    }
    function handleMinusReasonClick() {
        if (reasonSize > 1) {
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
                        <Form.Control type="text" disabled={props.isDisabled} value={operation.operation_name}></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-place">Local da Operação</Form.Label>
                        <Form.Control type="text" disabled={props.isDisabled} value={operation.operation_place}></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-date">Data da Operação</Form.Label>
                        <Form.Control type="date" disabled={props.isDisabled}
                            value={new Date(Date.parse(operation.date ?
                                operation.operation_date :
                                operation.operation_planned_date)).toLocaleDateString('fr-CA')}>
                        </Form.Control>
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
                    <ListGroup>
                        {officers.map((officer) => (
                            <ListGroup.Item>
                                <Form.Check
                                    disabled={props.isDisabled}
                                    type={"checkbox"}
                                    id={officer.id}
                                    label={officer.name}
                                    checked={selectedOfficers.hasOwnProperty(officer.id)}
                                />
                            </ListGroup.Item>

                        ))}
                    </ListGroup>
                    <br />

                    <Form.Label>Viaturas</Form.Label>
                    <ListGroup >
                        {resources.map((resource) => (
                            <ListGroup.Item>
                                <Form.Check // prettier-ignore
                                    disabled={props.isDisabled}
                                    type={"checkbox"}
                                    id={resource.id}
                                    label={resource.description}
                                    checked={selectedResources.hasOwnProperty(resource.id)}
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
                        <Row className="mb-2">
                            <Col className="col-4">
                                <Form.Label controlId="form-label-reason">Objeto de trabalho policial</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label controlId="form-label-reason">Descrição</Form.Label>
                            </Col>
                            <Col className="d-flex flex-row-reverse">
                                <Button
                                    onClick={handleAddReasonClick}
                                    disabled={props.isDisabled}
                                >
                                    Adicionar
                                </Button>
                            </Col>
                        </Row>

                        {reason.map((reasonItem) => (
                            <Row className="mb-2" key={reasonItem.id}>
                                <Col className="col-4">

                                    <Form.Select disabled={props.isDisabled} value={reasonItem.reasonTypeId || ''}>
                                        {(props.isDisabled) ? (reasontypes.filter((r) => r.id == reasonItem.reasontype_id)
                                            .map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.description}
                                                </option>
                                            ))) :
                                            (reasontypes.map((reasontype) => (
                                                <option key={reasontype.id} value={reasontype.id}>
                                                    {reasontype.description}
                                                </option>
                                            )))

                                        }
                                    </Form.Select>


                                </Col>
                                <Col className="d-flex flex-row">
                                    <Form.Control
                                        type="text"
                                        value={reasonItem.description}
                                        disabled={props.isDisabled}
                                    />

                                    <Button
                                        variant="outline-danger"
                                        className="ms-2"
                                        onClick={handleMinusReasonClick}
                                        disabled={props.isDisabled}
                                    >
                                        <span class="material-symbols-outlined">
                                            remove
                                        </span>
                                    </Button>
                                </Col>
                            </Row>
                        ))}

                    </Form.Group>

                </Card.Body>
            </Card>
        </Form >
    </>
}

