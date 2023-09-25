import { api } from "./api";

class ResourceOperationService {

    async create(data) {
        const result = await api.post('/resourceoperation', {
            resource_id: data.resource_id,
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

    async update(data) {
        console.log('service update ' + data)
        const oid = data.operation_id;
        const rid = data.resource_id;
        const result = await api.put(`/resource/${rid}/operation/${oid}`, {
            resource_id: data.resource_id,
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

    //routes.get('/resourceoperation/operation/:oid', authMiddleware, resourceOperationController.getAllFromOperation);
    async getAllByOperationId(data) {
        const operation_id = data.operation_id;
        const result = await api.get(`/resourceoperation/operation/${operation_id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    //routes.get('/resourceoperation/resource/:rid', authMiddleware, resourceOperationController.getAllFromResource);
    async getAllByResourceId(data) {
        const resource_id = data.resource_id;
        const result = await api.get(`/resourceoperation/resource/${resource_id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async delete(data) {

        const rid = data.resource_id;
        const oid = data.operation_id;
        const result = await api.delete(`/resource/${rid}/operation/${oid}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async deleteByOperationId(data) {

        const oid = data.operation_id;
        const result = await api.delete(`/resourceoperation/operation/${oid}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }


}

export default ResourceOperationService;
