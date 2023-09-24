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
            operation_planned_date: new Date(data.operation_planned_date),
            operation_date: data.operation_date,
            lead_officer_id: data.lead_officer_id,
            status: "OPENED",
            operation_results_deaths: data.operation_results_deaths,
            operation_results_arrests: data.operation_results_arrests,
            operation_results_report: data.operation_results_report,
            operation_results_seizures: data.operation_results_seizures
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
        const result = await api.put(`/operation/${data.id}`, {
            operation_name: data.operation_name,
            operation_place: data.operation_place,
            operation_planned_date: data.operation_planned_date,
            operation_date: data.operation_date,
            lead_officer_id: data.lead_officer_id,
            status: data.status,
            operation_results_deaths: data.operation_results_deaths,
            operation_results_arrests: data.operation_results_arrests,
            operation_results_report: data.operation_results_report,
            operation_results_seizures: data.operation_results_seizures
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
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
        const id = data.id

        //officeroperation
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

                //reason
                await api.delete(`/reason/operation/${id}`, {
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
        })
    }

}

export default OperationService;