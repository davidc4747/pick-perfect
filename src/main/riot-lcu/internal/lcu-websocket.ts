import { getCredentials } from "./credentials";
// @ts-ignore
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

type EventTypes = "CREATE" | "UPDATE" | "DELETE";

interface Event {
    eventType: EventTypes;
    uri: string;
    callback: (data: any) => void;
}

let ws: any | null = null;
let eventList: Event[] = [];

/* ======================== *\
    #
\* ======================== */

export function connect() {
    const { host, port, username, password, authorization, agent } =
        getCredentials();

    ws = new WebSocket(`wss://${username}:${password}@${host}:${port}`, {
        Authorization: authorization,
        agent,
    });
    ws.on("open", () => {
        ws.send(JSON.stringify([MESSAGE_TYPES.SUBSCRIBE, "OnJsonApiEvent"]));
    });
    ws.on("message", function (response: any) {
        const resString = response.toString();
        if (resString) {
            const [opcode, eventName, data] = JSON.parse(resString) || [];

            for (const event of eventList) {
                if (
                    data.uri === event.uri.toLowerCase() &&
                    data.eventType.toUpperCase() ===
                        event.eventType.toUpperCase()
                ) {
                    event.callback(data.data);
                }
            }
        }
    });
}

export function disconnect() {
    ws.close();
}

export function subscribe(event: (data: any) => void) {
    ws.send(JSON.stringify([MESSAGE_TYPES.SUBSCRIBE, event]));
}

export function clearEvents() {
    eventList = [];
}

export function onEvent(
    eventType: EventTypes,
    uri: string,
    callback: (data: any) => void
) {
    // if not connected, then connect first
    if (!ws) {
        connect();
    }

    eventList.push({
        eventType,
        uri,
        callback,
    });
}
