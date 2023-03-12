import { sendRequest } from "./internal/lcu-https";
import { Action, ChampSelectSession } from "./types";

/* ======================== *\
    #Summoner
\* ======================== */

export function getCurrentSummoner() {
    return sendRequest("GET", "/lol-summoner/v1/current-summoner").then(
        (response) => response.json()
    );
}

/* ======================== *\
    #Lobby
\* ======================== */

export function openRankedLobby() {
    return sendRequest("POST", "/lol-lobby/v2/lobby", { queueId: 420 }).then(
        (response) => response.json()
    );
}
export function openPracticeToolLobby() {
    return sendRequest("POST", "/lol-lobby/v2/lobby", {
        customGameLobby: {
            configuration: {
                gameMode: "PRACTICETOOL",
                gameMutator: "",
                gameServerRegion: "",
                mapId: 11,
                mutators: { id: 1 },
                spectatorPolicy: "AllAllowed",
                teamSize: 5,
            },
            lobbyName: "Name",
            lobbyPassword: null,
        },
        isCustom: true,
    }).then((response) => response.json());
}

/* ======================== *\
    #Ready Check
\* ======================== */

export function startCustomLobby() {
    return sendRequest(
        "POST",
        "/lol-lobby/v1/lobby/custom/start-champ-select"
    ).then((response) => response.text());
}

export function startMatchmaking() {
    return sendRequest("POST", "/lol-lobby/v2/lobby/matchmaking/search").then(
        (response) => response.text()
    );
}

export function acceptReadyCheck() {
    return sendRequest("POST", "/lol-matchmaking/v1/ready-check/accept").then(
        (response) => response.text()
    );
}

export function declineReadyCheck() {
    return sendRequest("POST", "/lol-matchmaking/v1/ready-check/decline").then(
        (response) => response.text()
    );
}

/* ======================== *\
    #Champion Select
\* ======================== */

export async function getSession(): Promise<ChampSelectSession | undefined> {
    try {
        const response = await sendRequest(
            "GET",
            `/lol-champ-select/v1/session`
        );
        return response.json();
    } catch (err) {
        console.error("Unable to fetch 'session'", err);
        return undefined;
    }
}

/* ------------------------- *\
    #
\* ------------------------- */

export function getDisabledChampions(): Promise<number[]> {
    return sendRequest(
        "GET",
        `/lol-champ-select/v1/disabled-champion-ids`
    ).then((response) => response.json());
}

export function getBannableChampions(): Promise<number[]> {
    return sendRequest(
        "GET",
        `/lol-champ-select/v1/bannable-champion-ids`
    ).then((response) => response.json());
}

export function getPickableChampions(): Promise<number[]> {
    return sendRequest(
        "GET",
        `/lol-champ-select/v1/pickable-champion-ids`
    ).then((response) => response.json());
}

/* ------------------------- *\
    #Actions
\* ------------------------- */

export function hoverChampion(
    pickAction: Action,
    championId: number
): Promise<any> {
    return sendRequest(
        "PATCH",
        `/lol-champ-select/v1/session/actions/${pickAction.id}`,
        {
            championId,
            type: "pick",
        }
    ).then((response) => response.text());
}

export function pickChampion(
    pickAction: Action,
    championId: number
): Promise<any> {
    return sendRequest(
        "PATCH",
        `/lol-champ-select/v1/session/actions/${pickAction.id}`,
        {
            championId,
            completed: true,
            type: "pick",
        }
    ).then((response) => response.text());
}

export function banChampion(
    banAction: Action,
    championId: number
): Promise<any> {
    return sendRequest(
        "PATCH",
        `/lol-champ-select/v1/session/actions/${banAction.id}`,
        {
            championId,
            completed: true,
            type: "ban",
        }
    ).then((response) => response.text());
}
