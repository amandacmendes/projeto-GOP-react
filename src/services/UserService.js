import { api } from "./api";
import axios from "axios";

class UserService {

    static create(email, password, name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                axios.post('http://localhost:8080/signup', {
                    email,
                    password,
                    name
                }).then((response) => {
                    var data = response.data;
                    resolve();
                }).catch((error) => {
                    reject(new Error(' Erro: ' + error.response.data.error));
                })
            }, 1000);
        });
    }

    async update(user) {

        const result = await api.put(`/user/${user.id}`, {
            email: user.email,
            password: user.password,
            status: user.status,
            officer_id: user.officer_id
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        })

        return result;
    }
    
    async delete(user) {

        const result = await api.delete(`/user/${user.id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        })
        return result;
    }

    async getUser(user) {
        const id = user.id;

        const result = await api.get(`/user/${id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

    async getAllUsers() {
        const result = await api.get('/user', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        });
        return result;
    }

}

export default UserService;