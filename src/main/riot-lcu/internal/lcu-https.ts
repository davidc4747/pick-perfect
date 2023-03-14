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

    // Send Request
    const response = await fetch(
        `https://${host}:${port}${APIendpoint}`,
        options
    );

    // Try to Parse as JSON, if not use the string
    let data: any = await response.text();
    try {
        data = JSON.parse(data);
    } catch (err) {
        // "data" is not valid JSON
        // just use the original string value
    }

    // Some Error logging
    if (response.status >= 300) {
        console.error("ERROR Invalid riot-lcu request:", method, APIendpoint);
        console.error("Request Body:", body);
        console.error("Response:", data);
    }

    // Send usable data back :)
    return data;
}
