import React, { useEffect, useReducer } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import styles from "./app.module.css";
import {
    INITIAL_USER_SELECTION,
    selectionReducer,
} from "../../services/selectionReducer";
import {
    UserSelections,
    SelectionGroup,
    SelectionPhase,
    Settings as SettingData,
} from "../../../shared/types";
import ViewUserSelections from "../../pages/view-user-selections/view-user-selections";
import SelectChamp from "../../pages/select-champ/select-champ";
import Settings from "../../pages/settings/settings";

declare const electron: {
    updateSelections(data: UserSelections): void;
    getSelections(): Promise<UserSelections>;

    updateSettings(data: SettingData): void;
    getSettings(): Promise<SettingData>;
};

/* ===================== *\
    # App
\* ===================== */

interface AppState {
    selections: UserSelections;
    currentTab: SelectionGroup;
}

const initialState: AppState = {
    selections: INITIAL_USER_SELECTION,
    currentTab: "all",
};

type AppAction =
    | {
          type: AppActionType.ChangeTab;
          tab: SelectionGroup;
      }
    | {
          type: AppActionType.InitializeSelection;
          selections: UserSelections;
      }
    | {
          type: AppActionType.SortChampion;
          phase: SelectionPhase;
          oldIndex: number;
          newIndex: number;
      }
    | {
          type: AppActionType.RemoveChampion;
          phase: SelectionPhase;
          championId: number;
      }
    | {
          type: AppActionType.AddChampion;
          group: SelectionGroup | undefined;
          phase: SelectionPhase | undefined;
          championId: number;
      };

enum AppActionType {
    InitializeSelection = "INITIALIZE_SELECTIONS",

    ChangeTab = "ChangeTab",

    AddChampion = "ADD_CHAMPION",
    RemoveChampion = "REMOVE_CHAMPION",
    SortChampion = "SORT_CHAMPION",
}

function reducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case AppActionType.InitializeSelection:
            return {
                ...state,
                selections: action.selections,
            };

        case AppActionType.ChangeTab:
            return {
                ...state,
                currentTab: action.tab ?? state.currentTab,
            };

        case AppActionType.SortChampion:
            return {
                ...state,

                // Update User Selection
                selections: selectionReducer(state.selections, {
                    type: "CHANGE_ORDER",
                    group: state.currentTab,
                    phase: action.phase,
                    oldIndex: action.oldIndex,
                    newIndex: action.newIndex,
                }),
            };

        case AppActionType.RemoveChampion:
            return {
                ...state,

                // Update User Selection
                selections: selectionReducer(state.selections, {
                    type: "REMOVE",
                    group: state.currentTab,
                    phase: action.phase,
                    championId: action.championId,
                }),
            };

        case AppActionType.AddChampion: {
            if (action.group && action.phase) {
                return {
                    ...state,

                    // Update User Selection
                    selections: selectionReducer(state.selections, {
                        type: "ADD",
                        group: action.group,
                        phase: action.phase,
                        championId: action.championId,
                    }),
                };
            } else {
                return { ...state }; // Invalid state, Do nothing
            }
        }
    }
}

export default function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(function () {
        electron.getSelections().then(function (userSelection: UserSelections) {
            dispatch({
                type: AppActionType.InitializeSelection,
                selections: userSelection,
            });
        });
    }, []);
    useEffect(
        function () {
            electron.updateSelections(state.selections);
        },
        [state.selections]
    );

    /* ------------------------- *\
        #Bind Actions
    \* ------------------------- */

    function handleTabChange(tab: SelectionGroup) {
        dispatch({
            type: AppActionType.ChangeTab,
            tab: tab,
        });
    }

    function removeChampion(phase: SelectionPhase, championId: number) {
        dispatch({
            type: AppActionType.RemoveChampion,
            phase: phase,
            championId,
        });
    }

    function moveChampion(
        phase: SelectionPhase,
        oldIndex: number,
        newIndex: number
    ) {
        dispatch({
            type: AppActionType.SortChampion,
            phase: phase,
            oldIndex,
            newIndex,
        });
    }

    function addChampion(
        role: SelectionGroup | undefined,
        phase: SelectionPhase | undefined,
        id: number
    ): void {
        dispatch({
            type: AppActionType.AddChampion,
            group: role,
            phase,
            championId: id,
        });
    }

    /* ------------------------- *\
        #Render
    \* ------------------------- */

    return (
        <section className={styles.app}>
            <HashRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ViewUserSelections
                                currentTab={state.currentTab}
                                selections={state.selections}
                                onTabChange={handleTabChange}
                                onRemoveChampion={removeChampion}
                                moveChampion={moveChampion}
                            />
                        }
                    />

                    <Route
                        path="/select/:role/:phase"
                        element={<SelectChamp onSelect={addChampion} />}
                    />

                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </HashRouter>
        </section>
    );
}
