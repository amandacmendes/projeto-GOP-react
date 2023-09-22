import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, ListGroup, Row, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import OperationService from '../../services/OperationService';
import { useNavigate, useParams } from "react-router-dom";
import OfficerService from "../../services/OfficerService";
import ReasonService from "../../services/ReasonService";
import ResourceService from "../../services/ResourceService";
import { useForm } from "react-hook-form";

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
                    <Content id={params.id} isDisabled={isDisabled} action={params.action} />
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

    const { handleSubmit, register, formState: { errors } } = useForm();
    const navigate = useNavigate();

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
        //console.log(selectedOfficers)
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
        //console.log(selectedResources)
    }

    async function fetchOperation(id) {
        var op = await operationService.getOperationById(id)
            .then((result) => {
                console.log('operation:')
                console.log(result.data)
                setOperation(result.data)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage('Erro: A operação que está tentando visualizar não existe.')
            });

        //get all reason of operation 
        await reasonService.getReasonfromOperation(id)
            .then((result) => {
                //console.log(result.data)
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

    // Handle checkbox changes on Officers
    const handleCheckboxChangeOfficer = (e, officer) => {

        if (!selectedOfficers.hasOwnProperty(e.target.value)) {
            //include officer in selectedOfficers list
            setSelectedOfficers({
                ...selectedOfficers,
                [e.target.value]: officer,
            });
            console.log(selectedOfficers)

        } else {
            //exclude officer from selectedOfficers list 
            const updatedOfficers = { ...selectedOfficers };
            delete updatedOfficers[e.target.value];
            setSelectedOfficers(updatedOfficers);
            console.log(selectedOfficers)
        }
    };

    // Handle checkbox changes on Officers
    const handleCheckboxChangeResource = (e, resource) => {

        if (!selectedResources.hasOwnProperty(e.target.value)) {
            //include resource in selectedResources list
            setSelectedResources({
                ...selectedResources,
                [e.target.value]: resource,
            });
            console.log(selectedResources)

        } else {
            //exclude resource from selectedResources list 
            const updatedResources = { ...selectedResources };
            delete updatedResources[e.target.value];
            setSelectedResources(updatedResources);
            console.log(selectedResources)
        }
    };

    function formatDate(dateString, format) {

        const [year, month, day] = String(dateString).split('T')[0].split('-');

        if (format === 'yyyy-MM-dd') {
            return `${year}-${month}-${day}`;
        }
        if (format === 'dd-MM-yyyy') {
            return `${day}-${month}-${year}`;
        }

        return `${year}-${month}-${day}`;
    }



    async function bulkHandleOfficer() {

        // Checks officerOperation
        // gets all officer_operation where operation_id = props_id ; OfficerOperationVal

        // if OfficerOperationVal doesnt has Selected Officers, will need insert into officer_operation

        // if one OfficerOperationVal.officers is not inside Selected Officers, will need delete officer_operation

    }

    async function bulkHandleResources() {

        // Checks resourceOperation
        // gets all resource_operation where operation_id = props_id ; ResourceOperationVal

        // if ResourceOperationVal doesnt has Selected Resources, will need insert into resource_operation

        // if one ResourceOperationVal.resource is not inside Selected Resources, will need delete resource_operation

    }

    async function updateOperation() {

    }

    const onSubmit = async (data) => {
        //e.preventDefault();


        const updatedOperation = { ...operation }
        updatedOperation.operation_planned_date = data.operation_planned_date
        setOperation(updatedOperation)



        console.log("data: ")
        console.log(data)
        console.log("---------")
        console.log("operation: ")
        console.log(operation)
        console.log("---------")
        console.log("selectedOfficers: ")
        console.log(selectedOfficers)
        console.log("---------")
        console.log("selectedResources: ")
        console.log(selectedResources)
        console.log("---------")



        if (props.action == 'edt') {

            console.log("action edit")

            console.log(officers)

            //Update
            await operationService.update({
                id: props.id,
                operation_name: data.operation_name,
                operation_place: data.operation_place,
                operation_planned_date: data.operation_planned_date,
                lead_officer_id: data.lead_officer_id

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
                            required
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
                            required
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-date">Data da Operação</Form.Label>
                        <Form.Control
                            id="datecontrol"
                            type="date"
                            disabled={props.isDisabled}
                            value={formatDate(operation.operation_planned_date, 'yyyy-MM-dd')}
                            {...register('operation_planned_date')}
                            onChange={(e) => {
                                const date = formatDate(e.target.value, 'yyyy-MM-dd')
                                setOperation({ ...operation, operation_planned_date: e.target.value })
                            }}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-leader">Responsavel pela Operação</Form.Label>
                        <Form.Select
                            disabled={props.isDisabled}
                            {...register('lead_officer_id')}
                            onChange={(e) => { setOperation({ ...operation, lead_officer_id: e.target.value }) }}
                        >
                            <option>Selecione um oficial</option>
                            {officers.map((officer) => (
                                <option
                                    selected={(officer.id == operation.lead_officer_id ? true : false)}
                                    key={officer.id}
                                    value={officer.id}
                                >
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
                            <ListGroup.Item key={officer.id}>
                                <Form.Check
                                    id={officer.id}
                                    key={officer.id}
                                    type={"checkbox"}
                                    value={officer.id}
                                    checked={selectedOfficers.hasOwnProperty(officer.id)}
                                    onChange={(e) => handleCheckboxChangeOfficer(e, officer)}
                                    disabled={props.isDisabled}
                                    label={officer.name}
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
                                    id={resource.id}
                                    key={resource.id}
                                    type={"checkbox"}
                                    value={resource.id}
                                    checked={selectedResources.hasOwnProperty(resource.id)}
                                    onChange={(e) => handleCheckboxChangeResource(e, resource)}
                                    disabled={props.isDisabled}
                                    label={resource.description}
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

                                    <Form.Select
                                        disabled={props.isDisabled}
                                        value={reasonItem.reasonTypeId || ''}
                                    >

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
            <Button variant="primary" type="submit" hidden={props.isDisabled}>
                {props.action == 'edit' ? 'Registrar Edições' : 'Cadastrar'}
            </Button>
        </Form >
    </>
}

