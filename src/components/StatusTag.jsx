import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';

export function StatusTag(props) {

    const status = props.status;
    var type, text = '';
    const id = props.id;

    const [showModal, setShowModal] = useState(false);

    if (status == 'OPENED') {
        type = 'secondary'
        text = 'Aberta'
    } else if (status == 'TRIGGERED') {
        type = 'primary'
        text = 'Deflagrada - Preencher Relatório'
    } else if (status == 'FINISHED') {
        type = 'success'
        text = 'Concluida'
    } else if (status == 'CANCELED') {
        type = 'danger'
        text = 'Cancelada'
    }

    function openModal(e) {
        console.log(id)
    }

    return (
        <>
            {status != 'TRIGGERED' 
                ?
                <Badge bg={type} onClick={(e) => { openModal(e) }}>{text}</Badge>
                :
                <Button
                    size="sm"
                    variant={type}
                    onClick={(e) => { openModal(e) }}
                >
                    {text}
                </Button>
            }
        </>
    );
}
