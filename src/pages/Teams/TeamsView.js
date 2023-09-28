import { Button, Card, Form, ListGroup, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TeamsService from "../../services/TeamsService";
import OfficerService from "../../services/OfficerService";
import { useForm } from 'react-hook-form';


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
    const { handleSubmit, register, formState: { errors } } = useForm();


    const [teamName, setTeamName] = useState('');
    const [selectedOfficers, setSelectedOfficers] = useState([]);
    const [officers, setOfficers] = useState([])

    const teamService = new TeamsService();
    const officerService = new OfficerService();

    async function fetchAllOfficers() {
        await officerService.getOfficers()
            .then((result) => {
                var data = result.data

                if (props.action == 'edit') {
                    data = result.data.filter(item => item.status !== 'INACTIVE');
                }

                data.sort((a, b) => {
                    const nameA = a.name.toUpperCase(); // Convert to uppercase for case-insensitive sorting
                    const nameB = b.name.toUpperCase();

                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });

                setOfficers(data)
            })
            .catch((error) => {
                console.log(error)
            })

        if (!!props.id) {
            await teamService.getTeamsWithOfficers()
                .then((data) => {
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
    }

    // Handle checkbox changes
    const handleCheckboxChange = (e, officer) => {

        if (!selectedOfficers.hasOwnProperty(e.target.value)) {
            //include officer in selectedOfficers list
            setSelectedOfficers({
                ...selectedOfficers,
                [e.target.value]: officer,
            });

        } else {
            //exclude officer from selectedOfficers list 
            const updatedOfficers = { ...selectedOfficers };
            delete updatedOfficers[e.target.value];
            setSelectedOfficers(updatedOfficers);
        }

    };

    // Handle form submission
    const onSubmit = async (e) => {
        //e.preventDefault();

        // Update team
        await teamService.update({ id: props.id, team_name: teamName })
            .then((result) => {
                console.log("Team updated")
            }).catch((error) => {
                console.log(error)
            });

        // Bulk Update Officers List
        // NEEDS_ALERT : Isto irá retirar policiais de outro time. Deseja continuar? 
        const selectedOfficersNewTeamId = { ...selectedOfficers };

        //origOfficers = officers.reduce    - const origOfficers = { ...officers };
        const origOfficers = officers.reduce((acc, officer) => {
            acc[officer.id] = officer;
            return acc;
        }, {})

        var allOfficersUpdateObj = { ...selectedOfficersNewTeamId };

        // Sets this team_id in all selected officers 
        Object.keys(selectedOfficersNewTeamId).forEach((officerId) => {
            selectedOfficersNewTeamId[officerId].team_id = props.id;
        });

        //If any originalOfficer is not in selected officers BUT origOfficer.team_id == props.id, update with ''
        Object.keys(origOfficers).forEach((officerId) => {

            if (!selectedOfficersNewTeamId[officerId]) {

                if (origOfficers[officerId].team_id == props.id) {
                    origOfficers[officerId].team_id = null;
                    allOfficersUpdateObj[officerId] = origOfficers[officerId]; // Add the officer to allOfficersUpdateObj
                }
            }
        });

        await officerService.bulkUpdateOfficer(Object.values(allOfficersUpdateObj))
            .then((result) => {
                console.log('All officers Updated! ')
                navigate('/team');
            }).catch((error) => {
                console.log(error)
            });
    };

    useEffect(() => {
        fetchAllOfficers();
    }, []);

    return (

        <Form className="w-100" noValidate onSubmit={handleSubmit(onSubmit)} >
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
                                        id={officer.id}
                                        key={officer.id}
                                        type={"checkbox"}
                                        value={officer.id}
                                        checked={selectedOfficers.hasOwnProperty(officer.id)}
                                        onChange={(e) => handleCheckboxChange(e, officer)}
                                        disabled={props.isDisabled}
                                        label={officer.status != 'INACTIVE' ? officer.name : `${officer.name} - INATIVO`}
                                    />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit" hidden={props.isDisabled}>
                        {props.action == 'edit' ? 'Registrar Edições' : 'Cadastrar'}
                    </Button>
                </Card.Body>
            </Card>
        </Form>
    )

}