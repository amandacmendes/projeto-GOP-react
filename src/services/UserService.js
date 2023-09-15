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
                    console.log(data.accessToken)
                    resolve();

                }).catch((error) => {
                    reject(new Error(' Erro: ' + error.response.data.error));
                })
            }, 1000);
        });
    }


}

export default UserService;