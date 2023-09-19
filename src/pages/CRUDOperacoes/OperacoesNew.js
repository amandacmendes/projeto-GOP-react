import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, FormGroup, ListGroup, Row, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import OperationService from '../../services/OperationService';
import { useNavigate, useParams } from "react-router-dom";
import OfficerService from "../../services/OfficerService";
import ReasonService from "../../services/ReasonService";
import ResourceService from "../../services/ResourceService";
import { useForm } from 'react-hook-form';


export function OperacoesNew(props) {

    const navigate = useNavigate();
    let params = useParams();
    let pagetitle = '';
    let isDisabled = false;
    let action = 'new';

    if (props.pagetitle) {
        pagetitle = props.pagetitle;
    }

    if (params.action === 'view') {
        pagetitle = 'Visualizar Operação'
        isDisabled = true;
        action = params.action;
    } else if (params.action === 'edit') {
        pagetitle = 'Editar Operação'
        action = params.action;
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
                    <Content id={params.id} isDisabled={isDisabled} pageAction={action} />
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

    const navigate = useNavigate();


    const { handleSubmit, register, formState: { errors } } = useForm();

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
        }
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
    const handleReasonInput = (e) => {
        setReason(e.target.value)
    }


    const onSubmit = async (data) => {

        try {
            console.log('--- - -' + data + data.operation_chief)

            if (props.pageAction == 'new') {
                //CreateOperation
                await operationService.createOperation({
                    operation_name: data.operation_name,
                    operation_place: data.operation_place,
                    operation_planned_date: data.operation_planned_date,

                }).then((result) => {
                    //Create Officer_Operation
                    //console.log("officer " + result)

                    data.officer_operation_officer_id.forEach(async of => {

                        await officerService.createOfficerOperation({
                            officer_id: of,
                            operation_id: result.data.id
                        }).then((result) => {
                            //console.log("officerop " + result)

                            //Create Resource_Operation
                            data.operation_resource_id.forEach(async res => {

                                await resourceService.createResourceOperation({
                                    resource_id: res,
                                    operation_id: result.data.operation_id
                                }).then((result) => {
                                    console.log("resourceop " + result)
                                    navigate(-1)
                                }).then((res) => {

                                    navigate('/operation')
                                    //Create Reason
                                    //console.log(data)
                                }).catch((e) => console.log("err resourceop " + e))
                            });

                        }).catch((e) => console.log(e))
                    });
                }).catch((e) => {
                    console.log(e)
                });


            } else if (props.pageAction == 'edit') {

                //Update
                await operationService.update({
                    id: props.id,
                    operation_name: data.operation_name,
                    operation_place: data.operation_place,
                    operation_planned_date: data.operation_planned_date,

                }).then((result) => {
                    //Create Officer_Operation
                    //console.log("officer " + result)

                    data.officer_operation_officer_id.forEach(async of => {

                        await officerService.updateOfficer({
                            officer_id: of,
                            operation_id: result.data.id
                        }).then((result) => {
                            //console.log("officerop " + result)

                            //Create Resource_Operation
                            data.operation_resource_id.forEach(async res => {

                                await resourceService.updateResourceOperation({
                                    resource_id: res,
                                    operation_id: result.data.operation_id
                                }).then((result) => {
                                    console.log("resourceop " + result)
                                    navigate(-1)
                                }).catch((e) => console.log("err resourceop " + e))
                            });

                        }).catch((e) => console.log(e))
                    });
                }).catch((e) => {
                    console.log(e)
                });


            }

        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <Form onSubmit={handleSubmit(onSubmit)}>
            {!show &&
                <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                    {errorMessage}
                </Alert>
            }

            <Card className="mb-3">
                <Card.Body>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-name">Nome da Operação</Form.Label>
                        <Form.Control
                            type="text"
                            disabled={props.isDisabled}
                            value={operation.operation_name}
                            {...register('operation_name')}
                            onChange={(e) => setOperation({ ...operation, operation_name: e.target.value })}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-place">Local da Operação</Form.Label>
                        <Form.Control
                            type="text"
                            disabled={props.isDisabled}
                            value={operation.operation_place}
                            {...register('operation_place')}
                            onChange={(e) => setOperation({ ...operation, operation_place: e.target.value })}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-date">Data da Operação</Form.Label>
                        <Form.Control
                            type="date"
                            disabled={props.isDisabled}
                            value={operation.operation_date}
                            {...register('operation_planned_date')}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-leader">Responsavel pela Operação</Form.Label>
                        <Form.Select
                            disabled={props.isDisabled}
                            {...register('operation_chief')}
                        >
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
                            <ListGroup.Item >
                                <Form.Check
                                    disabled={props.isDisabled}
                                    type={"checkbox"}
                                    id={officer.id}
                                    key={officer.id}
                                    label={officer.name}
                                    value={officer.id}
                                    {...register('officer_operation_officer_id')}
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
                                    value={resource.id}
                                    {...register('operation_resource_id')}
                                />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>


                </Card.Body>
            </Card>


            <h3>Motivação</h3>
            <Card className="my-3">
                <Card.Body>
                    <Form.Group className="pb-2" >
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


                        {Array.from({ length: reasonSize }).map((_, index) => (
                            <Row className="mb-2" key={index} >
                                <Col className="col-4">
                                    <Form.Select disabled={props.isDisabled}  >
                                        {reasontypes.map((reasontype) => (
                                            <option
                                                key={reasontype.id}
                                                id={'reasontypeid-' + index}
                                                value={reasontype.id}
                                            >
                                                {reasontype.description}
                                            </option>
                                        ))
                                        }
                                    </Form.Select>
                                </Col>
                                <Col className="d-flex flex-row">

                                    <Form.Control
                                        key={index}
                                        id={'reasonid-' + index}
                                        type="text"
                                        onChange={(e) => handleReasonInput(e)}
                                        disabled={props.isDisabled}
                                    // {...register('reason')}
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
            <Button className="my-3" type="submit"> Cadastrar </Button>

        </Form >
    </>
}

