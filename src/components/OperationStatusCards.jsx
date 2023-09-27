import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

function OperationStatusCards({ operations }) {
    // Calculate the number of operations in each status
    const statusCounts = {
        OPENED: 0,
        TRIGGERED: 0,
        FINISHED: 0,
        CANCELED: 0
        // Add more status counts as needed
    };

    operations.forEach(operation => {
        const status = operation.status;
        if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
        }
    });

    return (
        <div className="operation-status-cards d-flex flex-row justify-content-between">
            <Row>
                <Col className='col-sm-12 col-xs-12 col-md-3'>
                    <Card>
                        <Card.Body>
                            <h4 className='text-primary' >Operações Abertas</h4>
                            <h4 style={{ fontWeight: 'normal' }}>{statusCounts.OPENED}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='col-sm-12 col-xs-12 col-md-3'>
                    <Card>
                        <Card.Body>
                            <h4 style={{ color: 'orange' }} >Operações Deflagradas</h4>
                            <h4 style={{ fontWeight: 'normal' }}>{statusCounts.TRIGGERED}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='col-sm-12 col-xs-12 col-md-3'>
                    <Card>
                        <Card.Body>
                            <h4 className='text-success' >Operações Finalizadas</h4>
                            <h4 style={{ fontWeight: 'normal' }}>{statusCounts.FINISHED}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='col-sm-12 col-xs-12 col-md-3'>
                    <Card>
                        <Card.Body>
                            <h4 className='text-danger' >Operações Canceladas</h4>
                            <h4 style={{ fontWeight: 'normal' }}>{statusCounts.CANCELED}</h4>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default OperationStatusCards;
