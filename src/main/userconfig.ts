import { AssignedPosition, UserConfig } from "../shared/types";

const USER_CONFIG: UserConfig = {
    all: {
        bans: [25, 99, 143], // Morgana, Lux, Zyra
        hover: [],
        picks: [],
    },

    top: {
        bans: [], // if ban is empty, use the generic BanList
        hover: [], // If hover is empty, use the PickList
        picks: [],
    },

    jungle: {
        bans: [],
        hover: [],
        picks: [],
    },

    middle: {
        bans: [],
        hover: [],
        picks: [],
    },

    bottom: {
        bans: [],
        hover: [],
        picks: [21, 222, 29], // MissForture, Jinx, Twitch
    },

    utility: {
        bans: [],
        hover: [235, 63], // Senna, Brand
        picks: [89, 111, 267], // Leo, Naut, Nami
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
