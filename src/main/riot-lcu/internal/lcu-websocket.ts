import { getCredentials } from "./credentials";
import WebSocket from "ws";

enum MESSAGE_TYPES {
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
    | ["WebsocketError", Error]
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
        ws.on("error", (err) => resolve(["WebsocketError", err]));

        // Subscribe to ALL events, and handle any responses
        ws.on("open", () => {
            ws?.send(
                JSON.stringify([MESSAGE_TYPES.SUBSCRIBE, "OnJsonApiEvent"])
            );
            ws?.on("message", handleMessage);
            resolve(["Connected"]);
        });
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

/* ------------------------- *\
    #Events
\* ------------------------- */

type EventTypes = "CREATE" | "UPDATE" | "DELETE";

interface Event {
    eventType: EventTypes;
    uri: string;
    callback: (data: any) => void;
}
let eventList: Event[] = [];

export function clearEvents() {
    eventList = [];
}

export function onEvent(
    eventType: EventTypes,
    uri: string,
    callback: (data: any) => void
) {
    // if not connected, then connect first
    // if (!ws) {
    //     connect();
    // }

    eventList.push({
        eventType,
        uri,
        callback,
    });
}

type MessageResponse = [
    opcode: string,
    eventName: string,
    data: { uri: string; eventType: EventTypes; data: any }
];
function handleMessage(message: string) {
    const resString = message.toString();
    if (resString) {
        const res: MessageResponse = JSON.parse(resString);
        const data = res[2];

        // Notify any listeners that need to know about this WebSocket message
        for (const event of eventList) {
            if (
                data.uri === event.uri.toLowerCase() &&
                data.eventType.toUpperCase() === event.eventType.toUpperCase()
            ) {
                event.callback(data.data);
            }
        }
    }
}
