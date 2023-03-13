import fetch from "node-fetch-commonjs";
import { getCredentials } from "./credentials";

/* ======================== *\
    #Utils
\* ======================== */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function sendRequest(
    method: HttpMethod,
    APIendpoint: string,
    body?: any
): Promise<any> {
    const { host, port, authorization, agent } = await getCredentials();

    const options = {
        method: method.toUpperCase(),
        headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
        },
        body: body ? JSON.stringify(body) : null,
        agent,
    };

    return fetch(`https://${host}:${port}${APIendpoint}`, options);
}
