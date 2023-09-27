import { Button, Card, Form, ListGroup, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TeamsService from "../../services/TeamsService";
import OfficerService from "../../services/OfficerService";
import { useForm } from 'react-hook-form';

export function TeamsNew(props) {

    const navigate = useNavigate();
    let pagetitle = '';
    let isDisabled = false;
    let params = useParams();
    let action = 'new';

    if (props.pagetitle) {
        pagetitle = props.pagetitle;
    }
    if (params.action === 'view') {
        pagetitle = 'Visualizar Equipe'
        action = params.action;
        isDisabled = true;
    } else if (params.action === 'edit') {
        pagetitle = 'Editar Equipe'
        action = params.action;
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
                        <Content id={params.id} isDisabled={isDisabled} pageAction={action} />
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
    var [selectedOfficers, setSelectedOfficers] = useState([]);
    const [officers, setOfficers] = useState([])

    const teamService = new TeamsService();
    const officerService = new OfficerService();

    //Fetch all officers
    async function fetchAllOfficers() {
        await officerService.getOfficers()
            .then((result) => {
                console.log(result.data)
                const filteredData = result.data.filter(item => item.status !== 'INACTIVE');
                setOfficers(filteredData)
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

        console.log('Fetched: ' + props.id + selectedOfficers)
    }

    // Handle form submission
    const onSubmit = async (data) => {

        // Create team
        await teamService.create({ team_name: data.team_name })
            .then((result) => {

                console.log(result)

                // Update officers
                var arrOfficer = [];

                data.team_officers.forEach(officer_id => {
                    console.log(officer_id)
                    arrOfficer = [...arrOfficer, { id: officer_id, team_id: result.data.id }]
                });

                officerService.bulkUpdateOfficer(arrOfficer)
                    .then((result) => {
                        console.log(result)
                        navigate('/team')
                    }).catch((error) => {
                        console.log(error)
                    });
            }).catch((error) => {
                console.log(error)
            })

    };

    useEffect(() => {
        fetchAllOfficers();
        //handleChecked();
    }, []);

    return (

        <Form className="w-100" noValidate onSubmit={handleSubmit(onSubmit)} >
            <Card className="mb-3">
                <Card.Body>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" >Nome da Equipe</Form.Label>
                        <Form.Control
                            type="text"
                            id="teamName"
                            value={teamName}
                            {...register('team_name')}
                            onChange={(e) => setTeamName(e.target.value)}
                            disabled={props.isDisabled}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" >Policiais</Form.Label>
                        <ListGroup>
                            {officers.map((officer) => (
                                <ListGroup.Item key={officer.id}>
                                    <Form.Check
                                        disabled={props.isDisabled}
                                        type="checkbox"
                                        id={officer.id}
                                        key={officer.id}
                                        label={officer.name}
                                        value={officer.id}
                                        //checked={selectedOfficers.forEach((e) => { return e.id == officer.id ? true : false })}
                                        //onChange={(e) => handleCheckboxChange(e, officer)}
                                        {...register('team_officers')}
                                    />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit">{(props.pageAction == 'new') ? 'Cadastrar' : 'Editar'}</Button>
                </Card.Body>
            </Card>
        </Form>
    )

}