import axios from "axios";
import { api } from "./api";

class OperationService {

    async getOperations() {
        const result = await axios.get('http://localhost:8080/operation', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }


    async getOperationById(id) {
        const result = await axios.get(`http://localhost:8080/operation/${id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }


    async createOperation(data) {
        const result = await api.post('/operation', {
            operation_name: data.operation_name,
            operation_place: data.operation_place,
            operation_planned_date: new Date(data.operation_planned_date) ,
            operation_date: data.operation_date,
            status: "OPENED"
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

    }

    async deleteOperation(data) {
        const id = data.id;
        const result = await api.delete(`/operation/${id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async deleteCascade(data) {
        //officeroperation
        const id = data.id
        await api.delete(`/officeroperation/operation/${id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        }).then(async () => {

            //resourceoperation
            await api.delete(`/resourceoperation/operation/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    Accept: "*/*"
                }
            }).then(async () => {

                //operation
                this.deleteOperation({ id: id })
            })

        })




    }
}

export default OperationService;