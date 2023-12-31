import { Button, Form, InputGroup, Modal, OverlayTrigger, Popover, Stack, Table, Tooltip } from "react-bootstrap";
import { ContentBase } from '../../components/ContentBase';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ResourceService from "../../services/ResourceService";
import ResourceOperationService from "../../services/ResourceOperationService";
import { StatusTagOfficer } from "../../components/StatusTagOfficer";
import BottomAlert from "../../components/BottomAlert";

export function Resources() {

    const location = useLocation();
    const navigate = useNavigate();

    function handleNewTeamClick() {
        navigate('new');
    }

    useEffect(() => {
        checkAlerts();
    }, []);

    const [alert, setAlert] = useState({ show: false, variant: 'primary', message: '' });

    function checkAlerts() {

        if (location.state?.alertMessage) {
            setAlert({
                show: true,
                variant: location.state?.alertVariant,
                message: location.state?.alertMessage
            })
        }
    }

    const handleAlertClose = () => {
        const updatedAlert = { ...alert, show: false, message: '' };
        setAlert(updatedAlert);
    };

    return (
        <>
            <ContentBase />
            <div className='container'>
                <Stack gap={5}>
                    <h1>Viaturas e outros Recursos</h1>
                    <div className='d-flex flex-row w-auto justify-content-between'>
                        <span></span>
                        <Button onClick={handleNewTeamClick}>Registrar Novo Recurso</Button>
                    </div>
                    <TableResources searchbar="" />
                </Stack>
                {alert.show &&
                    <BottomAlert
                        show={alert.show}
                        variant={alert.variant}
                        message={alert.message}
                        onClose={handleAlertClose}
                    />
                }
            </div>
        </>
    );
}
function TableResources(props) {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [resourcetypes, setResourceTypes] = useState([]);
    const [search, setSearch] = useState('')

    const resourceService = new ResourceService();
    const resourceOperationService = new ResourceOperationService();

    async function getResources() {
        try {

            await resourceService.getResources()
                .then((result) => {
                    const rawData = result.data
                    const mappedResult = {};
                    rawData.forEach((item) => {
                        mappedResult[item.id] = item;
                    });

                    setData(mappedResult)
                });

            const resourceTypeData = await resourceService.getResourceTypes();
            setResourceTypes(resourceTypeData.data)

        } catch (error) {
            console.log(error)
            navigate('/*');
        }
    }

    useEffect(() => {
        getResources();
    }, []);

    async function handleEdit(id) {
        try {
            navigate(`${id}/edit`)
        } catch (error) {
            console.error(error);
        }
    }

    async function handleView(id) {
        try {
            navigate(`${id}/view`)
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(data) {
        try {
            const id = data.id

            // search resource_operation where resource_id = id
            const existsResourceOperation = await resourceOperationService.getAllByResourceId({ resource_id: id })

            if (existsResourceOperation.data.length > 0) {
                // if exists, set resource.status = 'INACTIVE'
                var updatedService = data;
                updatedService.status = 'INACTIVE';
                await resourceService.updateResource(updatedService);
            } else {
                // if doesnt exists, deleteResource
                await resourceService.deleteResource({ id: id })
                    .then((data) => {
                        console.log(data);

                        setResourceToDelete([]);
                        setShowDeleteModal(false)
                        getResources();
                    })
            }
        } catch (error) {
            console.error(error);
        }
    }


    const handleSearch = () => {
        console.log(search)
        console.log(data)

        const filteredData = Object.keys(data).filter(key =>
            data[key].description.toLowerCase().includes(search.toLowerCase())
        );

        console.log(filteredData.map(key => data[key]));
        setData(filteredData.map(key => data[key]))

    }

    const clearFilter = () => {
        setSearch('')
        getResources()
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Pesquisar Recurso</Popover.Header>
            <Popover.Body>
                <InputGroup>
                    <Form.Control
                        type="text"
                        size='sm'
                        placeholder="Descrição do recurso"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value) }}
                    />
                    <Button
                        type='submit'
                        variant='dark'
                        onClick={handleSearch}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '16px' }}
                        > search
                        </span>
                    </Button>
                </InputGroup>
                <div className='mt-2'>
                    <a href="#" className="text-primary" onClick={clearFilter}>Limpar filtro</a>
                </div >
            </Popover.Body>
        </Popover>
    );

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState([]);

    return <>

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>
                        <div className='d-flex justify-content-between'>
                            Descrição Recurso
                            <OverlayTrigger trigger="click" placement="top" overlay={popover}>
                                <Button
                                    variant='dark'
                                    size='sm'
                                    style={{ height: "20px", width: "20px", padding: "0px" }}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: '16px' }}
                                    > filter_alt
                                    </span>
                                </Button>
                            </OverlayTrigger>
                        </div>
                    </th>
                    <th>Tipo Recurso</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(data).length > 0 ? (
                    Object.keys(data).map((id, index) => {
                        const matchingResourceType = resourcetypes.find((type) => type.id == data[id].resourcetype_id);
                        return (
                            <TableContent
                                key={id}
                                id={id}
                                index={index + 1}
                                description={data[id].description}
                                status={data[id].status}
                                resourcetype={matchingResourceType ? matchingResourceType.description : data[id].resourcetype_id}
                                viewOperation={async () => handleView(data[id].id)}
                                editOperation={async () => handleEdit(data[id].id)}
                                deleteOperation={() => {
                                    setShowDeleteModal(true);
                                    setResourceToDelete(data[id])
                                }}
                            />
                        );
                    }))
                    : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                Não existe nenhum recurso cadastrado!
                            </td>
                        </tr>
                    )
                }

            </tbody>
        </Table>
        <Modal show={showDeleteModal} >
            <Modal.Header>
                <Modal.Title>Excluir recurso {resourceToDelete.description}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Deseja mesmo excluir este recurso?</p>
                <p>Esta ação não poderá ser desfeita.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => handleDelete(resourceToDelete)}>
                    Excluir
                </Button>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                    Fechar
                </Button>
            </Modal.Footer>

        </Modal>
    </>
}


