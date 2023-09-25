import '../../css/style.css';
import { Button, Form, InputGroup, Modal, Stack, Table } from "react-bootstrap";
import { ContentBase } from '../../components/ContentBase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TeamsService from '../../services/TeamsService';
import OfficerService from '../../services/OfficerService';

export function Officers() {

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
                    <h1>Policiais</h1>
                    <div className='d-flex flex-row w-auto justify-content-between'>
                        <Form className='w-50'>
                            <InputGroup>
                                <Form.Control
                                    type='text'
                                    placeholder='Digite o nome do policial...'
                                    onChange={(e) => { handleSearch(e.target.value) }}
                                    value={this.state.search}
                                ></Form.Control>
                                <Button id="basic-addon2">
                                    <span class="material-symbols-outlined">
                                        search
                                    </span>
                                </Button>
                            </InputGroup>
                        </Form>
                        <Button onClick={handleNewTeamClick}>Registrar Novo Policial</Button>
                    </div>
                    <TableOfficers searchbar="" />
                </Stack>
            </div>
        </>
    );
}

function TableOfficers(props) {

    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const teamsService = new TeamsService();
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
                    console.log(mappedResult)
                });
        } catch (error) {
            console.log(error)
            navigate('/*');
        }
    }

    useEffect(() => {
        getOfficers();
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

    async function handleDeleteTeam(id) {
        try {

            const officers = data.filter((thisTeam) => thisTeam.id == id)[0].officers
            console.log(officers)

            const updatedOfficers = officers.map(officer => ({
                ...officer,
                team_id: null
            }));

            // Bulk Update: 
            const updatePromises = updatedOfficers.map((officer) => officerService.updateOfficer(officer));

            Promise.all(updatePromises)
                .then((result) => {
                    console.log('All officers updated successfully.');
                    teamsService.delete(id);
                    return result;
                })
                .catch((error) => {
                    console.error(`Error updating officers: ${error}`);
                });

            getOfficers();

        } catch (error) {
            console.error(error);
        }
    }

    return <>

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nome </th>
                    <th>Equipe</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(data).length > 0 ? (
                    Object.keys(data).map((id) => (
                        <TableContent
                            key={id}
                            id={data[id].id}
                            team_name={data[id].team ? data[id].team.team_name : ''}
                            name={data[id].name}
                            viewOperation={async () => handleViewOperation(data.id)}
                            editOperation={async () => handleEditOperation(data.id)}
                            deleteOperation={async () => handleDeleteTeam(data.id)}
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
    </>
}

function TableContent(props) {
    return <tr key={props.id}>
        <td>{props.id}</td>
        <td>{props.name}</td>
        <td>{props.team_name}</td>
        <td colSpan={1}>
            <div>

                <Button variant="outline-primary" size='sm'
                    onClick={props.editOperation}>
                    <span class="material-symbols-outlined">
                        edit
                    </span>
                </Button>{' '}
                <Button variant="outline-danger" size='sm'
                    onClick={props.deleteOperation}>
                    <span class="material-symbols-outlined">
                        delete
                    </span>
                </Button>{' '}
            </div>
        </td>
    </tr>
}