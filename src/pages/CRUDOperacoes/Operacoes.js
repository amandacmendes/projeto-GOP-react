import '../../css/style.css';
import { ContentBase } from '../../components/ContentBase';
import { Form, InputGroup, Stack, Table } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import OperationService from '../../services/OperationService';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

export function Operacoes() {
    const navigate = useNavigate();

    function handleNewOpClick() {
        navigate('new');
    }

    return (
        <>
            <ContentBase />
            <div className='container'>
                <Stack gap={5}>
                    <h1>Operações Policiais</h1>
                    <div className='d-flex flex-row w-auto justify-content-between'>
                        <Form className='w-50'>
                            <InputGroup>
                                <Form.Control type='text' placeholder='Pesquisar pelo nome da operação...' ></Form.Control>
                                <InputGroup.Text id="basic-addon2">
                                    <span class="material-symbols-outlined">
                                        search
                                    </span>
                                </InputGroup.Text>
                            </InputGroup>
                        </Form>
                        <Button onClick={handleNewOpClick}>Registrar Nova Operação</Button>
                    </div>
                    <TableOperacoes searchbar="" />
                </Stack>
            </div>
        </>
    );
}

function TableOperacoes(props) {

    const [data, setData] = useState([]);
    const [response, setResponse] = useState('')
    const navigate = useNavigate();


    const operationService = new OperationService();
    const auth = new AuthService();

    async function getOperations() {
        try {
            const result = await operationService.getOperations();
            console.log(result)
            setData(result.data)

        } catch (error) {
            console.error(error);
            navigate('/');
        }
    }

    useEffect(() => {
        getOperations();
    }, []);

    const refreshTable = () => {
        getOperations();
    }

    const handleDelete = (dataId) => {
        console.log("---", dataId)
        axios.delete(`https://64aff008c60b8f941af4e53d.mockapi.io/crud/fakeData/${dataId}`
        ).then(function (response) {
            console.log(response);
            setResponse(response.statusText);
            refreshTable();
        }).catch(function (error) {
            console.log(error);
            setResponse(error.message);
        });
    }

    async function handleEditOperacao(id) {
        try {
            await OperationService.update(id);
            await getOperations();
        } catch (error) {
            console.error(error);
        }
    }

    return <>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nome da Operação</th>
                    <th>Local da Operação</th>
                    <th>Data da Operação</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {data && data.length > 0
                    ? data.map((data, index) => (
                        <TableContent
                            keys={index}
                            operation_name={data.operation_name}
                            operation_place={data.operation_place}
                            operation_date={data.operation_date}
                            status={data.status}
                            id={data.id}
                            editOperacao={async () => handleEditOperacao(data.id)}
                        />
                    ))
                    : <p className="text-center">Não existe nenhuma operação cadastrada!</p>
                }

            </tbody>
        </Table>
    </>
}

function TableContent(props) {
    return <tr>
        <td>{props.keys}</td>
        <td>{props.operation_name}</td>
        <td>{props.operation_place}</td>
        <td>{props.operation_date}</td>
        <td>{props.status}</td>
        <td>
            <div>
                <Button variant="outline-success" size='sm'>
                    <span class="material-symbols-outlined">
                        pageview
                    </span>
                </Button>{' '}
                <Button variant="outline-primary" size='sm' onClick={props.editOperacao}>
                    <span class="material-symbols-outlined">
                        edit
                    </span>
                </Button>{' '}
                <Button variant="outline-danger" size='sm'>
                    <span class="material-symbols-outlined">
                        delete
                    </span>
                </Button>{' '}
            </div>
        </td>
    </tr>
}