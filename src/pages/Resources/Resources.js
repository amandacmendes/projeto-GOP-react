import { Button, Form, InputGroup, Stack, Table } from "react-bootstrap";
import { ContentBase } from '../../components/ContentBase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ResourceService from "../../services/ResourceService";

export function Resources() {

    const navigate = useNavigate();

    const [search, setSearch] = useState();

    function handleNewTeamClick() {
        navigate('new');
    }

    function handleSearch(e) {
        setSearch(e);
    }

    return (
        <>
            <ContentBase />
            <div className='container'>
                <Stack gap={5}>
                    <h1>Recursos - Viaturas</h1>
                    <div className='d-flex flex-row w-auto justify-content-between'>
                        <Form className='w-50'>
                            <InputGroup>
                                <Form.Control type='text' placeholder='Digite o nome do recurso...'
                                    onChange={(e) => { handleSearch(e.target.value) }}></Form.Control>
                                <InputGroup.Text id="basic-addon2">
                                    <span class="material-symbols-outlined">
                                        search
                                    </span>
                                </InputGroup.Text>
                            </InputGroup>
                        </Form>
                        <Button onClick={handleNewTeamClick}>Registrar Novo Recurso</Button>
                    </div>
                    <TableResources searchbar="" />
                </Stack>
            </div>
        </>
    );
}
function TableResources(props) {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [resourcetypes, setResourceTypes] = useState([]);

    const resourceService = new ResourceService();

    async function getResources() {
        try {
            const resourceData = await resourceService.getResources();
            setData(resourceData.data)

            const resourceTypeData = await resourceService.getResourceTypes();
            setResourceTypes(resourceTypeData.data)

        } catch (error) {
            console.log(error)
            navigate('/*');
        }
    }

    useEffect(() => {
        getResources();
    }, []);

    async function handleEdit(id) {
        try {
            navigate(`${id}/edit`)
        } catch (error) {
            console.error(error);
        }
    }

    async function handleView(id) {
        try {
            navigate(`${id}/view`)
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(id) {
        try {
            console.log('----' + id)
            await resourceService.deleteResource({ id: id })
                .then((data) => {
                    console.log(data)
                })

        } catch (error) {
            console.error(error);
        }
    }

    return <>

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Descrição Recurso</th>
                    <th>Tipo Recurso</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>

                {data && data.length > 0
                    ? (
                        data.map((dataItem, index) => {
                            const matchingResourceType = resourcetypes.find((type) => type.id == dataItem.resourcetype_id);

                            return (
                                <TableContent
                                    key={index}
                                    id={dataItem.id}
                                    description={dataItem.description}
                                    resourcetype={matchingResourceType ? matchingResourceType.description : dataItem.resourcetype_id}
                                    viewOperation={async () => handleView(dataItem.id)}
                                    editOperation={async () => handleEdit(dataItem.id)}
                                    deleteOperation={async () => handleDelete(dataItem.id)}
                                />
                            );
                        }))
                    : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                Não existe nenhuma equipe cadastrada!
                            </td>
                        </tr>
                    )
                }

            </tbody>
        </Table>
    </>
}


function TableContent(props) {
    return <tr>
        <td>{props.keys}</td>
        <td>{props.description}</td>
        <td>{props.resourcetype}</td>
        <td>
            <div>
                <Button variant="outline-success" size='sm'
                    onClick={props.viewOperation}>
                    <span class="material-symbols-outlined">
                        pageview
                    </span>
                </Button>{' '}
                <Button variant="outline-primary" size='sm'
                    onClick={props.editOperation}>
                    <span class="material-symbols-outlined">
                        edit
                    </span>
                </Button>{' '}
                <Button variant="outline-danger" size='sm'
                    onClick={props.deleteOperation}>
                    <span class="material-symbols-outlined">
                        delete
                    </span>
                </Button>{' '}
            </div>
        </td>
    </tr>
}