import { LcuResponse, sendRequest } from "./internal/lcu-https";
import { CurrentSummoner, Lobby, Action, ChampSelectSession } from "./types";

/* ======================== *\
    #Summoner
\* ======================== */

export function getCurrentSummoner(): Promise<LcuResponse<CurrentSummoner>> {
    return sendRequest("GET", "/lol-summoner/v1/current-summoner");
}

/* ======================== *\
    #Lobby
\* ======================== */

export async function openRankedLobby(): Promise<LcuResponse<Lobby>> {
    return sendRequest("POST", "/lol-lobby/v2/lobby", { queueId: 420 });
}

export function openPracticeToolLobby(): Promise<LcuResponse<Lobby>> {
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

export function startCustomLobby(): Promise<LcuResponse<StartRespoonse>> {
    return sendRequest("POST", "/lol-lobby/v1/lobby/custom/start-champ-select");
}

export function startMatchmaking(): Promise<LcuResponse<void>> {
    return sendRequest("POST", "/lol-lobby/v2/lobby/matchmaking/search");
}

export function acceptReadyCheck(): Promise<LcuResponse<void>> {
    return sendRequest("POST", "/lol-matchmaking/v1/ready-check/accept");
}

export function declineReadyCheck(): Promise<LcuResponse<any>> {
    return sendRequest("POST", "/lol-matchmaking/v1/ready-check/decline");
}

/* ======================== *\
    #Champion Select
\* ======================== */

export async function getSession(): Promise<LcuResponse<ChampSelectSession>> {
    return await sendRequest("GET", `/lol-champ-select/v1/session`);
}

/* ------------------------- *\
    #
\* ------------------------- */

export function getDisabledChampions(): Promise<LcuResponse<number[]>> {
    return sendRequest("GET", `/lol-champ-select/v1/disabled-champion-ids`);
}

export function getBannableChampions(): Promise<LcuResponse<number[]>> {
    return sendRequest("GET", `/lol-champ-select/v1/bannable-champion-ids`);
}

export function getPickableChampions(): Promise<LcuResponse<number[]>> {
    return sendRequest("GET", `/lol-champ-select/v1/pickable-champion-ids`);
}

/* ------------------------- *\
    #Actions
\* ------------------------- */

export function hoverChampion(
    pickAction: Action,
    championId: number
): Promise<LcuResponse<ChampSelectSession>> {
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
): Promise<LcuResponse<ChampSelectSession>> {
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
): Promise<LcuResponse<ChampSelectSession>> {
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
