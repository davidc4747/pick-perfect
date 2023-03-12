import { onMatchFound, onHonorCompleted } from "./riot-lcu/events";
import {
    openRankedLobby,
    acceptReadyCheck,
    startMatchmaking,
} from "./riot-lcu/requests";

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
}
