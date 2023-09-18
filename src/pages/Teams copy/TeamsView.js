import { Button, Card, Form, ListGroup, Stack } from "react-bootstrap";
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

    const navigate = useNavigate();

    const [teamName, setTeamName] = useState('');
    const [selectedOfficers, setSelectedOfficers] = useState([]);
    const [officers, setOfficers] = useState([])

    const teamService = new TeamsService();
    const officerService = new OfficerService();

    //Fetch all officers
    async function fetchAllOfficers() {

        await officerService.getOfficers()
            .then((result) => {
                setOfficers(result.data)
            })
            .catch((error) => {
                console.log(error)
            })

        if (props.id) {
            await teamService.getTeamsWithOfficers()
                .then((data) => {
                    console.log(props.id)
                    console.log(data.get(1).officers);

                    setSelectedOfficers(data.get(1).officers)


                    //setSelectedOfficers(officers);
                })
        }
    }

    // Handle checkbox changes
    const handleCheckboxChange = (officer) => {

        const updatedOfficers = selectedOfficers.includes(officer)
            ? selectedOfficers.pop(officer)
            : [...selectedOfficers, officer];

        setSelectedOfficers(updatedOfficers);
        console.log(` - handleCheckbox 75 ${selectedOfficers}`)
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Here, you can handle creating the team with the selected officers and teamName
        console.log('Team Name:', teamName);
        console.log('Selected Officers:', selectedOfficers);

        await teamService.create(teamName, selectedOfficers)
            .then((result) => {
                console.log('Team Created! ' + result)
            }).catch((error) => {
                console.log(error)
            });
    };

    useEffect(() => {
        fetchAllOfficers();
        console.log(selectedOfficers);
    }, []);

    return (

        <Form className="w-100" noValidate onSubmit={handleSubmit} >
            <Card className="mb-3">
                <Card.Body>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-team-name">Nome da Equipe</Form.Label>
                        <Form.Control
                            type="text"
                            id="teamName"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            disabled={props.isDisabled}
                            required
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
                                        key={officer.id}
                                        type="checkbox"
                                        value={officer.id}
                                        checked={selectedOfficers.includes(officer)}
                                        onChange={() => handleCheckboxChange(officer)}
                                        disabled={props.isDisabled}
                                        label={officer.name}
                                    />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit">Cadastrar</Button>
                </Card.Body>
            </Card>
        </Form>
    )

}