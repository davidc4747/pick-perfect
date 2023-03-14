import { ChampSelectSession, Action } from "../shared/types";
import { connect } from "./riot-lcu/internal/lcu-websocket";
import {
    onMatchFound,
    onHonorCompleted,
    onDodgerQueueFinished,
    onEnteredChampionSelect,
    onPlayerBanAction,
    onPlayerPickChanged,
    onPlayerPickCompleted,
    onExitChampionSelect,
    onPlayerPickAction,
} from "./riot-lcu/events";
import {
    getSession,
    openRankedLobby,
    acceptReadyCheck,
    startMatchmaking,
    hoverChampion,
    banChampion,
    pickChampion,
} from "./riot-lcu/requests";
import {
    getMyPickAction,
    getMyAssignedPosition,
    getUnPickableChampions,
} from "./riot-lcu/session-helpers";
import { getHoverList, getBanList, getPickList } from "./userconfig";

/* ======================== *\
    #Utils
\* ======================== */

function wait(miliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, miliseconds));
}

/* ======================== *\
    #Start
\* ======================== */

export async function startAutoScript() {
    await connect();
    console.log("Running...");

    onMatchFound(async function () {
        // if you accept the request too fast, the animations don't play properly [DC]
        await wait(100);
        const acceptData = await acceptReadyCheck();
        console.log("acceptMathc Data:", acceptData);
    });

    onDodgerQueueFinished(startMatchmaking);

    onHonorCompleted(async function () {
        await wait(300);
        await openRankedLobby();
        await wait(300);
        await startMatchmaking();
    });

    /* ------------------------- *\
        #Enter Champion Select
    \* ------------------------- */

    onEnteredChampionSelect(async function (
        session: ChampSelectSession
    ): Promise<void> {
        console.log("---------------------");
        await wait(9350); // there's some animations playing, just wait for them to finish
        console.log("Session:", session);

        const myRole = getMyAssignedPosition(session);
        const disabledChampions = getUnPickableChampions(session);
        const pickAction = getMyPickAction(session);

        if (myRole && pickAction) {
            const hoverID =
                getHoverList(myRole).find(
                    (id: number) => !disabledChampions.includes(id)
                ) ?? 0;

            console.log("Hover: ", hoverID);
            const hoverData = await hoverChampion(pickAction, hoverID);
            console.log("hoverData: ", hoverData);
        }
    });

    /* ------------------------- *\
        #Auto-Ban
    \* ------------------------- */

    onPlayerBanAction(async function (
        banAction: Action,
        session: ChampSelectSession
    ): Promise<void> {
        // Give the other players a chance to ban first.
        const { timer } = session;
        await wait(timer.adjustedTimeLeftInPhase - 4000);

        const updatedSession = await getSession(); // Grab an Updated Version of Session
        if (updatedSession) {
            const myRole = getMyAssignedPosition(updatedSession);
            const disabledChampions = getUnPickableChampions(updatedSession);

            if (myRole && banAction) {
                const banID =
                    getBanList(myRole).find(
                        (id: number) => !disabledChampions.includes(id)
                    ) ?? 0;

                console.log("Ban:", banID);
                const banData = await banChampion(banAction, banID);
                console.log("banData:", banData);
            }
        }
    });

    /* ------------------------- *\
        #Auto-Pick
    \* ------------------------- */

    let timeout: NodeJS.Timeout;
    // Chance the timer is Player picks manually or Champ Select ends
    onPlayerPickChanged(() => clearTimeout(timeout));
    onPlayerPickCompleted(() => clearTimeout(timeout));
    onExitChampionSelect(() => clearTimeout(timeout));
    onPlayerPickAction(async function (
        pickAction: Action,
        session: ChampSelectSession
    ): Promise<void> {
        // If only a few seconds left. Lock-in something for them.
        timeout = setTimeout(
            async () => await pickMyChampion(),
            session.timer.adjustedTimeLeftInPhase - 3000
        );
    });
    async function pickMyChampion(): Promise<void> {
        const updatedSession = await getSession(); // Grab an up to date Version of Session
        if (updatedSession) {
            const myRole = getMyAssignedPosition(updatedSession);
            const disabledChampions = getUnPickableChampions(updatedSession);
            const updatedPickAction = getMyPickAction(updatedSession);
            if (myRole && updatedPickAction) {
                const pickID =
                    getPickList(myRole).find(
                        (id: number) => !disabledChampions.includes(id)
                    ) ?? 0;

                console.log("Pick:", myRole, pickID);
                const pickData = await pickChampion(updatedPickAction, pickID);
                console.log("pickData:", pickData);
            }
        }
    }
}
