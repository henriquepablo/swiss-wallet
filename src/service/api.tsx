import axios from "axios";

const api = axios.create({
    baseURL: 'http://192.168.15.5:8080/api/v3/'
});

export default api;