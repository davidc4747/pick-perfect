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

type UserSelectionAction =
    | {
          type: "ADD";
          selectionType: UserSelectionType;
          phase: ChampionSelectPhase;
          championId: number;
      }
    | {
          type: "CHANGE_ORDER";
          selectionType: UserSelectionType;
          phase: ChampionSelectPhase;
          oldIndex: number;
          newIndex: number;
      }
    | {
          type: "REMOVE";
          selectionType: UserSelectionType;
          phase: ChampionSelectPhase;
          championId: number;
      };

export function selectionReducer(
    selections: UserSelections,
    action: UserSelectionAction
): UserSelections {
    switch (action.type) {
        case "ADD": {
            const { selectionType, phase, championId } = action;
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
        }

        case "REMOVE": {
            const { selectionType, phase, championId } = action;
            return {
                ...selections,
                [selectionType]: {
                    ...selections[selectionType],
                    [phase]: selections[selectionType][phase].filter(
                        (id) => id !== championId
                    ),
                },
            };
        }

        case "CHANGE_ORDER": {
            const { selectionType, phase, oldIndex, newIndex } = action;
            const phaseSelections = selections[selectionType][phase];

            // Insert at it's new Positon
            phaseSelections.splice(newIndex, 0, phaseSelections[oldIndex]);
            // Remove from it's old Position
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
        }
    }
}
