import { Button, Card, Form, ListGroup, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TeamsService from "../../services/TeamsService";
import OfficerService from "../../services/OfficerService";

export function TeamsNew(props) {

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
    var [selectedOfficers, setSelectedOfficers] = useState([]);
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

        if (!!props.id) {
            console.log(props.id)
            await teamService.getTeamsWithOfficers()
                .then((data) => {
                    console.log(data)
                    var thisTeam = data.get(parseInt(props.id));

                    setTeamName(data.get(parseInt(props.id)).team_name)
                    setSelectedOfficers(Array.from(data.get(parseInt(props.id)).officers))
                })
                .catch((error) => {
                    console.log(error)
                })
        }

        console.log('Fetched: '+props.id+selectedOfficers)
    }

    function handleChecked(officer_id) {

        selectedOfficers.forEach(of => {
            console.log(of.id == officer_id)
            return !!!of.id == officer_id;
            
        });
        return false
    }

    // Handle checkbox changes
    const handleCheckboxChange = (e, officer) => {

        const updatedOfficers = selectedOfficers.includes(officer)
            ? selectedOfficers.pop(officer)
            : [...selectedOfficers, officer];

        setSelectedOfficers(updatedOfficers);
        console.log(` - selected officers: ${selectedOfficers}`)
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
        handleChecked();
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
                                        checked={selectedOfficers.forEach((e) => { return e.id == officer.id ? true : false})}
                                        onChange={(e) => handleCheckboxChange(e, officer)}
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