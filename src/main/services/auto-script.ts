import { ChampSelectSession, Action } from "../riot-lcu/types";
import { connect, disconnect } from "../riot-lcu/internal/lcu-websocket";
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
} from "../riot-lcu/events";
import {
    getSession,
    openRankedLobby,
    acceptReadyCheck,
    startMatchmaking,
    hoverChampion,
    banChampion,
    pickChampion,
} from "../riot-lcu/requests";
import {
    getMyPickAction,
    getMyAssignedPosition,
    getUnPickableChampions,
} from "../riot-lcu/session-helpers";
import { wait } from "./utils";
import { getHoverList, getBanList, getPickList } from "./userSelections";

/* ======================== *\
    #Start
\* ======================== */

export async function endAutoScript() {
    await disconnect();
}

export async function startAutoScript(): Promise<void> {
    const [status] = await connect();
    if (status === "Connected") {
        console.log(status, "Running...");
        await setupEvents();
    } else {
        // Keep trying until a connection is made
        console.log("LeagueClientUx Not Found..");
        await wait(1000);
        await startAutoScript();
    }
}

async function setupEvents(): Promise<void> {
    onMatchFound(acceptReadyCheck);
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

        const [status, updatedSession] = await getSession(); // Grab an Updated Version of Session
        if (status === "Success") {
            const myRole = getMyAssignedPosition(updatedSession);
            const disabledChampions = getUnPickableChampions(updatedSession);

            if (myRole && banAction) {
                const banID =
                    getBanList(myRole).find(
                        (id: number) => !disabledChampions.includes(id)
                    ) ?? 0;

                console.log("Ban:", banID);
                await banChampion(banAction, banID);
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
        _: Action,
        session: ChampSelectSession
    ): Promise<void> {
        // If only a few seconds left. Lock-in something for them.
        timeout = setTimeout(
            pickMyChampion,
            session.timer.adjustedTimeLeftInPhase - 3000
        );
    });
    async function pickMyChampion(): Promise<void> {
        const [status, updatedSession] = await getSession(); // Grab an up to date Version of Session
        if (status === "Success") {
            const myRole = getMyAssignedPosition(updatedSession);
            const disabledChampions = getUnPickableChampions(updatedSession);
            const updatedPickAction = getMyPickAction(updatedSession);
            if (myRole && updatedPickAction) {
                const pickID =
                    getPickList(myRole).find(
                        (id: number) => !disabledChampions.includes(id)
                    ) ?? 0;

                console.log("Pick:", myRole, pickID);
                await pickChampion(updatedPickAction, pickID);
            }
        }
    }
}
