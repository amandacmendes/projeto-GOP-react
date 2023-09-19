import { useEffect, useState } from "react";
import {  Card, Form, Stack } from "react-bootstrap";
import { ContentBase } from "../../components/ContentBase";
import { useNavigate, useParams } from "react-router-dom";
import ResourceService from "../../services/ResourceService";
import { useForm } from 'react-hook-form';

export function ResourcesNew(props) {

    const navigate = useNavigate();
    let params = useParams();
    let pagetitle = '';
    let isDisabled = false;

    if (props.pagetitle) {
        pagetitle = props.pagetitle;
    }

    if (params.action === 'view') {
        pagetitle = 'Visualizar Recurso'
        isDisabled = true;
    } else if (params.action === 'edit') {
        pagetitle = 'Editar Recurso'
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
                    <Content id={params.id} isDisabled={isDisabled} />
                    <br /><br />
                </Stack>
            </div>
        </>
    );
}

function Content(props) {

    const navigate = useNavigate();
    const resourceService = new ResourceService();
    const { handleSubmit, register, formState: { errors } } = useForm();

    const [resourceTypes, setResourceTypes] = useState([]);
    const [resource, setResource] = useState([]);

    async function loadInfo() {

        // for New Resource - load resource types
        await resourceService.getResourceTypes()
            .then((result) => {
                console.log(result.data)
                setResourceTypes(result.data)
            })
            .catch((error) => {
                console.log(error)
            });

        //for View and Edit - load resource from db
        if (!!props.id) {
            fetchResource(props.id);
        }
    }

    async function fetchResource(id) {
        await resourceService.getResourceById({ id: id })
            .then((result) => {
                console.log('re ' + result.data)
                setResource(result.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        loadInfo()
    }, []);

    const onSubmit = async (data) => {
        try {
            console.log(' submit --- - -' + data)

            //CreateOperation
            await resourceService.createResource({
                description: data.description,
                resourcetype_id: data.resourcetype_id
            }).then((result) => {
                console.log(result)
            }).catch((e) => {
                console.log(e)
            });

        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <Form onSubmit={handleSubmit(onSubmit)}>

            <Card className="mb-3">
                <Card.Body>
                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" >Descrição do Recurso</Form.Label>
                        <Form.Control
                            type="text"
                            disabled={props.isDisabled}
                            value={resource.description}
                            {...register('description')}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className="pb-2">
                        <Form.Label className="mb-2" controlId="form-input-operation-leader">Tipo de Recurso</Form.Label>
                        <Form.Select
                            disabled={props.isDisabled}
                            {...register('resourcetype_id')}
                        >
                            {resourceTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.description}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                </Card.Body>
            </Card>



        </Form>
    </>

}

