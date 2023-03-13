import { AssignedPosition } from "../shared/types";

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
    #Funcitons
\* ======================== */

export function getHoverList(role: AssignedPosition): number[] {
    return USER_CONFIG[role].hover
        .concat(USER_CONFIG.all.hover)
        .concat(USER_CONFIG[role].picks)
        .concat(USER_CONFIG.all.picks);
}

export function getBanList(role: AssignedPosition): number[] {
    return USER_CONFIG[role].bans.concat(USER_CONFIG.all.bans);
}

export function getPickList(role: AssignedPosition): number[] {
    return USER_CONFIG[role].picks.concat(USER_CONFIG.all.picks);
}
