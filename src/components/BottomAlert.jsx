import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

const BottomAlert = ({ show, variant, message, onClose }) => {
    return (
        <div style={{ position: "absolute", bottom: 0, right: 0, zIndex: 999 }}>
            <Alert
                variant={variant}
                onClose={onClose}
                dismissible
            >
                <p>{message}</p>
            </Alert>
        </div>
    );
};

export default BottomAlert;

/*
How to use:

1 - Declare it like so:

const [alert, setAlert] = useState({ show: false, variant: 'primary', message: 'test' });

const handleAlertClose = () => {
    const updatedAlert = { ...alert, show: false };
    setAlert(updatedAlert);
};

2 - Wherever you want to use it, do it like this:

setAlert({ show: true, variant: 'success', message: result.data.message });

3 - Then render it 

<BottomAlert
show={alert.show}
variant={alert.variant}
message={alert.message}
onClose={handleAlertClose}
/>

*/