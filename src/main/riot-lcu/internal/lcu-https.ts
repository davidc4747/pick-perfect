import fetch from "node-fetch-commonjs";
import { getCredentials } from "./credentials";

/* ======================== *\
    #Utils
\* ======================== */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type LcuResponse<T extends Record<string, any> | string | void> =
    | ["RiotServerNotFound"]
    | ["Error", any]
    | ["Success", T];

export async function sendRequest<
    T extends Record<string, any> | string | void
>(
    method: HttpMethod,
    APIendpoint: string,
    body?: Record<string, any>
): Promise<LcuResponse<T>> {
    const cred = await getCredentials();
    if (cred === null) return ["RiotServerNotFound"];

    const { host, port, authorization, agent } = cred;
    const options = {
        method: method.toUpperCase(),
        headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
        },
        body: body ? JSON.stringify(body) : null,
        agent,
    };

    // Send Request
    let response: any;
    try {
        response = await fetch(
            `https://${host}:${port}${APIendpoint}`,
            options
        );
    } catch (err) {
        console.error("Unable to fetch:", method, APIendpoint);
        return ["Error", err];
    }

    // Try to Parse as JSON, if not use the string
    let data: any = await response.text();
    try {
        data = JSON.parse(data);
    } catch (err) {
        // "data" is not valid JSON
        // just return string value
    }

    // Some Error logging
    if (response.status >= 300) {
        console.error("ERROR Invalid riot-lcu request:", method, APIendpoint);
        console.error("Request Body:", body);
        console.error("Response:", data);
        return ["Error", data];
    }

    // Send usable data back :)
    return ["Success", data];
}
