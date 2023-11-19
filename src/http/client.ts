import axios from "axios";
import {Auth} from "aws-amplify";

export default axios.create({
    baseURL: "/v1/exhibitions/",
    headers: {
        "Content-type": "application/json",
    },
});
