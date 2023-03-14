import { sendRequest } from "./internal/lcu-https";
import {
    CurrentSummoner,
    Lobby,
    Action,
    ChampSelectSession,
} from "../../shared/types";

/* ======================== *\
    #Summoner
\* ======================== */

export function getCurrentSummoner(): Promise<CurrentSummoner> {
    return sendRequest("GET", "/lol-summoner/v1/current-summoner");
}

/* ======================== *\
    #Lobby
\* ======================== */

export function openRankedLobby(): Promise<Lobby> {
    return sendRequest("POST", "/lol-lobby/v2/lobby", { queueId: 420 });
}
export function openPracticeToolLobby(): Promise<Lobby> {
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
    });
}

/* ======================== *\
    #Ready Check
\* ======================== */

interface StartRespoonse {
    failedPlayers: [];
    success: boolean;
}

export function startCustomLobby(): Promise<StartRespoonse> {
    return sendRequest("POST", "/lol-lobby/v1/lobby/custom/start-champ-select");
}

export function startMatchmaking(): Promise<""> {
    return sendRequest("POST", "/lol-lobby/v2/lobby/matchmaking/search");
}

export function acceptReadyCheck(): Promise<any> {
    return sendRequest("POST", "/lol-matchmaking/v1/ready-check/accept");
}

export function declineReadyCheck(): Promise<any> {
    return sendRequest("POST", "/lol-matchmaking/v1/ready-check/decline");
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
    return sendRequest("GET", `/lol-champ-select/v1/disabled-champion-ids`);
}

export function getBannableChampions(): Promise<number[]> {
    return sendRequest("GET", `/lol-champ-select/v1/bannable-champion-ids`);
}

export function getPickableChampions(): Promise<number[]> {
    return sendRequest("GET", `/lol-champ-select/v1/pickable-champion-ids`);
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
    );
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
    );
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
    );
}
