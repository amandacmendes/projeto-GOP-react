import axios from 'axios';

class AuthService {

    static isAuthenticated() {
        return !!sessionStorage.getItem('token');
    }

    static login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {

                axios.post('http://localhost:8080/signin', {
                    email,
                    password
                }).then((response) => {
                    const data = response.data;
                    sessionStorage.setItem('token', data.accessToken);
                    console.log(sessionStorage.getItem('token'))
                    resolve();
                }).catch((error) => {
                    console.log(error)
                    reject(new Error('Credenciais inválidas. Erro: ' + error));
                })

            }, 1000);
        });
    }

    static register(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const create = (data) => {
                    axios.post('http://localhost:8080/signup', {
                        email,
                        password
                    }).then(function (response) {
                        console.log('----', response);
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