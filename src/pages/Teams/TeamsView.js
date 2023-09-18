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

    const teamsService = new TeamsService();
    const officerService = new OfficerService();

    async function fetchTeam(id) {
        var teams;
        await teamsService.getTeamsWithOfficers()
            .then((result) => {
                teams = result
            })
            .catch((error) => {
                console.log(error)
            });

        console.log(teams);
    }

    async function fetchOfficers() {
        await officerService.getOfficers()
            .then((result) => {
                setOfficers(result.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        fetchOfficers();
    }, []);

    return (

        <Form className="w-100">

            <Card className="mb-3">
                <Card.Body>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-team-name">Nome da Equipe</Form.Label>
                        <Form.Control type="text" disabled={props.isDisabled} value={team.team_name}></Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-team-officers">Policiais</Form.Label>
                        <ListGroup>
                            {officers.map((officer) => (
                                <ListGroup.Item>
                                    <Form.Check
                                        disabled={props.isDisabled}
                                        type={"checkbox"}
                                        id={officer.id}
                                        label={officer.name}
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