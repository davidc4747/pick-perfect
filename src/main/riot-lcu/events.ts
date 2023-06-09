import { ChampSelectSession, Action } from "./types";
import { onEvent } from "./internal/lcu-websocket";

/* ======================== *\
    #Matchmacking
\* ======================== */

type SearchState = {
    errors: any[];
    lowPriorityData: {
        bustedLeaverAccessToken: string;
        penalizedSummonerIds: number[];
        penaltyTime: number;
        penaltyTimeRemaining: number;
        reason: string;
    };
    searchState: "Searching" | "Found" | "Invalid";
};
export function onMatchFound(callback: (data: SearchState) => void): void {
    onEvent(
        "Update",
        "/lol-lobby/v2/lobby/matchmaking/search-state",
        function (data: SearchState) {
            if (data.searchState === "Found") {
                callback(data);
            }
        }
    );
}

export function onDodgerQueueFinished(callback: () => void): void {
    // NOTE: if you get Dodge Penalty Muliple times in a row,
    //      the error id will increment. so next time
    //      it will be /errors/2 and this event won't trigger [DC]
    onEvent("Delete", "/lol-matchmaking/v1/search/errors/1", callback);
}

/* ======================== *\
    #Champion Select
\* ======================== */

export function onEnteredChampionSelect(
    callback: (data: ChampSelectSession) => void
): void {
    onEvent("Create", "/lol-champ-select/v1/session", callback);
}

export function onExitChampionSelect(
    callback: (data: ChampSelectSession) => void
): void {
    onEvent("Delete", "/lol-champ-select/v1/session", callback);
}

export function onHover(callback: (data: ChampSelectSession) => void): void {
    onEvent(
        "Create",
        "/lol-champ-select/v1/session",
        function (data: ChampSelectSession) {
            // there's some animations playing, just wait for them to finish
            setTimeout(callback, 9200, data);
        }
    );
}

export function onPlayerBanAction(
    callback: (banAction: Action, session: ChampSelectSession) => void
): void {
    let hasTriggered = false;
    onEvent(
        "Create",
        "/lol-champ-select/v1/session",
        () => (hasTriggered = false)
    );
    onEvent(
        "Update",
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
    let hasTriggered = false;
    onEvent(
        "Create",
        "/lol-champ-select/v1/session",
        () => (hasTriggered = false)
    );
    onEvent(
        "Update",
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
        "Update",
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
        "Update",
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

type VoteCompletion = { fullTeamVote: boolean; gameId: number };
type Recognition = {
    displayName: string;
    gameId: number;
    summonerId: number;
};

export function onHonorCompleted(callback: () => void): void {
    // /lol-honor-v2/v1/honor-player
    // /lol-honor-v2/v1/recognition
    let hasTriggered = false;
    onEvent("Create", "/lol-champ-select/v1/session", () => {
        hasTriggered = false;
    });
    onEvent("Create", "/lol-honor-v2/v1/vote-completion", trigger);
    onEvent("Create", "/lol-honor-v2/v1/recognition-history", trigger);
    function trigger(data: VoteCompletion | Recognition[]) {
        if (!hasTriggered) {
            callback();
            hasTriggered = true;
        }
    }
}
