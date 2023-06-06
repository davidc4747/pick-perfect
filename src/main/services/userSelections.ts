import { UserSelections } from "../../shared/types";
import { AssignedPosition } from "../riot-lcu/types";
AssignedPosition;

let userSelection: UserSelections = {
    all: {
        ban: [17],
        hover: [],
        pick: [],
    },

    top: {
        ban: [266, 24, 54],
        hover: [],
        pick: [],
    },

    jungle: {
        ban: [121, 104, 64],
        hover: [],
        pick: [],
    },

    middle: {
        ban: [103, 157, 238],
        hover: [],
        pick: [],
    },

    bottom: {
        ban: [202, 81, 236],
        hover: [],
        pick: [],
    },

    utility: {
        ban: [412, 350, 117],
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
    return userSelection;
}

export function updateSelections(newUserSelection: UserSelections) {
    userSelection = newUserSelection;
}
