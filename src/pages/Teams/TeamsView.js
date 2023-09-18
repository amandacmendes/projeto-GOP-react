import { Card, Form, ListGroup, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TeamsService from "../../services/TeamsService";
import OfficerService from "../../services/OfficerService";

export function TeamsView(props) {

    const navigate = useNavigate();
    let pagetitle = '';
    let isDisabled = false;
    let params = useParams();

    if (props.pagetitle) {
        pagetitle = props.pagetitle;
    }

    if (params.action === 'view') {
        pagetitle = 'Visualizar Equipe'
        isDisabled = true;
    } else if (params.action === 'edit') {
        pagetitle = 'Editar Equipe'
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
                    <div className='d-flex flex-row w-auto justify-content-between'>
                        <Content id={params.id} isDisabled={isDisabled} action={params.action} />
                    </div>
                    <br /><br />
                </Stack>
            </div>
        </>
    );
}

function Content(props) {

    const [team, setTeam] = useState([]);
    const [officers, setOfficers] = useState([]);
    const [teamName, setTeamName] = useState('');


    const teamsService = new TeamsService();
    const officerService = new OfficerService();

    async function fetchTeamOfficers(id) {
        var teams;
        await teamsService.getTeamsWithOfficers()
            .then((result) => {
                teams = result;
            })
            .catch((error) => {
                console.log(error)
            });

        // Mapping by id
        const teamMap = teams.reduce((acc, team) => {
            acc[team.id] = team;
            return acc;
        }, {});

        console.log(teamMap[id]);
        setTeam(teamMap[id]);
        setTeamName(teamMap[id].team_name)
        setOfficers(teamMap[id].officers);
    }

    async function fetchAllOfficers() {
        await officerService.getOfficers()
            .then((result) => {
                setOfficers(result.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    async function loadData() {
        if (props.action === 'view') {
            fetchTeamOfficers(props.id)
        } else {
            fetchAllOfficers();
        }
    }

    function handleCheckboxInitState(officerTeamId) {
        return props.id == officerTeamId ? true : false;
    }

    const handleCheckboxChange = (officerId) => {
        // Find the officer in your data and toggle their checked status
        const updatedOfficers = officers.map((officer) => {
            if (officer.id === officerId) {
                return {
                    ...officer,
                    team_id: officer.team_id === props.id ? null : props.id, // Toggle the team_id
                };
            }
            return officer;
        });

        // Update the officers state with the updated data
        setOfficers(updatedOfficers);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (

        <Form className="w-100">
            <Card className="mb-3">
                <Card.Body>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-team-name">Nome da Equipe</Form.Label>
                        <Form.Control
                            type="text"
                            disabled={props.isDisabled}
                            value={team.team_name}
                            onChange={(e) => setTeamName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-team-officers">Policiais</Form.Label>
                        <ListGroup>
                            {officers.map((officer) => (
                                <ListGroup.Item key={officer.id}>
                                    <Form.Check
                                        disabled={props.isDisabled}
                                        type={"checkbox"}
                                        id={officer.id}
                                        label={officer.name}
                                        checked={handleCheckboxInitState(officer.team_id)}
                                        onChange={() => handleCheckboxChange(officer.id)}
                                    />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Form.Group>
                </Card.Body>
            </Card>
        </Form>
    )

}