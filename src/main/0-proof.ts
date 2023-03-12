import { ChampSelectSession, Action } from "./riot-lcu/types";
import {
    getMyPickAction,
    getMyAssignedPosition,
    getUnPickableChampions,
} from "./riot-lcu/session";
import {
    getSession,
    acceptReadyCheck,
    hoverChampion,
    pickChampion,
    banChampion,
    openRankedLobby,
    startMatchmaking,
} from "./riot-lcu/requests";
import {
    onMatchFound,
    onEnteredChampionSelect,
    onPlayerBanAction,
    onPlayerPickAction,
    onPlayerPickChanged,
    onPlayerPickCompleted,
    onHonorCompleted,
    onExitChampionSelect,
} from "./riot-lcu/events";

/* ======================== *\
    #User Config
\* ======================== */

interface UserConfig {
    all: RoleSelections;
    top: RoleSelections;
    jungle: RoleSelections;
    middle: RoleSelections;
    utility: RoleSelections;
    bottom: RoleSelections;
}
interface RoleSelections {
    bans: number[]; // if ban is empty, use the generic BanList
    hover: number[]; // If hover is empty, use the PickList
    picks: number[];
    spells: number[];
}

const USER_CONFIG: UserConfig = {
    all: {
        bans: [25, 99, 143], // Morgana, Lux, Zyra
        hover: [],
        picks: [],
        spells: [],
    },

    top: {
        bans: [], // if ban is empty, use the generic BanList
        hover: [], // If hover is empty, use the PickList
        picks: [],
        spells: [],
    },

    jungle: {
        bans: [],
        hover: [],
        picks: [],
        spells: [],
    },

    middle: {
        bans: [],
        hover: [],
        picks: [],
        spells: [],
    },

    bottom: {
        bans: [],
        hover: [],
        picks: [21, 222, 29], // MissForture, Jinx, Twitch
        spells: [],
    },

    utility: {
        bans: [],
        hover: [235, 63], // Senna, Brand
        picks: [89, 111, 267], // Leo, Naut, Nami
        spells: [],
    },
};

/* ======================== *\
    #Init
\* ======================== */

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

onEnteredChampionSelect(async function (
    session: ChampSelectSession
): Promise<void> {
    console.log("---------------------");
    await wait(9350); // there's some animations playing, just wait for them to finish

    const myRole = getMyAssignedPosition(session);
    const disabledChampions = getUnPickableChampions(session);
    const pickAction = getMyPickAction(session);

    if (myRole && pickAction) {
        const hoverID = USER_CONFIG[myRole].hover
            .concat(USER_CONFIG.all.hover)
            .concat(USER_CONFIG[myRole].picks)
            .concat(USER_CONFIG.all.picks)
            .find((id: number) => !disabledChampions.includes(id));

        if (hoverID) {
            console.log("Hover: ", hoverID);
            await hoverChampion(pickAction, hoverID);
        }
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
            const banID = USER_CONFIG[myRole].bans
                .concat(USER_CONFIG.all.bans)
                .find((id: number) => !disabledChampions.includes(id));

            if (banID) {
                console.log("Ban:", banID);
                await banChampion(banAction, banID);
            }
        }
    }
});

/* ------------------------- *\
    #Auto-Pick
\* ------------------------- */

let timeout: any;
// onPlayerPickLockedin;
onPlayerPickChanged(function (): void {
    // if user manually changes their Champion then don't run auto-pick.
    clearTimeout(timeout);
});
onPlayerPickCompleted(function (): void {
    // if user locks in their Champion, don't run auto-pick
    clearTimeout(timeout);
});
onExitChampionSelect(function (): void {
    // if someone Dodges, don't run auto-pick.
    clearTimeout(timeout);
});
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
            const pickID = USER_CONFIG[myRole].picks
                .concat(USER_CONFIG.all.picks)
                .find((id: number) => !disabledChampions.includes(id));
            if (pickID) {
                console.log("Pick:", myRole, pickID);
                await pickChampion(updatedPickAction, pickID);
            }
        }
    }
}

/* ======================== *\
    #Utils
\* ======================== */

export function wait(miliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, miliseconds));
}
