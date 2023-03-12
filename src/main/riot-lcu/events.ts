import { ChampSelectSession, Action } from "./types";
import { onEvent } from "./internal/lcu-websocket";

/* ======================== *\
    #Matchmacking
\* ======================== */

export function onMatchFound(callback: (data: any) => void): void {
    onEvent(
        "UPDATE",
        "/lol-lobby/v2/lobby/matchmaking/search-state",
        function (data: any) {
            // searchState = 'Searching' | 'Found' | 'Invalid'
            if (data.searchState === "Found") {
                callback(data);
            }
        }
    );
}

/* ======================== *\
    #Champion Select
\* ======================== */

export function onEnteredChampionSelect(
    callback: (data: ChampSelectSession) => void
): void {
    onEvent("CREATE", "/lol-champ-select/v1/session", callback);
}

export function onExitChampionSelect(
    callback: (data: ChampSelectSession) => void
): void {
    onEvent("DELETE", "/lol-champ-select/v1/session", callback);
}

export function onPlayerBanAction(
    callback: (banAction: Action, session: ChampSelectSession) => void
): void {
    let hasTriggered: boolean = false;
    onEvent(
        "CREATE",
        "/lol-champ-select/v1/session",
        () => (hasTriggered = false)
    );
    onEvent(
        "UPDATE",
        "/lol-champ-select/v1/session",
        function (session: ChampSelectSession) {
            const { actions, timer, localPlayerCellId } = session;
            const banAction: Action | undefined = actions
                .flat()
                .find(
                    (act) =>
                        act.type === "ban" &&
                        act.actorCellId === localPlayerCellId
                );

            if (
                // if Bans have Started
                timer.phase === "BAN_PICK" &&
                // Only tigger once per champ select
                !hasTriggered &&
                // if it's the localplayer's turn to ban
                banAction?.isInProgress
            ) {
                callback(banAction, session);
                hasTriggered = true;
            }
        }
    );
}

export function onPlayerPickAction(
    callback: (pickAction: Action, session: ChampSelectSession) => void
): void {
    let hasTriggered: boolean = false;
    onEvent(
        "CREATE",
        "/lol-champ-select/v1/session",
        () => (hasTriggered = false)
    );
    onEvent(
        "UPDATE",
        "/lol-champ-select/v1/session",
        function (session: ChampSelectSession) {
            const { actions, timer, localPlayerCellId } = session;
            const pickAction: Action | undefined = actions
                .flat()
                .find(
                    (act) =>
                        act.type === "pick" &&
                        act.actorCellId === localPlayerCellId
                );

            if (
                // if Pick phase has Started
                timer.phase === "BAN_PICK" &&
                // Only tigger once per champ select
                !hasTriggered &&
                // if it's the localplayer's turn to pick
                pickAction?.isInProgress
            ) {
                callback(pickAction, session);
                hasTriggered = true;
            }
        }
    );
}

export function onPlayerPickChanged(
    callback: (playerChampionId: number, session: ChampSelectSession) => void
): void {
    let playerChampionId = 0;
    onEvent(
        "UPDATE",
        "/lol-champ-select/v1/session",
        function (session: ChampSelectSession) {
            const { actions, localPlayerCellId } = session;
            const pickAction: Action | undefined = actions
                .flat()
                .find(
                    (act) =>
                        act.type === "pick" &&
                        act.actorCellId === localPlayerCellId
                );

            if (pickAction && pickAction.championId !== playerChampionId) {
                playerChampionId = pickAction.championId;
                callback(pickAction.championId, session);
            }
        }
    );
}

export function onPlayerPickCompleted(
    callback: (playerChampionId: number, session: ChampSelectSession) => void
): void {
    onEvent(
        "UPDATE",
        "/lol-champ-select/v1/session",
        function (session: ChampSelectSession) {
            const { actions, localPlayerCellId } = session;
            const pickAction: Action | undefined = actions
                .flat()
                .find(
                    (act) =>
                        act.type === "pick" &&
                        act.actorCellId === localPlayerCellId
                );

            if (pickAction?.completed) {
                callback(pickAction.championId, session);
            }
        }
    );
}

/* ======================== *\
    #Game Ended
\* ======================== */

interface RecognitionItem {
    displayName: string;
    gameId: number;
    summonerId: number;
}

export function onHonorCompleted(
    callback: (data: RecognitionItem[]) => void
): void {
    onEvent("CREATE", "/lol-honor-v2/v1/vote-completion", callback);
    onEvent("CREATE", "/lol-honor-v2/v1/recognition-history", callback);
}
