import axios, {AxiosError} from "axios";
import {ApiException} from "./types";
import {fetchAuthSession} from "aws-amplify/auth";

export default axios.create({
    baseURL: "/v1/",
    headers: {
        "Content-type": "application/json",
    },
});

export async function getAuthHeaders() {
    const session = await fetchAuthSession()
    return {
        headers: {
            "Authorization": `Bearer ${(session)?.tokens?.idToken}`,
            "IdentityId": session.identityId
        }
    }
}

export function normalize(value: string | undefined): string | undefined {
    return value === "" ? undefined : value;
}

export async function requestWrapper<T>(request: () => Promise<T>) {
    try {
        return await request()
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error(`Error, status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
            throw new ApiException(error.response.data.error, error.response.data.message)
        }
        console.error(`Unexpected error occurred: ${error}`);
        throw new ApiException("500", "apiError.unexpectedError");
    }
}