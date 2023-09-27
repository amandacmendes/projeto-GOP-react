import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";


export function StatusTagOfficer(props) {

    var type, text = '';

    const status = props.status;

    if (status == 'ACTIVE') {
        type = 'success'
        text = 'Ativo'
    } else if (status == 'INACTIVE') {
        type = 'secondary'
        text = 'Inativo'
    } else {
        type = 'secondary'
        text = 'Status não definido'
    }

    return (

        <OverlayTrigger
            placement="top"
            delay={{ show: 200, hide: 200 }}
            overlay={
                (status === 'INACTIVE') ? (
                    <Tooltip>
                        Policial não pode ser excluído do sistema pois já está vinculado com operações.
                    </Tooltip>
                ) : <></>
            }
        >
            <Badge bg={type}>
                {text}
            </Badge>
        </OverlayTrigger>
    );

}
