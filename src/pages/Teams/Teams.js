import '../../css/style.css';
import { Button, Form, InputGroup, Modal, OverlayTrigger, Popover, Stack, Table } from "react-bootstrap";
import { ContentBase } from '../../components/ContentBase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TeamsService from '../../services/TeamsService';
import OfficerService from '../../services/OfficerService';

export function Teams() {

    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    function handleNewTeamClick() {
        navigate('new');
    }

    function handleSearch(e) {
        setSearch(e);
    }

    return (
        <>
            <ContentBase />
            <div className='container'>
                <Stack gap={5}>
                    <h1>Equipes</h1>
                    <div className='d-flex flex-row w-auto justify-content-between'>
                        <span></span>
                        <Button onClick={handleNewTeamClick}>Registrar Nova Equipe</Button>
                    </div>
                    <TableTeams searchbar="" />
                </Stack>
            </div>
        </>
    );
}

function TableTeams(props) {

    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const teamsService = new TeamsService();
    const officerService = new OfficerService();

    async function getTeams() {
        try {
            const result = await teamsService.getTeamsWithOfficers();
            const rawData = result;

            const mappedResult = {};

            rawData.forEach((item) => {
                mappedResult[item.id] = item;
            });

            setData(mappedResult);
        } catch (error) {
            console.log(error)
            navigate('/*');
        }
    }

    useEffect(() => {
        getTeams();
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

    async function handleDeleteTeam(data) {
        try {
            const id = data.id;

            // Update Officers to team_id = null
            const officers = data.officers

            if (officers.length > 0) {

                const updatedOfficers = officers.map(officer => ({
                    ...officer,
                    team_id: null
                }));

                // Bulk Update Officers: 
                const updatePromises = updatedOfficers.map((officer) => officerService.updateOfficer(officer));

                await Promise.all(updatePromises)
                    .then((result) => {
                        console.log(result)
                    })
                    .catch((error) => {
                        console.error(`Error updating officers: ${error}`);
                    });

            }

            // Delete team 
            await teamsService.delete(id);

            setTeamToDelete([]);
            setShowDeleteModal(false)
            getTeams();

        } catch (error) {
            console.error(error);
        }
    }


    const [search, setSearch] = useState('')

    const handleSearch = () => {
        console.log(search)
        console.log(data)

        const filteredData = Object.keys(data).filter(key =>
            data[key].team_name.toLowerCase().includes(search.toLowerCase())
        );

        console.log(filteredData.map(key => data[key]));
        setData(filteredData.map(key => data[key]))

    }

    const clearFilter = () => {
        setSearch('')
        getTeams()
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Pesquisar por Equipe</Popover.Header>
            <Popover.Body>
                <InputGroup>
                    <Form.Control
                        type="text"
                        size='sm'
                        placeholder="Nome da equipe"
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
    const [teamToDelete, setTeamToDelete] = useState([]);


    return <>

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>
                        <div className='d-flex justify-content-between'>

                            Nome da Equipe
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
                    <th>Quantidade Efetivos</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {data && Object.keys(data).length > 0 ? (
                    Object.keys(data).map((id, index) => (
                        <TableContent
                            key={data[id].id} // Add a unique key for each TableContent element
                            id={data[id].id}
                            index={index}
                            team_name={data[id].team_name}
                            team_size={data[id].officers.length}
                            viewOperation={async () => handleViewOperation(data[id].id)}
                            editOperation={async () => handleEditOperation(data[id].id)}
                            deleteOperation={() => {

                                setShowDeleteModal(true);
                                setTeamToDelete(data[id])
                            }}
                        />
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center">
                            Não existe nenhuma equipe cadastrada!
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
        <Modal show={showDeleteModal} >
            <Modal.Header>
                <Modal.Title>Excluir equipe {teamToDelete.team_name}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Deseja mesmo excluir esta equipe?</p>
                <p>Esta ação não poderá ser desfeita.</p>
                <p className='text-danger'>Obs.: A exclusão do registro de equipe não ocasiona a exclusão dos policiais nela.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => handleDeleteTeam(teamToDelete)}>
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
    return <tr key={props.id}>
        <td>{props.index}</td>
        <td>{props.team_name}</td>
        <td>{props.team_size}</td>
        <td>
            <div>
                <Button variant="outline-success" size='sm'
                    onClick={props.viewOperation}>
                    <span className="material-symbols-outlined">
                        pageview
                    </span>
                </Button>{' '}
                <Button variant="outline-primary" size='sm'
                    onClick={props.editOperation}>
                    <span className="material-symbols-outlined">
                        edit
                    </span>
                </Button>{' '}
                <Button variant="outline-danger" size='sm'
                    onClick={props.deleteOperation}>
                    <span className="material-symbols-outlined">
                        delete
                    </span>
                </Button>{' '}
            </div>
        </td>
    </tr>
}