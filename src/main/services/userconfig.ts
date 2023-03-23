import { AssignedPosition, UserSelections } from "../../shared/types";

const USER_CONFIG: UserSelections = {
    all: {
        ban: [25, 99, 143], // Morgana, Lux, Zyra
        hover: [],
        pick: [],
    },

    top: {
        ban: [], // if ban is empty, use the generic BanList
        hover: [], // If hover is empty, use the PickList
        pick: [],
    },

    jungle: {
        ban: [],
        hover: [],
        pick: [],
    },

    middle: {
        ban: [],
        hover: [],
        pick: [],
    },

    bottom: {
        ban: [],
        hover: [],
        pick: [21, 222, 29], // MissForture, Jinx, Twitch
    },

    utility: {
        ban: [],
        hover: [235, 63], // Senna, Brand
        pick: [89, 111, 267], // Leo, Naut, Nami
    },
};

/* ======================== *\
    #Funcitons
\* ======================== */

export function getHoverList(role: AssignedPosition): number[] {
    return USER_CONFIG[role].hover
        .concat(USER_CONFIG.all.hover)
        .concat(USER_CONFIG[role].pick)
        .concat(USER_CONFIG.all.pick);
}

export function getBanList(role: AssignedPosition): number[] {
    return USER_CONFIG[role].ban.concat(USER_CONFIG.all.ban);
}

export function getPickList(role: AssignedPosition): number[] {
    return USER_CONFIG[role].pick.concat(USER_CONFIG.all.pick);
}
