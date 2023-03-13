import { ChampSelectSession, Action } from "../shared/types";
import { connect } from "./riot-lcu/internal/lcu-websocket";
import {
    onMatchFound,
    onHonorCompleted,
    onEnteredChampionSelect,
} from "./riot-lcu/events";
import {
    openRankedLobby,
    acceptReadyCheck,
    startMatchmaking,
    hoverChampion,
} from "./riot-lcu/requests";
import {
    getMyPickAction,
    getMyAssignedPosition,
    getUnPickableChampions,
} from "./riot-lcu/session";
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
        await acceptReadyCheck();
    });

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

        const myRole = getMyAssignedPosition(session);
        const disabledChampions = getUnPickableChampions(session);
        const pickAction = getMyPickAction(session);

        if (myRole && pickAction) {
            const hoverID =
                getHoverList(myRole).find(
                    (id: number) => !disabledChampions.includes(id)
                ) ?? 0;

            console.log("Hover: ", hoverID);
            await hoverChampion(pickAction, hoverID);
        }
    });
}
