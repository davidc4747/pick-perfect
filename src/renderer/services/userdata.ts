import {
    UserSelections,
    UserSelectionType,
    ChampionSelectPhase,
} from "../../shared/types";

export const DEFAULT_USER_CONFIG: UserSelections = {
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
        pick: [56, 121],
    },

    middle: {
        ban: [],
        hover: [],
        pick: [],
    },

    bottom: {
        ban: [],
        hover: [],
        pick: [21, 22, 222], // MissForture, Ashe, Jinx
    },

    utility: {
        ban: [],
        hover: [235, 63], // Senna, Brand
        pick: [89, 111, 267], // Leo, Naut, Nami
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

export function userSelectionsReducer(
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
