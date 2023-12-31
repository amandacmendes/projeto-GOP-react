import '../../css/style.css';
import { ContentBase } from '../../components/ContentBase';
import { Form, InputGroup, Modal, OverlayTrigger, Popover, Stack, Table, Tooltip } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import OperationService from '../../services/OperationService';
import { useLocation, useNavigate } from 'react-router-dom';
import { StatusTag } from '../../components/StatusTag';
import OfficerOperationService from '../../services/OfficerOperationService';
import ResourceOperationService from '../../services/ResourceOperationService';
import ReasonService from '../../services/ReasonService';
import BottomAlert from '../../components/BottomAlert';

export function Operacoes() {
    const navigate = useNavigate();
    const location = useLocation();

    function handleNewOpClick() {
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
                    <h1>Operações Policiais</h1>
                    <div className='d-flex flex-row w-auto justify-content-between'>
                        <span></span>
                        <Button onClick={handleNewOpClick}>Registrar Nova Operação</Button>
                    </div>
                    <TableOperacoes />
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

function TableOperacoes(props) {

    const [data, setData] = useState([]);
    const [alert, setAlert] = useState({ show: false, variant: 'primary', message: '' });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [operationToDelete, setOperationToDelete] = useState([]);

    const [search, setSearch] = useState('')

    const navigate = useNavigate();

    const operationService = new OperationService();

    const officerOperationService = new OfficerOperationService();
    const resourceOperationService = new ResourceOperationService();
    const reasonService = new ReasonService();

    async function getOperations() {
        try {
            const result = await operationService.getOperations();

            const rawData = result.data;
            const mappedResult = {};
            rawData.forEach((item) => {
                mappedResult[item.id] = item;
            });

            setData(mappedResult)

        } catch (error) {
            console.error(error);
            navigate('/');
        }
    }

    useEffect(() => {
        getOperations();
    }, []);

    async function handleEditOperation(id) {
        try {
            navigate(`${id}/edit`)
        } catch (error) {
            console.error(error);
        }
    }

    async function handleViewOperation(id) {
        try {
            navigate(`${id}/view`)
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteOperation(data) {
        try {

            if (data.status == 'OPENED') {
                //delete officer operation ok
                const ofOp = await officerOperationService.getByOperationId({ operation_id: data.id })
                if (ofOp.data.length > 0) {
                    await officerOperationService.deleteByOperationId({ operation_id: data.id })
                }

                // delete resource operation
                const resOp = await resourceOperationService.getAllByOperationId({ operation_id: data.id });
                if (resOp.data.length > 0) {
                    await resourceOperationService.deleteByOperationId({ operation_id: data.id })
                }

                //delete reason        
                const reasonOp = await reasonService.getReasonfromOperation(data.id)
                if (reasonOp.data.length > 0) {
                    reasonOp.data.forEach(async (reason) => {
                        await reasonService.deleteReason(reason);
                    });
                }

                // delete operation
                await operationService.deleteOperation(data).then(() => {
                    setAlert({ show: true, variant: 'success', message: 'Operação excluída com sucesso!' })
                });

            } else if (data.status == 'TRIGGERED') {
                // update status canceled
                const updatedOperation = { ...data, status: "CANCELED" }
                console.log("update status canceled")
                console.log(updatedOperation)
                await operationService.update(updatedOperation).then(() => {
                    setAlert({ show: true, variant: 'success', message: 'Operação cancelada.' })
                });
            }

            //Finished! 
            setOperationToDelete([]);
            setShowDeleteModal(false)
            await getOperations();

        } catch (error) {
            console.error(error);
        }
    }


    const handleSearch = () => {
        console.log(search)
        console.log(data)

        const filteredData = Object.keys(data).filter(key =>
            data[key].operation_name.toLowerCase().includes(search.toLowerCase())
        );

        console.log(filteredData.map(key => data[key]));
        setData(filteredData.map(key => data[key]))

    }

    const clearFilter = () => {
        setSearch('')
        getOperations()
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Pesquisar por nome da operação</Popover.Header>
            <Popover.Body>
                <InputGroup>
                    <Form.Control
                        type="text"
                        size='sm'
                        placeholder="Informe o nome da operação"
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

    const handleAlertClose = () => {
        const updatedAlert = { ...alert, show: false, message: '' };
        setAlert(updatedAlert);
    };

    return <>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th colSpan={2}>
                        <div className='d-flex justify-content-between'>
                            Nome da Operação

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
                    <th>Local da Operação</th>
                    <th>Data Prevista da Operação</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(data).length > 0 ? (
                    Object.keys(data).map((id, index) => (
                        <TableContent
                            keys={data[id].id}
                            index={index + 1}
                            operation_name={data[id].operation_name}
                            operation_place={data[id].operation_place}
                            operation_date={data[id].operation_date ? data[id].operation_date : data[id].operation_planned_date}
                            status={data[id].status}
                            id={data[id].id}
                            viewOperation={async () =>
                                handleViewOperation(data[id].id)}
                            editOperation={async () => handleEditOperation(data[id].id)}
                            deleteOperation={() => {
                                setShowDeleteModal(true);
                                setOperationToDelete(data[id])
                            }
                            }
                        />
                    )))
                    : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Não existe nenhuma operação cadastrada!
                            </td>
                        </tr>
                    )
                }

            </tbody>
        </Table>
        <Modal show={showDeleteModal} >
            <Modal.Header>
                <Modal.Title>Excluir operação {operationToDelete.operation_name}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Deseja mesmo excluir esta operação?</p>
                <p>Esta ação não poderá ser desfeita.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => handleDeleteOperation(operationToDelete)}>
                    Excluir
                </Button>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>

        {alert.show &&
            <BottomAlert
                show={alert.show}
                variant={alert.variant}
                message={alert.message}
                onClose={handleAlertClose}
            />
        }
    </>
}

function TableContent(props) {
    return <tr>
        <td>{props.index}</td>
        <td colSpan={2}>{props.operation_name}</td>
        <td>{props.operation_place}</td>
        <td>{new Date(Date.parse(props.operation_date)).toLocaleDateString('pt-BR')}</td>
        <td colSpan={1} className='text-center'>
            <StatusTag
                id={props.id}
                operation_name={props.operation_name}
                status={props.status}>
            </StatusTag>
        </td>
        <td colSpan={1} className='text-center'>
            <div>

                <OverlayTrigger
                    placement="top"
                    delay={{ show: 200, hide: 200 }}
                    overlay={
                        <Tooltip>
                            Visualizar operação
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
                            {(props.status == 'OPENED') ? 'Editar operação' : ' Não é possivel editar esta operação.'
                            }
                        </Tooltip>
                    }
                >
                    <span className="d-inline-block">
                        <Button
                            variant={(props.status == 'OPENED') ? 'outline-primary' : 'outline-secondary'}
                            size='sm'
                            onClick={props.editOperation}
                            disabled={(props.status == 'OPENED') ? false : true}
                        >
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
                    overlay={<Tooltip>{getTooltipContent(props.status)}</Tooltip>}
                >
                    <span className="d-inline-block">
                        <Button
                            variant={(props.status == 'FINISHED' || props.status == 'CANCELED') ? 'outline-secondary' : 'outline-danger'}
                            size='sm'
                            onClick={props.deleteOperation}
                            disabled={(props.status == 'FINISHED' || props.status == 'CANCELED') ? true : false}
                        >
                            <span className="material-symbols-outlined">
                                delete
                            </span>
                        </Button>
                    </span>
                </OverlayTrigger>
                {' '}

            </div>
        </td>
    </tr >
}

function getTooltipContent(status) {

    switch (status) {
        case "FINISHED":
            return 'Não é possível excluir operações já concluídas';
        case "CANCELED":
            return 'Não é possível excluir operações canceladas';
        case "TRIGGERED":
            return 'Cancelar Operação';
        default:
            return 'Excluir Operação';
    }
}