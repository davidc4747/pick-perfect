import { UserSelections } from "../../shared/types";
import { AssignedPosition } from "../riot-lcu/types";
AssignedPosition;

let userSelection: UserSelections = {
    all: {
        ban: [],
        hover: [],
        pick: [],
    },

    top: {
        ban: [],
        hover: [],
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
        pick: [],
    },

    utility: {
        ban: [],
        hover: [],
        pick: [],
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
    // TODO: Pull from file on first load
    return userSelection;
}

export function updateSelections(newUserSelection: UserSelections) {
    userSelection = newUserSelection;
    // TODO: Save to file on first load
}
