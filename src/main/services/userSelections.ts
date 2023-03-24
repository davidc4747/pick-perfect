import { UserSelections } from "../../shared/types";
import { AssignedPosition } from "../riot-lcu/types";
AssignedPosition;

let userSelection: UserSelections = {
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
    return userSelection[role].hover
        .concat(userSelection.all.hover)
        .concat(userSelection[role].pick)
        .concat(userSelection.all.pick);
}

export function getBanList(role: AssignedPosition): number[] {
    return userSelection[role].ban.concat(userSelection.all.ban);
}

export function getPickList(role: AssignedPosition): number[] {
    return userSelection[role].pick.concat(userSelection.all.pick);
}

export function getAllSelections(): UserSelections {
    return userSelection;
}

export function updateSelections(newUserSelection: UserSelections) {
    userSelection = newUserSelection;
}
