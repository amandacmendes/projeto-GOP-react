import '../../css/style.css';
import { Alert, Button, Form, InputGroup, Modal, NavLink, OverlayTrigger, Popover, Stack, Table } from "react-bootstrap";
import { ContentBase } from '../../components/ContentBase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TeamsService from '../../services/TeamsService';
import OfficerService from '../../services/OfficerService';
import { useForm } from 'react-hook-form';
import BottomAlert from '../../components/BottomAlert';
import OfficerOperationService from '../../services/OfficerOperationService';
import { StatusTagOfficer } from '../../components/StatusTagOfficer';
import OperationService from '../../services/OperationService';

export function Officers() {

    const [alert, setAlert] = useState({ show: false, variant: 'primary', message: null });

    const handleAlertClose = () => {
        const updatedAlert = { ...alert, show: false };
        setAlert(updatedAlert);
    };

    const navigate = useNavigate();

    const [data, setData] = useState([]);

    const [showModalOfficer, setShowModalOfficer] = useState(false);

    const [officer, setOfficer] = useState([])
    const [modalAction, setModalAction] = useState('');

    const officerService = new OfficerService();

    async function getOfficers() {
        try {
            await officerService.getOfficersWithTeams()
                .then((result) => {
                    const mappedResult = {};
                    result.forEach((item) => {
                        mappedResult[item.id] = item;
                    });

                    setData(mappedResult)

                });
        } catch (error) {
            console.log(error);
            navigate('/*');
        }
    }

    useEffect(() => {
        getOfficers();
    }, []);

    function handleNewOfficer() {
        try {
            setOfficer({ id: null })
            setShowModalOfficer(true)
            setModalAction('new')

        } catch (error) {
            console.error(error);
        }
    }
    async function handleEdit(data) {
        try {
            setOfficer(data)
            setShowModalOfficer(true)
            setModalAction('edit')
        } catch (error) {
            console.error(error);
        }
    }

    const officerOperationService = new OfficerOperationService();
    const operationService = new OperationService();

    async function handleDelete(data) {
        try {
            // NEEDSALERT NEEDS ALERT delete
            console.log(data)

            if (data.id > 0) {

                const isLeadOfficer = await operationService.getOperationByLeadOfficerId(data);
                console.log(isLeadOfficer.data.length)

                const isInOperation = await officerOperationService.getByOfficerId({ officer_id: data.id });
                console.log(isInOperation.data.length)

                if (isLeadOfficer.data.length > 0 || isInOperation.data.length > 0) {
                    // officer is lead_officer somewhere, so just change status to inactive
                    // OR officer is in operation, so change status to inactive

                    var updated = { ...data, status: 'INACTIVE' };
                    console.log("update " + updated);

                    await officerService.updateOfficer(updated)
                        .then((result) => {
                            console.log('aaa')
                            console.log(result)
                            getOfficers();

                        });

                } else {
                    // officer is not in any operations, so it's okay to delete it 
                    await officerService.deleteOfficer(data.id)
                        .then((result) => {
                            console.log(result)
                            getOfficers();
                        });
                }
            }

        } catch (error) {

            console.error(error);

        }
    }

    const [search, setSearch] = useState('')

    const handleSearch = () => {
        console.log(search)
        console.log(data)

        const filteredData = Object.keys(data).filter(key =>
            data[key].name.toLowerCase().includes(search.toLowerCase())
        );

        console.log(filteredData.map(key => data[key]));
        setData(filteredData.map(key => data[key]))

    }

    const clearFilter = () => {
        setSearch('')
        getOfficers()
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Pesquisar por nome</Popover.Header>
            <Popover.Body>
                <InputGroup>
                    <Form.Control
                        type="text"
                        size='sm'
                        placeholder="Nome do policial"
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
    const [officerToDelete, setOfficerToDelete] = useState([]);

    return (
        <>
            <ContentBase />
            <div className='container'>
                <Stack gap={5}>
                    <div className='d-flex flex-row w-auto justify-content-between'>
                        <h1>Policiais</h1>
                        <div>
                            <Button onClick={handleNewOfficer}>Registrar Novo Policial</Button>
                        </div>
                    </div>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>
                                    <div className='d-flex justify-content-between'>
                                        Nome
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
                                <th>Equipe</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(data).length > 0 ? (
                                Object.keys(data).map((id, index) => (
                                    <TableContent
                                        key={id}
                                        index={index + 1}
                                        id={data[id].id}
                                        team_name={data[id].team ? data[id].team.team_name : ''}
                                        name={data[id].name}
                                        status={data[id].status}
                                        editOfficer={async () => handleEdit(data[id])}
                                        //deleteOperation={async () => handleDelete(data[id])}
                                        deleteOfficer={() => {
                                            setShowDeleteModal(true);
                                            setOfficerToDelete(data[id])
                                        }}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Não existe nenhum policial cadastrado!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {(showModalOfficer) ?
                        <ModalOfficer
                            officer={officer}
                            action={modalAction}
                            showModal={showModalOfficer}
                            setShowModal={setShowModalOfficer}
                            getOfficers={getOfficers}
                            setAlert={setAlert} // Pass the function here
                        />
                        : ''
                    }
                </Stack>
            </div>
            {alert.message && (
                <div style={{ position: "absolute", bottom: 0, right: 0, zIndex: 999 }}>
                    <Alert
                        variant={alert.variant}
                        onClose={handleAlertClose}
                        dismissible
                    >
                        <p>{alert.message}</p>
                    </Alert>
                </div>
            )}


            <Modal show={showDeleteModal} >
                <Modal.Header>
                    <Modal.Title>Excluir policial {officerToDelete.description}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Deseja mesmo excluir este policial?</p>
                    <p>Esta ação não poderá ser desfeita.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleDelete(officerToDelete)}>
                        Excluir
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Fechar
                    </Button>
                </Modal.Footer>

            </Modal>

        </>
    );
}

function TableContent(props) {
    return (
        <tr key={props.id}>
            <td>{props.index}</td>
            <td>{props.name}</td>
            <td>{props.team_name}</td>
            <td>
                <StatusTagOfficer status={props.status} />
            </td>
            <td colSpan={1}>
                <div>

                    <Button
                        variant="outline-primary"
                        size='sm'
                        onClick={props.editOfficer}
                        disabled={props.status == 'ACTIVE' ? false : true}
                    >
                        <span className="material-symbols-outlined">
                            edit
                        </span>
                    </Button>{' '}
                    <Button
                        variant="outline-danger"
                        size='sm'
                        onClick={props.deleteOfficer}
                        disabled={props.status == 'ACTIVE' ? false : true}
                    >
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                    </Button>{' '}
                </div>
            </td>
        </tr>
    )
}

function ModalOfficer(props) {


    const [officer, setOfficer] = useState({ id: null, name: '', team_id: null })
    const [team, setTeam] = useState([]);
    const { showModal, setShowModal, action } = props;

    const { handleSubmit, register, formState: { errors } } = useForm();

    useEffect(() => {
        loadData();
    }, []);

    const teamService = new TeamsService();
    const officerService = new OfficerService();

    function loadData() {

        const team = teamService.getAllTeams()
            .then((result) => {
                setTeam(result.data)
            })

        if (props.officer.id > 0) {
            setOfficer({ id: props.officer.id, name: props.officer.name, team_id: props.officer.team_id })
        }
    }


    const onSubmit = async (data) => {
        try {

            setOfficer({ ...officer, name: data.name, team_id: data.team_id })

            if (props.action == 'edit') {

                await officerService.updateOfficer(officer)
                    .then((result) => {
                        console.log(result);
                        props.setAlert({ show: true, variant: 'success', message: result.data.message });
                    })

                setShowModal(false);
                props.setShowModal(false);
                props.getOfficers(); // Call the function to reload data

            } else if (props.action == 'new') {

                await officerService.createOfficer(officer)
                    .then((result) => {
                        console.log(result);
                        props.setAlert({ show: true, variant: 'success', message: result.data.message });
                    })
                props.setShowModal(false);
                props.getOfficers(); // Call the function to reload data

            }

            props.setShowModal(false);
            props.getOfficers(); // Call the function to reload data

        } catch (error) {

        }
    }

    return (
        <>
            <Modal show={showModal} onHide={() => {
                props.setShowModal(false);
                props.getOfficers(); // Call the function to reload data
            }} >
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>
                        <Modal.Title>{(action === 'edit') ? 'Editar Policial' : 'Cadastrar Policial'}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Nome do Policial</Form.Label>
                            <Form.Control
                                type='text'
                                className="mb-3"
                                required={true}
                                {...register('name')}
                                value={officer.name}
                                onChange={(e) => { setOfficer({ ...officer, name: e.target.value }) }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Equipe</Form.Label>
                            <Form.Select
                                {...register('team_id')}
                                onChange={(e) => { setOfficer({ ...officer, team_id: e.target.value }) }}
                            >
                                <option>Selecione uma equipe</option>
                                {team.map((teamItem) => (
                                    <option
                                        selected={(teamItem.id == officer.team_id ? true : false)}
                                        key={teamItem.id}
                                        value={teamItem.id}
                                    >
                                        {teamItem.team_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" type="submit">
                            Salvar
                        </Button>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Fechar
                        </Button>
                    </Modal.Footer>

                </Form>
            </Modal>

        </>
    )
}