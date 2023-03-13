import {
    Action,
    AssignedPosition,
    ChampSelectSession,
} from "../../shared/types";

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
    if (!actions) {
        // TODO: DEBUGGING
        console.log("ERRROR Incoming!!!!");
        console.log("ERRROR Incoming!!!!");
        console.log("ERRROR Incoming!!!!");
        console.log("ERRROR Incoming!!!!");
        console.log("ERRROR Incoming!!!!");
        console.log("ERRROR Incoming!!!!");
        console.log("ERRROR Incoming!!!!");
        console.log("ERRROR Incoming!!!!");
        console.log("ERRROR Incoming!!!!");
        console.log("ERRROR Incoming!!!!");
        console.log(session, actions);

        // if the session is invalid, it should just return and empty array.
        // But why is the Session invalid?
        // That should never be the case. it should always have SOMETHING?
        // Maybe sombody dodged, but the timer is still running? so when triggers but i'm not actually in champion select
        // after the timer, check if we're still in match making?

        // use setTimeout() and clear it if game is dodged.
        // is there and event for game dodged? DELETE session maybe?
    }
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
