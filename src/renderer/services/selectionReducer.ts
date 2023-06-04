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
            const { selectionType, phase } = action;
            const phaseSelections = selections[selectionType][phase];

            const oldIndex = Math.max(
                Math.min(action.oldIndex, phaseSelections.length - 1),
                0
            );
            const newIndex = Math.max(
                Math.min(action.newIndex, phaseSelections.length - 1),
                0
            );

            // Swap values
            const temp = phaseSelections[newIndex];
            phaseSelections[newIndex] = phaseSelections[oldIndex];
            phaseSelections[oldIndex] = temp;

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
