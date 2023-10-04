import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, FormGroup, ListGroup, Row, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import OperationService from '../../services/OperationService';
import { useNavigate, useParams } from "react-router-dom";
import OfficerService from "../../services/OfficerService";
import ReasonService from "../../services/ReasonService";
import ResourceService from "../../services/ResourceService";
import { useForm, Controller, useFieldArray } from 'react-hook-form';


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
    const [resources, setResources] = useState([]);

    const [reason, setReason] = useState([]);
    const [reasontypes, setReasonTypes] = useState([]);



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
                const filteredData = result.filter(item => item.status !== 'INACTIVE');

                var data = filteredData;
                data.sort((a, b) => {
                    const nameA = a.name.toUpperCase(); // Convert to uppercase for case-insensitive sorting
                    const nameB = b.name.toUpperCase();

                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });

                setOfficers(data)
                console.log('officers');
                console.log(data)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(`Erro: ${error.response.data.error}`)
            });

        await reasonService.getReasonTypes()
            .then((result) => {
                var data = result.data;
                data.sort((a, b) => {
                    const descriptionA = a.description.toUpperCase(); // Convert to uppercase for case-insensitive sorting
                    const descriptionB = b.description.toUpperCase();

                    if (descriptionA < descriptionB) {
                        return -1;
                    }
                    if (descriptionA > descriptionB) {
                        return 1;
                    }
                    return 0;
                });

                setReasonTypes(data)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(`Erro: ${error.response.data.error}`)
            });

        await resourceService.getResources()
            .then((result) => {

                const filteredData = result.data.filter(item => item.status !== 'INACTIVE');
                var data = filteredData;

                data.sort((a, b) => {
                    const descriptionA = a.description.toUpperCase(); // Convert to uppercase for case-insensitive sorting
                    const descriptionB = b.description.toUpperCase();

                    if (descriptionA < descriptionB) {
                        return -1;
                    }
                    if (descriptionA > descriptionB) {
                        return 1;
                    }
                    return 0;
                });

                setResources(data)

            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(`Erro: ${error.response.data.error}`)
            });

        //for View and Edit - load operation from db
        if (!!props.id) {
            //fetchOperation(props.id);

            console.log('reason: ')
            console.log(reason)
        }
    }

    // If new
    function initializeReason() {
        const initialReason = [{ id: null, description: '', reasontype_id: 1, operation_id: null }];
        setReason(initialReason);
    }

    async function fetchOperation(id) {
        var op = await operationService.getOperationById(id)
            .then((result) => {
                //console.log('aaaa ' + result.data)
                setOperation(result.data)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage('Erro: A operação que está tentando visualizar não existe.')
            });

        //get all reason of operation 
        await reasonService.getReasonfromOperation(id)
            .then((result) => {
                setReason(result.data)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage('Erro: Erro ao buscar motivações da operação.')
            });
    }

    useEffect(() => {
        loadInfo();
        initializeReason();
    }, []);

    //Handle add button on reason
    function handleAddReasonClick() {
        const newReasonArr = [...reason, { id: null, description: '', reasontype_id: 1, operation_id: props.id }];
        console.log('click +');
        console.log(newReasonArr);
        setReason(newReasonArr);
    }
    //Handle delete button on reason items
    function handleMinusReasonClick(index) {
        const newReasonArr = [...reason.slice(0, index), ...reason.slice(index + 1)];
        console.log('click -');
        console.log(newReasonArr);
        setReason(newReasonArr);
    }
    // Handle reasontype change
    function handleReasonTypeChange(e, index) {
        const newReasonArr = [...reason];
        newReasonArr[index].reasontype_id = parseInt(e.target.value); // Assuming the reasontype_id is an integer
        console.log('reasontype change: ');
        console.log(newReasonArr);
        setReason(newReasonArr);
    }
    // Handle reason description change
    function handleReasonDescriptionChange(e, index) {
        const newReasonArr = [...reason];
        newReasonArr[index].description = e.target.value;
        console.log('reasondescription change: ');
        console.log(newReasonArr);
        setReason(newReasonArr);
    }

    const onSubmit = async (data) => {
        try {
            console.log(' OPERACOES NEW - ' + data + data.lead_officer_id)

            // Create Operation
            const operationResult = await operationService.createOperation({
                operation_name: data.operation_name,
                operation_place: data.operation_place,
                operation_planned_date: data.operation_planned_date,
                lead_officer_id: data.lead_officer_id
            });

            // Create Officer_Operation
            for (const of of data.officer_operation_officer_id) {
                const officerOperationResult = await officerService.createOfficerOperation({
                    officer_id: of,
                    operation_id: operationResult.data.id
                });
                console.log(officerOperationResult.data);
            }

            // Create Resource_Operation
            for (const res of data.operation_resource_id) {
                const resourceOperationResult = await resourceService.createResourceOperation({
                    resource_id: res,
                    operation_id: operationResult.data.id // Assuming operationResult has the correct property name
                });
                console.log(resourceOperationResult.data);
            }

            // Create Reason
            for (const reasonItemEdit of reason) {
                reasonItemEdit.operation_id = operationResult.data.id; // Assuming operationResult has the correct property name
                const reasonResult = await reasonService.createReason(reasonItemEdit);
                console.log(reasonResult.data);
            }

            navigate('/operation', {
                state: {
                    alertVariant: 'success',
                    alertMessage: 'Operação criada com sucesso!'
                }
            })

        } catch (error) {
            console.log(error)
            navigate('/operation', {
                state: {
                    alertVariant: 'danger',
                    alertMessage: (error.response.data.error)
                }
            })
        }
    }

    function goBack() {
        navigate('/operation')
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
                            value={operation.operation_planned_date}
                            {...register('operation_planned_date')}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-leader">Responsavel pela Operação</Form.Label>
                        <Form.Select
                            disabled={props.isDisabled}
                            value={operation.lead_officer_id}
                            {...register('lead_officer_id')}
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
                                    id={'officer-' + officer.id}
                                    key={officer.id}
                                    label={officer.team_id ? (`${officer.team.team_name} - ${officer.name}`) : officer.name}
                                    value={officer.id}
                                    {...register('officer_operation_officer_id')}
                                />
                            </ListGroup.Item>

                        ))}
                    </ListGroup>
                    <br />

                    <Form.Label>Viaturas e outros Recursos</Form.Label>
                    <ListGroup >
                        {resources.map((resource) => (
                            <ListGroup.Item>
                                <Form.Check // prettier-ignore
                                    disabled={props.isDisabled}
                                    type={"checkbox"}
                                    id={'resource-' + resource.id}
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


                        {reason.map((reasonItem, index) => (
                            <Row className="mb-2" key={index}>
                                <Col className="col-4">

                                    <Form.Select
                                        disabled={props.isDisabled}
                                        value={reasonItem.reasonTypeId}
                                        onChange={(e) => { handleReasonTypeChange(e, index) }}
                                    >
                                        {(reasontypes.map((reasontype) => (
                                            <option
                                                key={reasontype.id}
                                                value={reasontype.id}
                                                selected={reasontype.id == reasonItem.reasontype_id ? true : ''}
                                            >
                                                {reasontype.description}
                                            </option>
                                        )))
                                        }
                                    </Form.Select>
                                </Col>

                                <Col className="d-flex flex-row">
                                    <Form.Control
                                        disabled={props.isDisabled}
                                        type="text"
                                        value={reasonItem.description}
                                        onChange={(e) => { handleReasonDescriptionChange(e, index) }}
                                    />
                                    <Button
                                        disabled={props.isDisabled}
                                        variant="outline-danger"
                                        className="ms-2"
                                        onClick={() => handleMinusReasonClick(index)}>
                                        <span className="material-symbols-outlined">remove</span>
                                    </Button>
                                </Col>
                            </Row>
                        ))}

                    </Form.Group>

                </Card.Body>
            </Card>

            <div className="my-3 d-flex flex-row justify-content-between">
                <Button variant="secondary" type="button" onClick={goBack}>
                    Voltar a Página Anterior
                </Button>
                <Button type="submit">
                    Cadastrar
                </Button>
            </div>

        </Form >
    </>
}

