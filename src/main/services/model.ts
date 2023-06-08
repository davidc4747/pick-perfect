import { UserSelections } from "../../shared/types";
import { AssignedPosition } from "../riot-lcu/types";
import { DEFAULT_SELECTIONS } from "./selectionsService";

let userSelection: UserSelections = DEFAULT_SELECTIONS;

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

export function update(newUserSelection: UserSelections) {
    userSelection = newUserSelection;
}
