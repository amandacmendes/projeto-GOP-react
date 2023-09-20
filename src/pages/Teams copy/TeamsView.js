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

        if (!!props.id) {
            await teamService.getTeamsWithOfficers()
                .then((data) => {
                    //setTeamName(data.get(parseInt(props.id)).team_name)
                    console.log("FETCH ")
                    console.log(data)
                    console.log(props.id)

                    data.forEach((d) => {
                        if (d.id == props.id) {
                            setTeamName(d.team_name)

                            var selOfficers = d.officers.reduce((acc, officer) => {
                                acc[officer.id] = officer;
                                return acc;
                            }, {})

                            setSelectedOfficers(selOfficers)
                        }
                    })

                })
                .catch((error) => {
                    console.log(error)
                })
        }

        console.log('Fetched: ' + selectedOfficers)
    }

    function handleChecked(officer_id) {

        /*
        selectedOfficers.forEach(of => {
            console.log(of.id == officer_id)
            return !!!of.id == officer_id;

        });
        */
        return false
    }

    // Handle checkbox changes
    const handleCheckboxChange = (e, officer) => {

        if (!selectedOfficers.hasOwnProperty(e.target.value)) {
            //include officer in selectedOfficers list
            setSelectedOfficers({
                ...selectedOfficers,
                [e.target.value]: officer,
            });
            console.log(selectedOfficers)

        } else {
            //exclude officer from selectedOfficers list 
            const updatedOfficers = { ...selectedOfficers };
            delete updatedOfficers[e.target.value];
            setSelectedOfficers(updatedOfficers);
            console.log(selectedOfficers)
        }

    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Update team
        await teamService.update({ id: props.id, team_name: teamName })
            .then((result) => {
                console.log('Team Updated! ')
            }).catch((error) => {
                console.log(error)
            });

        // Bulk Update Officers List
        // NEEDS_ALERT : Isto irá retirar policiais de outro time. Deseja continuar? 

        const selectedOfficersNewTeamId = { ...selectedOfficers };

        Object.keys(selectedOfficersNewTeamId).forEach((officerId) => {
            selectedOfficersNewTeamId[officerId].team_id = props.id;
        });

        await officerService.bulkUpdateOfficer(Object.values(selectedOfficersNewTeamId))
            .then((result) => {
                console.log('All officers Updated! ')
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
                                        checked={selectedOfficers.hasOwnProperty(officer.id)}
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