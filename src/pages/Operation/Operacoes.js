import '../../css/style.css';
import { ContentBase } from '../../components/ContentBase';
import { Form, InputGroup, Modal, OverlayTrigger, Stack, Table, Tooltip } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import OperationService from '../../services/OperationService';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { StatusTag } from '../../components/StatusTag';

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

    async function handleEditOperation(id) {
        try {
            navigate(`${id}/edit`)
        } catch (error) {
            console.error(error);
        }
    }

    async function handleViewOperation(id) {
        try {
            navigate(`${id}/view`)
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteOperation(id) {
        try {

            operationService.deleteCascade({ id: id })
                .then(() => {
                    getOperations();
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
                    <th>Nome da Operação</th>
                    <th>Local da Operação</th>
                    <th>Data Prevista da Operação</th>
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
                            operation_date={data.operation_date ? data.operation_date : data.operation_planned_date}
                            status={data.status}
                            id={data.id}
                            viewOperation={async () =>
                                handleViewOperation(data.id)}
                            editOperation={async () => handleEditOperation(data.id)}
                            deleteOperation={async () => handleDeleteOperation(data.id)}
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
        <td>{new Date(Date.parse(props.operation_date)).toLocaleDateString('pt-BR')}</td>
        <td colSpan={1} className='text-center'>
            <StatusTag id={props.id} operation_name={props.operation_name} status={props.status} ></StatusTag>
        </td>
        <td colSpan={1} className='text-center'>
            <div>

                <OverlayTrigger
                    placement="top"
                    delay={{ show: 200, hide: 200 }}
                    overlay={
                        <Tooltip>
                            Visualizar operação
                        </Tooltip>
                    }
                >
                    <Button variant="outline-success" size='sm'
                        onClick={props.viewOperation}>
                        <span class="material-symbols-outlined">
                            visibility
                        </span>
                    </Button>
                </OverlayTrigger>
                {' '}

                <OverlayTrigger
                    placement="top"
                    delay={{ show: 200, hide: 200 }}
                    overlay={
                        <Tooltip>
                            {(props.status == 'OPENED') ? 'Editar operação' : 'Não é possivel editar operações já deflagradas.'}
                        </Tooltip>
                    }
                >
                    <span className="d-inline-block">
                        <Button
                            variant={(props.status == 'OPENED') ? 'outline-primary' : 'outline-secondary'}
                            size='sm'
                            onClick={props.editOperation}
                            disabled={(props.status == 'OPENED') ? false : true}
                        >
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </Button>
                    </span>
                </OverlayTrigger>
                {' '}

                <OverlayTrigger
                    placement="top"
                    delay={{ show: 200, hide: 200 }}
                    overlay={
                        <Tooltip>
                            {(props.status == 'FINISHED') ? 'Não é possivel excluir operações já concluidas.' : 'Excluir operação'}
                        </Tooltip>
                    }
                >
                    <span className="d-inline-block">
                        <Button
                            variant={(props.status == 'FINISHED') ? 'outline-secondary' : 'outline-danger'}
                            size='sm'
                            onClick={props.deleteOperation}
                            disabled={(props.status == 'FINISHED') ? true : false}
                        >
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </Button>
                    </span>
                </OverlayTrigger>
                {' '}

            </div>
        </td>
    </tr >
}