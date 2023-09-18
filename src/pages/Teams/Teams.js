import '../../css/style.css';
import { Button, Form, InputGroup, Modal, Stack, Table } from "react-bootstrap";
import { ContentBase } from '../../components/ContentBase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TeamsService from '../../services/TeamsService';

export function Teams() {

    const navigate = useNavigate();

    const [search, setSearch] = useState();

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
                        <Form className='w-50'>
                            <InputGroup>
                                <Form.Control type='text' placeholder='Digite o nome da equipe...'
                                    onChange={(e) => { handleSearch(e.target.value) }}></Form.Control>
                                <InputGroup.Text id="basic-addon2">
                                    <span class="material-symbols-outlined">
                                        search
                                    </span>
                                </InputGroup.Text>
                            </InputGroup>
                        </Form>
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

    async function getTeams() {
        try {
            const result = await teamsService.getTeamsWithOfficers();
            setData(result)
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

    async function handleDeleteOperation(id) {
        try {

            <Modal>
                aa
            </Modal>

        } catch (error) {
            console.error(error);
        }
    }

    return <>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nome da Equipe</th>
                    <th>Quantidade Efetivos</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>

                {data && data.length > 0
                    ? data.map((data, index) => (
                        <TableContent
                            keys={index}
                            team_name={data.team_name}
                            team_size={data.officers.length}
                            viewOperation={async () =>
                                handleViewOperation(data.id)}
                            editOperation={async () => handleEditOperation(data.id)}
                            deleteOperation={async () => handleDeleteOperation(data.id)}
                        />
                    ))
                    : <p className="text-center">Não existe nenhuma equipe cadastrada!</p>
                }

            </tbody>
        </Table>
    </>
}

function TableContent(props) {
    return <tr>
        <td>{props.keys}</td>
        <td>{props.team_name}</td>
        <td>{props.team_size}</td>
        <td>
            <div>
                <Button variant="outline-success" size='sm'
                    onClick={props.viewOperation}>
                    <span class="material-symbols-outlined">
                        pageview
                    </span>
                </Button>{' '}
                <Button variant="outline-primary" size='sm' onClick={props.editOperation}>
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