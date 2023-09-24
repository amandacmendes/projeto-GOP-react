import { api } from "./api";

class ReasonService {

    async getReasonTypes() {
        const result = await api.get('/reasontype', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async getReasonfromOperation(id) {

        const reasons = await api.get(`/reason/operation/${id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });

        return reasons;
    }

    async createReason(data) {
        const result = await api.post('/reason', {
            description: data.description,
            reasontype_id: data.reasontype_id,
            operation_id: data.operation_id
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async updateReason(data) {
        const id = data.id;
        const result = await api.put(`/reason/${id}`, {
            description: data.description,
            reasontype_id: data.reasontype_id,
            operation_id: data.operation_id
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async deleteReason(data) {
        const id = data.id;
        const result = await api.delete(`/reason/${id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    

}

export default ReasonService;