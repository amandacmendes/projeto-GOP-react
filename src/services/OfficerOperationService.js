import { api } from "./api";

class OfficerOperationService {

    //routes.post('/officeroperation', authMiddleware, officerOperationController.create);
    async create(data) {
        const result = await api.post('/officeroperation', {
            officer_id: data.officer_id,
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

    //routes.get('/officeroperation', authMiddleware, officerOperationController.getAll);
    async getAll() {
        const result = await api.get('/officeroperation', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    //routes.get('/officeroperation/officer/:ofid', authMiddleware, officerOperationController.getAllFromOfficer);
    async getByOfficerId(data) {

        const ofid = data.officer_id;

        const result = await api.get(`/officeroperation/officer/${ofid}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    //routes.get('/officeroperation/operation/:oid', authMiddleware, officerOperationController.getAllFromOperation);
    async getByOperationId(data) {

        const oid = data.operation_id;

        const result = await api.get(`/officeroperation/operation/${oid}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    //routes.put('/officer/:ofid/operation/:oid', authMiddleware, officerOperationController.update);
    async updateOfficerOperation(data) {
        const result = await api.put(`/officer/${data.oid}/operation/${data.oid}`, {
            officer_id: data.officer_id,
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

    //routes.delete('/officer/:ofid/operation/:oid', authMiddleware, officerOperationController.delete);
    async delete(data) {

        const ofid = data.officer_id;
        const oid = data.operation_id;

        const result = await api.delete(`/officer/${ofid}/operation/${oid}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    //routes.delete('/officeroperation/operation/:oid', authMiddleware, officerOperationController.deleteAllWithOperationId);
    async deleteByOperationId(data) {

        const oid = data.operation_id;

        const result = await api.delete(`/officeroperation/operation/${oid}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    //routes.delete('/officeroperation/officer/:ofid', authMiddleware, officerOperationController.deleteAllWithOfficerId);
    async deleteByOfficerId(data) {

        const ofid = data.officer_id;

        const result = await api.delete(`/officeroperation/officer/${ofid}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

}

export default OfficerOperationService;