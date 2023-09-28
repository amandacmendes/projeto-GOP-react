import { useEffect, useState } from "react";
import { Button, Card, Form, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import { useNavigate, useParams } from "react-router-dom";
import ResourceService from "../../services/ResourceService";
import { useForm } from 'react-hook-form';

export function ResourcesNew(props) {

    const navigate = useNavigate();
    let params = useParams();
    let pagetitle = '';
    let isDisabled = false;
    let action = 'new';

    if (props.pagetitle) {
        pagetitle = props.pagetitle;
    }

    if (params.action === 'view') {
        pagetitle = 'Visualizar Recurso'
        isDisabled = true;
        action = params.action;
    } else if (params.action === 'edit') {
        pagetitle = 'Editar Recurso'
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
                    <Content id={params.id} isDisabled={isDisabled} pageAction={action} />
                    <br /><br />
                </Stack>
            </div>
        </>
    );
}

function Content(props) {

    let isDisabled = props.isDisabled;
    const navigate = useNavigate();
    const resourceService = new ResourceService();
    const { handleSubmit, register, formState: { errors } } = useForm();

    const [resourceTypes, setResourceTypes] = useState([]);
    const [resource, setResource] = useState([]);

    async function loadInfo() {

        // for New Resource - load resource types
        await resourceService.getResourceTypes()
            .then((result) => {
                setResourceTypes(result.data)
            })
            .catch((error) => {
                console.log(error)
                navigate('/resources', {
                    state: {
                        alertVariant: 'danger',
                        alertMessage: (error.response.data.error)
                    }
                })
            });

        //for View and Edit - load resource from db
        if (!!props.id) {
            fetchResource(props.id);
        }
    }

    async function fetchResource(id) {
        await resourceService.getResourceById({ id: id })
            .then((result) => {
                if (result.data.status != 'ACTIVE') {
                    isDisabled = true;
                }
                setResource(result.data)
            })
            .catch((error) => {
                console.log(error)
                navigate('/resources', {
                    state: {
                        alertVariant: 'danger',
                        alertMessage: (error.response.data.error)
                    }
                })
            });
    }

    useEffect(() => {
        loadInfo()
    }, []);

    const onSubmit = async (data) => {
        try {

            if (props.pageAction == 'new') {

                //Create 
                await resourceService.createResource({
                    description: data.description,
                    resourcetype_id: data.resourcetype_id
                }).then((result) => {
                    console.log(result)
                }).then((data) => {
                    navigate('/resources', {
                        state: {
                            alertVariant: 'success',
                            alertMessage: 'Recurso criado com sucesso!'
                        }
                    })
                }).catch((error) => {
                    console.log(error)
                    navigate('/resources', {
                        state: {
                            alertVariant: 'danger',
                            alertMessage: (error.response.data.error)
                        }
                    })
                });
            } else if (props.pageAction == 'edit') {
                //Update 
                await resourceService.updateResource({
                    id: props.id,
                    description: resource.description,
                    resourcetype_id: resource.resourcetype_id
                }).then((result) => {
                    console.log(result)
                    navigate('/resources', {
                        state: {
                            alertVariant: 'success',
                            alertMessage: 'Recurso atualizado com sucesso!'
                        }
                    })
                }).catch((error) => {
                    console.log(error);
                    navigate('/resources', {
                        state: {
                            alertVariant: 'danger',
                            alertMessage: (error.response.data.error)
                        }
                    })
                });
            }

        } catch (error) {
            console.log(error)
            navigate('/resources', {
                state: {
                    alertVariant: 'danger',
                    alertMessage: (error.response.data.error)
                }
            })
        }
    }

    return <>
        <Form onSubmit={handleSubmit(onSubmit)}>

            <Card className="mb-3">
                <Card.Body>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-resource-description">Descrição do Recurso</Form.Label>
                        <Form.Control
                            type="text"
                            disabled={isDisabled}
                            value={resource.description}
                            {...register('description')}
                            onChange={(e) => setResource({ ...resource, description: e.target.value })}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-resourcetype-id">Tipo de Recurso</Form.Label>
                        <Form.Select
                            disabled={isDisabled}
                            {...register('resourcetype_id')}
                            onChange={(e) => setResource({ ...resource, resourcetype_id: e.target.value })}
                        >
                            <option>--</option>
                            {resourceTypes.map((type) => (
                                <option
                                    selected={(type.id == resource.resourcetype_id ? true : false)}
                                    key={type.id}
                                    value={type.id}
                                >
                                    {type.description}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                </Card.Body>
            </Card>

            <Button className="my-3" type="submit" hidden={isDisabled}> {props.pageAction == 'new' ? 'Cadastrar' : 'Registrar Edições'} </Button>


        </Form>
    </>

}