function TableContent(props) {
    return <tr>
        <td>{props.index}</td>
        <td>{props.description}</td>
        <td>{props.resourcetype}</td>
        <td>
            <StatusTagOfficer status={props.status} />
        </td>
        <td>
            <div>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 200, hide: 200 }}
                    overlay={
                        <Tooltip>
                            Visualizar recurso
                        </Tooltip>
                    }
                >
                    <Button variant="outline-success" size='sm'
                        onClick={props.viewOperation}>
                        <span className="material-symbols-outlined">
                            visibility
                        </span>
                    </Button>
                </OverlayTrigger>
                {' '}

                <OverlayTrigger
                    placement="top"
                    delay={{ show: 200, hide: 200 }}
                    overlay={
                        <Tooltip>
                            {(props.status == 'ACTIVE') ? 'Editar recurso' : ' Não é possivel editar este recurso.'
                            }
                        </Tooltip>
                    }
                >
                    <span className="d-inline-block">
                        <Button
                            variant={(props.status == 'ACTIVE') ? 'outline-primary' : 'outline-secondary'}
                            size='sm'
                            disabled={(props.status == 'ACTIVE') ? false : true}
                            onClick={props.editOperation}>
                            <span className="material-symbols-outlined">
                                edit
                            </span>
                        </Button>
                    </span>
                </OverlayTrigger>

                {' '}
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 200, hide: 200 }}
                    overlay={
                        <Tooltip>
                            {(props.status == 'ACTIVE') ? 'Excluir recurso' : ' Não é possivel excluir este recurso.'
                            }
                        </Tooltip>
                    }
                >
                    <span className="d-inline-block">
                        <Button
                            variant={(props.status == 'ACTIVE') ? 'outline-danger' : 'outline-secondary'}
                            size='sm'
                            disabled={(props.status == 'ACTIVE') ? false : true}
                            onClick={props.deleteOperation}>
                            <span className="material-symbols-outlined">
                                delete
                            </span>
                        </Button>
                    </span>
                </OverlayTrigger>
                {' '}
            </div>
        </td>
    </tr>
}