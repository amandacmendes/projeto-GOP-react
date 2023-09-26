import { Button, Form, InputGroup, Popover, Stack, Table } from "react-bootstrap";
import { ContentBase } from '../../components/ContentBase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ResourceService from "../../services/ResourceService";

export function Resources() {

    const navigate = useNavigate();

    function handleNewTeamClick() {
        navigate('new');
    }

    return (
        <>
            <ContentBase />
            <div className='container'>
                <Stack gap={5}>
                    <h1>Recursos - Viaturas</h1>
                    <div className='d-flex flex-row w-auto justify-content-between'>
                        <span></span>
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

            await resourceService.getResources()
                .then((result) => {
                    const rawData = result.data
                    const mappedResult = {};
                    rawData.forEach((item) => {
                        mappedResult[item.id] = item;
                    });

                    setData(mappedResult)
                    console.log(mappedResult)
                });

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

    const [search, setSearch] = useState('')

    const handleSearch = () => {
        console.log(search)
        console.log(data)

        const filteredData = Object.keys(data).filter(key =>
            data[key].name.toLowerCase().includes(search.toLowerCase())
        );

        console.log(filteredData.map(key => data[key]));
        setData(filteredData.map(key => data[key]))

    }

    const clearFilter = () => {
        setSearch('')
        getResources()
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Pesquisar Recurso</Popover.Header>
            <Popover.Body>
                <InputGroup>
                    <Form.Control
                        type="text"
                        size='sm'
                        placeholder="Descrição do recurso"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value) }}
                    />
                    <Button
                        type='submit'
                        variant='dark'
                        onClick={handleSearch}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '16px' }}
                        > search
                        </span>
                    </Button>
                </InputGroup>
                <div className='mt-2'>
                    <a href="#" className="text-primary" onClick={clearFilter}>Limpar filtro</a>
                </div >
            </Popover.Body>
        </Popover>
    );

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
                {Object.keys(data).length > 0 ? (
                    Object.keys(data).map((id, index) => {
                        const matchingResourceType = resourcetypes.find((type) => type.id == data[id].resourcetype_id);
                        return (
                            <TableContent
                                key={id}
                                id={id}
                                index={index+1}
                                description={data[id].description}
                                resourcetype={matchingResourceType ? matchingResourceType.description : data[id].resourcetype_id}
                                viewOperation={async () => handleView(data[id].id)}
                                editOperation={async () => handleEdit(data[id].id)}
                                deleteOperation={async () => handleDelete(data[id].id)}
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
        <td>{props.index}</td>
        <td>{props.description}</td>
        <td>{props.resourcetype}</td>
        <td>
            <div>
                <Button variant="outline-success" size='sm'
                    onClick={props.viewOperation}>
                    <span className="material-symbols-outlined">
                        pageview
                    </span>
                </Button>{' '}
                <Button variant="outline-primary" size='sm'
                    onClick={props.editOperation}>
                    <span className="material-symbols-outlined">
                        edit
                    </span>
                </Button>{' '}
                <Button variant="outline-danger" size='sm'
                    onClick={props.deleteOperation}>
                    <span className="material-symbols-outlined">
                        delete
                    </span>
                </Button>{' '}
            </div>
        </td>
    </tr>
}