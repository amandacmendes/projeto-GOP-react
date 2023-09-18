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

    async getAllResourcesFromOperation(operation_id) {
        const result = await api.get(`/resourceoperation/operation/${operation_id}`, {
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
            resourcetype_id: data.reasontype_id
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
        const result = await api.put('/resource', {
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
