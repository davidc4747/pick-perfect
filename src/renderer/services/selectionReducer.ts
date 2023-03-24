import {
    UserSelections,
    UserSelectionType,
    ChampionSelectPhase,
} from "../../shared/types";

export const INITIAL_USER_SELECTION: UserSelections = {
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

interface UserSelectionAction {
    type: "add" | "change_order" | "remove";
    selectionType: UserSelectionType;
    phase: ChampionSelectPhase;
    championId?: number;
    oldIndex?: number;
    newIndex?: number;
}

export function selectionReducer(
    selections: UserSelections,
    action: UserSelectionAction
): UserSelections {
    const { selectionType, phase, championId, oldIndex, newIndex } = action;
    switch (action.type) {
        case "add":
            // Only add Unique Values
            if (!selections[selectionType][phase]?.includes(championId ?? -1)) {
                return {
                    ...selections,
                    [selectionType]: {
                        ...selections[selectionType],
                        [phase]: [
                            ...selections[selectionType][phase],
                            championId,
                        ],
                    },
                };
            } else {
                return selections; // Do Nothing
            }
        case "remove":
            return {
                ...selections,
                [selectionType]: {
                    ...selections[selectionType],
                    [phase]: selections[selectionType][phase].filter(
                        (id) => id !== championId
                    ),
                },
            };
        case "change_order": {
            // NOTE: I specifically check for undefined here cuz 'oldIndex' could be 0 [DC]
            if (oldIndex !== undefined && newIndex !== undefined) {
                const phaseSelections = selections[selectionType][phase];

                phaseSelections.splice(newIndex, 0, phaseSelections[oldIndex]);
                phaseSelections.splice(
                    newIndex > oldIndex ? oldIndex : oldIndex + 1,
                    1
                );

                return {
                    ...selections,
                    [selectionType]: {
                        ...selections[selectionType],
                        [phase]: phaseSelections,
                    },
                };
            } else {
                return { ...selections }; // invalid Action, do nothing
            }
        }
    }
}
