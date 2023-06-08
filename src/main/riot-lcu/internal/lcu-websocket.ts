import { getCredentials } from "./credentials";
import WebSocket from "ws";

enum MESSAGE_TYPE {
    WELCOME = 0,
    PREFIX = 1,
    CALL = 2,
    CALLRESULT = 3,
    CALLERROR = 4,
    SUBSCRIBE = 5,
    UNSUBSCRIBE = 6,
    PUBLISH = 7,
    EVENT = 8,
}

let ws: WebSocket | null = null;

/* ======================== *\
    #
\* ======================== */

type ConnectionStatus =
    | ["RiotServerNotFound"]
    | ["ConnectionError", Error]
    | ["Connected"];

export async function connect(): Promise<ConnectionStatus> {
    const cred = await getCredentials();
    if (cred === null) return ["RiotServerNotFound"];

    return new Promise(function (resolve) {
        // Attempt to connect to WebSocket Server
        const { host, port, username, password, agent } = cred;
        ws = new WebSocket(`wss://${username}:${password}@${host}:${port}`, {
            agent,
        });

        // Failed to connect, Send back an Error status
        ws.on("error", (err) => resolve(["ConnectionError", err]));

        // Subscribe to ALL events, and handle any responses
        ws.on("open", function () {
            ws?.send(
                JSON.stringify([MESSAGE_TYPE.SUBSCRIBE, "OnJsonApiEvent"])
            );
            ws?.on("message", handleMessage);
            resolve(["Connected"]);
        });
        ws?.on("close", clearEvents);
    });
}

export function disconnect(): Promise<void> {
    return new Promise(function (resolve) {
        if (ws) {
            ws.on("close", resolve);
            ws.close();
        } else {
            resolve();
        }
    });
}

export function onClose(callback: () => void) {
    ws?.on("close", callback);
}

/* ------------------------- *\
    #Events
\* ------------------------- */

type EventType = "Create" | "Update" | "Delete";

interface Event {
    eventType: EventType[];
    uri: string;
    callback: (data: any) => void;
}
let eventList: Event[] = [];

export function clearEvents() {
    eventList = [];
}

export function onEvent(
    eventType: EventType | EventType[],
    uri: string,
    callback: (data: any) => void
) {
    eventList.push({
        eventType: Array.isArray(eventType) ? eventType : [eventType],
        uri,
        callback,
    });
}

type MessageResponse = [
    opcode: MESSAGE_TYPE,
    eventName: string, // "OnJsonApiEvent"
    resBody: { uri: string; eventType: EventType; data: any }
];
function handleMessage(message: Buffer) {
    const resString = message.toString();
    if (resString) {
        const res = JSON.parse(resString) as MessageResponse;
        const data = res[2];

        // Notify any listeners that need to know about this WebSocket message
        for (const event of eventList) {
            if (
                data.uri === event.uri.toLowerCase() &&
                event.eventType.includes(data.eventType)
            ) {
                event.callback(data.data);
            }
        }
    }
}
