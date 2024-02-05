import axios from "axios";

// TODO: Change the URL to the API Endpoint
const API_URL = "http://127.0.0.1:5000/";

class TaigaService {
    
    taigaAuthenticate(username, password) {
        return axios.post(API_URL + "authenticate", {
            username,
            password
        });
    }

}

export default new TaigaService();