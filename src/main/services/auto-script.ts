import { ChampSelectSession, Action } from "../riot-lcu/types";
import {
    connect,
    disconnect,
    clearEvents,
} from "../riot-lcu/internal/lcu-websocket";
import {
    onMatchFound,
    onHonorCompleted,
    onDodgerQueueFinished,
    onHover,
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
    #Checking Connection
\* ======================== */

export async function endAutoScript() {
    clearEvents();
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

/* ======================== *\
    #Setp Events
\* ======================== */

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
        #Auto-Hover
    \* ------------------------- */

    onHover(handleHover);

    /* ------------------------- *\
        #Auto-Ban
    \* ------------------------- */

    onPlayerBanAction(handleBan);

    /* ------------------------- *\
        #Auto-Pick
    \* ------------------------- */

    let timeout: NodeJS.Timeout;
    // Stop the timer if Player picks thier champion manually or Champ Select ends
    onPlayerPickChanged(() => clearTimeout(timeout));
    onPlayerPickCompleted(() => clearTimeout(timeout));
    onExitChampionSelect(() => clearTimeout(timeout));
    onPlayerPickAction(async function (
        _: Action,
        session: ChampSelectSession
    ): Promise<void> {
        // If only a few seconds left. Lock-in something for them.
        timeout = setTimeout(
            handlePick,
            session.timer.adjustedTimeLeftInPhase - 4000
        );
    });
}

/* ======================== *\
    #Event Listeners
\* ======================== */

async function handleHover(session: ChampSelectSession): Promise<void> {
    console.log("---------------------");
    const myRole = getMyAssignedPosition(session);
    const disabledChampions = getUnPickableChampions(session);
    const pickAction = getMyPickAction(session);

    if (myRole && pickAction) {
        const hoverID = getHoverList(myRole).find(
            (id) => !disabledChampions.includes(id)
        );
        if (hoverID) {
            console.log("Hover: ", hoverID);
            await hoverChampion(pickAction, hoverID);
        }
    }
}

async function handleBan(
    banAction: Action,
    session: ChampSelectSession
): Promise<void> {
    // Give the other players a chance to ban first.
    const { timer } = session;
    await wait(timer.adjustedTimeLeftInPhase - 5000);

    const [status, updatedSession] = await getSession(); // Grab an Updated Version of Session
    if (status === "Success") {
        const myRole = getMyAssignedPosition(updatedSession);
        const disabledChampions = getUnPickableChampions(updatedSession);

        if (myRole && banAction) {
            const banID = getBanList(myRole).find(
                (id) => !disabledChampions.includes(id)
            );
            if (banID) {
                console.log("Ban:", banID);
                await banChampion(banAction, banID);
            }
        }
    }
}

async function handlePick(): Promise<void> {
    const [status, updatedSession] = await getSession(); // Grab an up to date Version of Session
    if (status === "Success") {
        const myRole = getMyAssignedPosition(updatedSession);
        const disabledChampions = getUnPickableChampions(updatedSession);
        const updatedPickAction = getMyPickAction(updatedSession);
        if (myRole && updatedPickAction) {
            const pickID = getPickList(myRole).find(
                (id) => !disabledChampions.includes(id)
            );
            if (pickID) {
                console.log("Pick:", myRole, pickID);
                await pickChampion(updatedPickAction, pickID);
            }
        }
    }
}
