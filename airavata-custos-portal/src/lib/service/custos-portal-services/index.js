import axios from "axios";

export default {
    fetchUserinfo() {
        return axios.get("/api/userinfo")
            .then((res) => {
                return res ? res.data : null;
            });
    },
    fetchConfig() {
        return axios.get("/api/config")
            .then((res) => {
                return res ? res.data : null;
            });
    }
}
