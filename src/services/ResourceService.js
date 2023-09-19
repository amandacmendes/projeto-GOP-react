import { api } from "./api";

class ResourceService {

    async getResources() {
        const result = await api.get('/resource', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async getResourceTypes() {
        const result = await api.get('/resourcetype', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async getAllResourcesFromOperation(data) {
        const operation_id = data.id;
        const result = await api.get(`/resourceoperation/operation/${operation_id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    
    async getResourceById(data) {
        const id = data.id;
        const result = await api.get(`/resource/${id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async createResource(data) {
        const result = await api.post('/resource', {
            description: data.description,
            resourcetype_id: data.resourcetype_id
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async createResourceOperation(data) {
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

    async updateResource(data) {
        console.log('service update '+data)
        const id = data.id;
        const result = await api.put(`/resource/${id}`, {
            description: data.description,
            reasontype_id: data.reasontype_id
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }


    async deleteResource(data) {
        const result = await api.delete(`/resource/${data.id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

}

export default ResourceService;
