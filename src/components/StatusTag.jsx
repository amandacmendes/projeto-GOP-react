import { useEffect, useState } from 'react';
import { Alert, Button, Form, FormControl, Modal } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { useForm } from 'react-hook-form';
import OperationService from '../services/OperationService';

export function StatusTag(props) {

    var type, text = '';

    const status = props.status;
    const id = props.id;
    const operation_name = props.operation_name;

    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState({ show: false, variant: 'primary', message: 'test' });

    const { handleSubmit, register, formState: { errors } } = useForm();
    const operationService = new OperationService();

    if (status == 'OPENED') {
        type = 'primary'
        text = 'Aberta'
    } else if (status == 'TRIGGERED') {
        type = 'warning'
        text = 'Deflagrada - Preencher Relatório'
    } else if (status == 'FINISHED') {
        type = 'success'
        text = 'Concluida'
    } else if (status == 'CANCELED') {
        type = 'danger'
        text = 'Cancelada'
    }

    function openModal(e) {
        setShowModal(true)
    }

    const onSubmit = (data) => {

        try {
            const operation = {
                id: id,
                status: 'FINISHED',
                operation_results_deaths: data.operation_results_deaths,
                operation_results_arrests: data.operation_results_arrests,
                operation_results_seizures: data.operation_results_seizures,
                operation_results_report: data.operation_results_report
            }

            console.log(operation)

            operationService.update(operation)
                .then((result) => {
                    console.log(result);

                    if (result.status == 200) {
                        var alert = { show: true, variant: 'success', message: result.data.message }
                        setAlert(alert);
                        setShowModal(false);
                    } else {
                        var alert = { show: true, variant: 'danger', message: result.data.message }
                        setAlert(alert);
                        setShowModal(false);
                    }
                });

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {status != 'TRIGGERED'
                ?
                <Badge bg={type}>{text}</Badge>
                : <>
                    <Button
                        style={{ paddingLeft: 0, paddingRight: 0 }}
                        size="sm"
                        variant={type}
                        onClick={(e) => { openModal(e) }}
                    >
                        <b>{text}</b>
                    </Button>
                    <Modal show={showModal} >
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Modal.Header>
                                <Modal.Title>Resultados da Operação - {operation_name}</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>

                                <Form.Group>
                                    <Form.Label>Ocorrencia de Prisões</Form.Label>
                                    <Form.Control
                                        type='number'
                                        className="mb-3"
                                        placeholder='Insira a quantidade de prisões...'
                                        required={true}
                                        {...register('operation_results_arrests')}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Ocorrencia de Apreensões</Form.Label>
                                    <Form.Control
                                        type='number'
                                        className="mb-3"
                                        placeholder='Insira a quantidade de apreensões...'
                                        required={true}
                                        {...register('operation_results_seizures')}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Ocorrencia de Fatalidades</Form.Label>
                                    <Form.Control
                                        type='number'
                                        className="mb-3"
                                        placeholder='Insira a quantidade de fatalidades...'
                                        required={true}
                                        {...register('operation_results_deaths')}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Relatório</Form.Label>
                                    <Form.Control
                                        type='text'
                                        as="textarea"
                                        rows={10}
                                        className="mb-3"
                                        required={true}
                                        {...register('operation_results_report')}
                                    />
                                </Form.Group>

                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="primary" type="submit">
                                    Registrar Relatório
                                </Button>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Fechar
                                </Button>
                            </Modal.Footer>

                        </Form>
                    </Modal>
                </>
            }

            {alert.show &&
                <div style={{ position: "absolute", bottom: 0, right: 0, zIndex: 999 }}>
                    <Alert
                        variant={alert.variant}
                        onClose={() => { var alert = { ...alert, show: false }; setAlert(alert) }}
                        dismissible>
                        <p>
                            {alert.message}
                        </p>
                    </Alert>
                </div>
            }

        </>
    );
}
