import { Modal as ModalComponent, Button } from 'react-bootstrap';

export function Modal(props) {
    return (
        <ModalComponent show={props.show} onHide={props.handleClose}>
            <ModalComponent.Header closeButton>
                <ModalComponent.Title>
                    {props.title}
                </ModalComponent.Title>
            </ModalComponent.Header>
            <ModalComponent.Body>
                {props.message}
            </ModalComponent.Body>
            <ModalComponent.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Fechar
                </Button>
            </ModalComponent.Footer>
        </ModalComponent>
    );
}
