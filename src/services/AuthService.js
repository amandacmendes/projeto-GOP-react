import axios from 'axios';
import { api } from './api';

class AuthService {

    static isAuthenticated() {
        return !!sessionStorage.getItem('token');
    }

    static async validate(email, password) {


        const result = await api.post('/signin', {
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: "*/*"
            }
        })/*
        .catch((error) => {
            console.log(error)
            return error.response.data.error;
        });*/

        return result;

    }

    static login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {

                api.post('/signin', {
                    email,
                    password
                }).then((response) => {
                    const data = response.data;
                    sessionStorage.setItem('token', data.accessToken);
                    sessionStorage.setItem('id', data.id);
                    resolve();
                }).catch((error) => {
                    console.log(error)
                    reject(new Error('Credenciais inválidas. Erro: ' + error.response.data.error));
                })

            }, 1000);
        });
    }

    static register(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const create = (data) => {
                    api.post('/signup', {
                        email,
                        password
                    }).then(function (response) {
                        resolve();
                    }).catch(function (error) {
                        console.log(error);
                        reject(new Error('Erro: ', error.message));
                    });
                }
            }, 1000);
        });
    }

    static logout() {
        // Desautentica o usuário
        sessionStorage.removeItem('token');
    }

}
export default AuthService;