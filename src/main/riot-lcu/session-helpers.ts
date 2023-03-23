import { Action, AssignedPosition, ChampSelectSession } from "./types";

/* ======================== *\
    #Session Helpers
\* ======================== */

export function getMyActions(session: ChampSelectSession): Action[] {
    const { actions, localPlayerCellId } = session;
    const localPlayerActions = actions
        .flat()
        .filter((action) => action.actorCellId === localPlayerCellId);
    return localPlayerActions;
}

export function getMyBanAction(
    session: ChampSelectSession
): Action | undefined {
    const { actions, localPlayerCellId } = session;
    const banAction = actions
        .flat()
        .find(
            (action) =>
                action.actorCellId === localPlayerCellId &&
                action.type === "ban"
        );
    return banAction;
}

export function getMyPickAction(
    session: ChampSelectSession
): Action | undefined {
    const { actions, localPlayerCellId } = session;
    const pickAction = actions
        .flat()
        .find(
            (action) =>
                action.actorCellId === localPlayerCellId &&
                action.type === "pick"
        );
    return pickAction;
}

export function getMyAssignedPosition(
    session: ChampSelectSession
): AssignedPosition | undefined {
    const { myTeam, localPlayerCellId } = session;
    const position = myTeam?.find(
        (mem) => mem.cellId === localPlayerCellId
    )?.assignedPosition;
    return position;
}

export function getUnPickableChampions(session: ChampSelectSession): number[] {
    const { actions, localPlayerCellId } = session;
    const disabledChampions = actions
        .flat()
        .filter(
            (action) =>
                action.actorCellId !== localPlayerCellId &&
                action.championId !== 0
        )
        .map((action) => action.championId);
    return disabledChampions;
}
