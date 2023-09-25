import '../../css/style.css';
import { ContentBase } from '../../components/ContentBase';
import { Button, Card, Form, Stack } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import OfficerService from '../../services/OfficerService';
import UserService from '../../services/UserService';

export function Profile() {
    const { handleSubmit, register, formState: { errors } } = useForm();

    const [user, setUser] = useState([]);
    const [officer, setOfficer] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const officerService = new OfficerService();
    const userService = new UserService();

    async function loadData() {

        const user_id = sessionStorage.getItem('id');

        await userService.getUser({ id: user_id })
            .then(async (result) => {

                setUser(result.data)

                if (result.data.officer_id > 0) {
                    const officer = await officerService.getById({ id: result.data.officer_id });
                    setOfficer(officer);
                }
            });
    }

    const onSubmit = async (data) => {
        console.log(data)
    }
    return (
        <>
            <ContentBase />
            <div className='container'>
                <Stack gap={5}>
                    <h1>Perfil</h1>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group>
                                    <Form.Label>Nome do Policial</Form.Label>
                                    <Form.Control
                                        type='text'
                                        className="mb-3"
                                        required={true}
                                        {...register('name')}
                                        value={user.name}
                                        onChange={(e) => { setUser({ ...user, name: e.target.value }) }}
                                    />
                                </Form.Group>


                                <div className='d-flex flex-column'>

                                    <Button variant="primary">
                                        Editar informações
                                    </Button>
                                    <Button variant="danger" >
                                        Excluir conta
                                    </Button>
                                </div>

                            </Form>

                        </Card.Body>
                    </Card>
                </Stack>
            </div>
        </>
    );
}

