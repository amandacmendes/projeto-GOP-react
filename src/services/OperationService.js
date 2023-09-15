import axios from "axios";

class OperationService {

    async getOperations() {
        const result = await axios.get('http://localhost:8080/operation', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type':'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async update(updatedOperation){
        
    }

}

export default OperationService;