import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, InputGroup, ListGroup, Overlay, OverlayTrigger, Row, Stack, Tooltip } from "react-bootstrap";
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
                <Stack gap={4}>
                    <div className="d-flex flex-row justify-content-between">
                        <h1>{pagetitle}</h1>

                    </div>
                    <Content id={params.id} isDisabled={isDisabled} action={params.action} />
                    <br /><br />
                </Stack>
            </div>
        </>
    );
}

function Content(props) {

    const [isDisabledParam, setIsDisabledParam] = useState(props.isDisabled);

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

    const [selectedOfficers, setSelectedOfficers] = useState([]);
    const [selectedResources, setSelectedResources] = useState([]);

    //For edit purposes
    const [selectedOfficersBeforeEdit, setSelectedOfficersBeforeEdit] = useState([]);
    const [selectedResourcesBeforeEdit, setSelectedResourcesBeforeEdit] = useState([]);
    const [origReason, setOrigReason] = useState([]);

    const { handleSubmit, register, formState: { errors } } = useForm();
    const navigate = useNavigate();

    async function loadInfo() {
        // for New Operation - load officers, resources and reason types
        await officerService.getOfficersWithTeams()
            .then((result) => {

                var data = result;

                //if (props.action == 'edit') {
                const filteredData = result.filter(item => item.status !== 'INACTIVE');
                data = filteredData;
                //}

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

                var data = result.data;

                //if (props.action == 'edit') {
                const filteredData = result.data.filter(item => item.status !== 'INACTIVE');
                data = filteredData;
                //}

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
                setSelectedOfficers(selOfficers);
                setSelectedOfficersBeforeEdit(selOfficers);
            })
    }

    async function fetchSelectedResources(operation_id) {

        await resourceService.getAllResourcesFromOperation({ id: operation_id })
            .then((result) => {
                const selResources = result.data.reduce((acc, resource) => {
                    acc[resource.resource_id] = resource;
                    return acc;
                }, {})
                setSelectedResources(selResources);
                setSelectedResourcesBeforeEdit(selResources);
            })
    }

    async function fetchOperation(id) {
        var op = await operationService.getOperationById(id)
            .then((result) => {

                if (result.data.status != 'OPENED') {
                    setIsDisabledParam(true);
                }
                setOperation(result.data);
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage('Erro: A operação que está tentando visualizar não existe.');
            });

        //get all reason of operation 
        await reasonService.getReasonfromOperation(id)
            .then((result) => {
                setReason(result.data);
                setOrigReason(result.data);
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage('Erro: Erro ao buscar motivações da operação.');
            });
    }

    useEffect(() => {
        loadInfo()
    }, []);

    //Handle add button on reason
    function handleAddReasonClick() {
        const newReasonArr = [...reason, { id: null, description: '', reasontype_id: 1, operation_id: props.id }];
        setReason(newReasonArr);
    }
    //Handle delete button on reason items
    function handleMinusReasonClick(index) {
        const newReasonArr = [...reason.slice(0, index), ...reason.slice(index + 1)];
        setReason(newReasonArr);
    }
    // Handle reasontype change
    function handleReasonTypeChange(e, index) {
        const newReasonArr = [...reason];
        newReasonArr[index].reasontype_id = parseInt(e.target.value); // Assuming the reasontype_id is an integer
        setReason(newReasonArr);
    }
    // Handle reason description change
    function handleReasonDescriptionChange(e, index) {
        const newReasonArr = [...reason];
        newReasonArr[index].description = e.target.value;
        setReason(newReasonArr);
    }

    // Handle checkbox changes on Officers
    const handleCheckboxChangeOfficer = (e, officer) => {

        if (!selectedOfficers.hasOwnProperty(e.target.value)) {
            //include officer in selectedOfficers list
            setSelectedOfficers({
                ...selectedOfficers,
                [e.target.value]: officer,
            });

        } else {
            //exclude officer from selectedOfficers list 
            const updatedOfficers = { ...selectedOfficers };
            delete updatedOfficers[e.target.value];
            setSelectedOfficers(updatedOfficers);
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

        } else {
            //exclude resource from selectedResources list 
            const updatedResources = { ...selectedResources };
            delete updatedResources[e.target.value];
            setSelectedResources(updatedResources);
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



    async function updateOfficerOperation() {

        // Check for officer_operations to create
        for (const selOfficer in selectedOfficers) {
            if (selectedOfficers[selOfficer].name) {
                //Create officer_operation from selectedOfficers
                await officerService.createOfficerOperation({ officer_id: selectedOfficers[selOfficer].id, operation_id: props.id })
            }
        }

        // Check for officer_operations to delete
        for (const origOfficers in selectedOfficersBeforeEdit) {
            if (!(selectedOfficers.hasOwnProperty(origOfficers))) {
                // delete officer_operation of this orig_officer, its not on the selected list anymore
                await officerService.deleteOfficerOperation(selectedOfficersBeforeEdit[origOfficers])
            }
        }

    }

    async function updateResourceOperation() {

        // Check for resource_operation to create
        for (const selResource in selectedResources) {
            if (selectedResources[selResource].description) {
                await resourceService.createResourceOperation({ resource_id: selectedResources[selResource].id, operation_id: props.id })
            }
        }

        // Check for resource_operation to delete
        for (const origResource in selectedResourcesBeforeEdit) {
            if (!(selectedResources.hasOwnProperty(origResource))) {
                await resourceService.deleteResourceOperation(selectedResourcesBeforeEdit[origResource])
            }
        }
    }

    async function updateReasons() {
        // Check for reasons to create
        for (const i in reason) {
            if (!reason[i].id) {
                await reasonService.createReason(reason[i])
            }
        }

        // Check for resource_operation to update or delete
        for (const i in origReason) {
            if (reason.includes(origReason[i])) {

                if (!(reason.indexOf(origReason[i]) === origReason[i])) {
                    //update
                    await reasonService.updateReason(origReason[i])
                }
            } else {
                // delete
                await reasonService.deleteReason(origReason[i])
            }
        }
    }

    const onSubmit = async (data) => {

        if (data.operation_planned_date) {
            const updatedOperation = { ...operation }
            updatedOperation.operation_planned_date = data.operation_planned_date
            setOperation(updatedOperation)
        }

        if (props.action == 'edit') {

            await operationService.update({
                id: props.id,
                operation_name: operation.operation_name,
                operation_place: operation.operation_place,
                operation_planned_date: operation.operation_planned_date,
                lead_officer_id: operation.lead_officer_id

            }).then((result) => {
                // officer operation
                updateOfficerOperation().then((result) => {
                    // resource operation
                    updateResourceOperation().then((result) => {
                        // reasons
                        updateReasons().then((result) => {
                            navigate('/operation', {
                                state: {
                                    alertVariant: 'success',
                                    alertMessage: 'Operação atualizada com sucesso!'
                                }
                            })
                        });
                    });
                });
            }).catch((error) => {
                console.log(error)
                navigate('/operation', {
                    state: {
                        alertVariant: 'danger',
                        alertMessage: (error.response.data.error)
                    }
                })
            });

        }
    }

    function goBack() {
        navigate('/operation');
    }

    function changeStatus() {
        // Throw status change Alert NEEDSALERT NEEDS ALERT
        operationService.update({ id: props.id, status: 'TRIGGERED' })
            .then((result) => {
                navigate('/operation', {
                    state: {
                        alertVariant: 'success',
                        alertMessage: 'Status atualizado para Deflagrado!'
                    }
                });
            })
            .catch((error) => {
                console.log(error);
                navigate('/operation', {
                    state: {
                        alertVariant: 'danger',
                        alertMessage: (error.response.data.error)
                    }
                });
            })

    }

    return <>

        <Form onSubmit={handleSubmit(onSubmit)}>

            {(operation.status == 'OPENED') &&
                <div className="mb-3 d-flex flex-row-reverse">
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 70, hide: 400 }}
                        overlay={
                            <Tooltip>
                                Ao clicar neste botão você mudará o status desta operação para "Deflagrada", e não poderá mais editar as informações.
                            </Tooltip>
                        }>
                        <Button
                            disabled={isDisabledParam}
                            className="px-5 d-flex-column align-items-center justify-content-center"
                            variant="warning"
                            type="button"
                            onClick={changeStatus} >
                            <b>
                                <span className="material-symbols-outlined">local_police</span>
                                Mudar Status para Deflagrada
                            </b>
                        </Button>
                    </OverlayTrigger>
                </div>
            }

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
                            disabled={isDisabledParam}
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
                            disabled={isDisabledParam}
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
                            disabled={isDisabledParam}
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
                            disabled={isDisabledParam}
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
                                    disabled={isDisabledParam}
                                    label={officer.name}
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
                                    id={resource.id}
                                    key={resource.id}
                                    type={"checkbox"}
                                    value={resource.id}
                                    checked={selectedResources.hasOwnProperty(resource.id)}
                                    onChange={(e) => handleCheckboxChangeResource(e, resource)}
                                    disabled={isDisabledParam}
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
                            <Col className="col-6">
                                <Form.Label controlId="form-label-reason">Objeto de trabalho policial</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label controlId="form-label-reason">Descrição</Form.Label>
                            </Col>
                            <Col className="d-flex flex-row-reverse">
                                <Button
                                    onClick={handleAddReasonClick}
                                    disabled={isDisabledParam}
                                >
                                    Adicionar
                                </Button>
                            </Col>
                        </Row>


                        {reason.map((reasonItem, index) => (
                            <Row className="mb-2" key={index}>
                                <Col className="col-6">

                                    <Form.Select
                                        disabled={isDisabledParam}
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
                                        disabled={isDisabledParam}
                                        type="text"
                                        value={reasonItem.description}
                                        onChange={(e) => { handleReasonDescriptionChange(e, index) }}
                                    />
                                    <Button
                                        disabled={isDisabledParam}
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

            {operation.operation_results_report &&
                <span>
                    <h3>Resultados</h3>
                    <Card className="my-3">
                        <Card.Body>

                            <Form>
                                <Form.Group>
                                    <Form.Label>Data de Realização</Form.Label>
                                    <Form.Control
                                        disabled
                                        type='date'
                                        value={formatDate(operation.operation_date, 'yyyy-MM-dd')}
                                        className="mb-3"
                                    //value={operation.date}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Ocorrencia de Prisões</Form.Label>
                                    <Form.Control
                                        disabled
                                        type='number'
                                        className="mb-3"
                                        value={operation.operation_results_arrests}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Ocorrencia de Apreensões</Form.Label>
                                    <Form.Control
                                        disabled
                                        type='number'
                                        className="mb-3"
                                        value={operation.operation_results_seizures}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Ocorrencia de Fatalidades</Form.Label>
                                    <Form.Control
                                        disabled
                                        type='number'
                                        className="mb-3"
                                        value={operation.operation_results_deaths}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Relatório</Form.Label>
                                    <Form.Control
                                        disabled
                                        type='text' as="textarea"
                                        rows={20}
                                        className="mb-3"
                                        value={operation.operation_results_report}
                                    />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </span>
            }


            <div className="mt-4 my-3 d-flex flex-row justify-content-between">
                <Button variant="secondary" type="button" onClick={goBack}>
                    Voltar a Página Anterior
                </Button>

                <Button variant="primary" type="submit" hidden={isDisabledParam}>
                    {props.action == 'edit' ? 'Registrar Edições' : ''}
                </Button>
            </div>
        </Form >
    </>
}

function Report(props) {

    const operation = props.operation;


    return <>
        {operation.operation_name}
    </>
}