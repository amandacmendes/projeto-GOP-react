import React from 'react';
import { Card } from 'react-bootstrap';

function OperationStatusCards({ operations }) {
    // Calculate the number of operations in each status
    const statusCounts = {
        OPENED: 0,
        TRIGGERED: 0,
        FINISHED: 0,
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
            <Card>
                <Card.Body>
                    <h4 className='text-primary' >Operações Abertas</h4>
                    <h4 style={{ fontWeight: 'normal' }}>{statusCounts.OPENED}</h4>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <h4 style={{ color: 'orange' }} >Operações Deflagradas</h4>
                    <h4 style={{ fontWeight: 'normal' }}>{statusCounts.TRIGGERED}</h4>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <h4 className='text-danger' >Operações Finalizadas</h4>
                    <h4 style={{ fontWeight: 'normal' }}>{statusCounts.FINISHED}</h4>
                </Card.Body>
            </Card>
            {/* 
            <div className="status-card">
            </div>
            <div className="status-card">
                <h3>Triggered Operations</h3>
                <p>{statusCounts.TRIGGERED}</p>
            </div>
            <div className="status-card">
                <h3>Finished Operations</h3>
                <p>{statusCounts.FINISHED}</p>
            </div>
            Add more status cards as needed */}
        </div>
    );
}

export default OperationStatusCards;
