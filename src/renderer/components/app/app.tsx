import React, { useEffect, useReducer } from "react";
import styles from "./app.module.css";
import {
    INITIAL_USER_SELECTION,
    selectionReducer,
} from "../../services/selectionReducer";
import {
    UserSelections,
    UserSelectionType,
    ChampionSelectPhase,
} from "../../../shared/types";
// import Dashboard from "../../pages/dashboard/dashboard";
import PositionSelector from "../position-selector/position-selector";
import SelectionView from "../selection-view/selection-view";
import SelectChamp from "../../pages/select-champ/select-champ";

declare const electron: {
    updateSelections: (data: UserSelections) => void;
    getSelections: () => Promise<UserSelections>;
};

/* ===================== *\
    # App
\* ===================== */

enum Page {
    ViewUserSelections,
    SelectChampion,
    Settings,
}

interface AppState {
    currentPage: Page;

    selections: UserSelections;
    curentUserSelection: UserSelectionType;
    selectedPhase: ChampionSelectPhase | null;
}

const initialState: AppState = {
    currentPage: Page.ViewUserSelections,

    selections: INITIAL_USER_SELECTION,
    curentUserSelection: "all",
    selectedPhase: null,
};

type AppAction =
    | { type: AppActionType.ChangePage; page: Page }
    | {
          type: AppActionType.ChangeUserSelectionType;
          changeUserSelectionType: UserSelectionType;
}
    | {
          type: AppActionType.InitializeSelection;
          selections: UserSelections;
      }
    | {
          type: AppActionType.SortChampion;
          phase: ChampionSelectPhase;
          oldIndex: number;
          newIndex: number;
      }
    | {
          type: AppActionType.RemoveChampion;
          phase: ChampionSelectPhase;
          championId: number;
      }
    | {
          type: AppActionType.StartChampionSelect;
          phase: ChampionSelectPhase;
      }
    | { type: AppActionType.ChampionSelected; championId: number }
    | { type: AppActionType.CancelChampionSelect };

enum AppActionType {
    ChangePage = "CHANGE_PAGE",
    ChangeUserSelectionType = "CHANGE_USER_SELECTION_TYPE",

    InitializeSelection = "INITIALIZE_SELECTIONS",
    StartChampionSelect = "START_CHAMPION_SELECT",
    ChampionSelected = "CHAMPION_SELECTED",
    CancelChampionSelect = "CANCEL_CHAMPION_SELECT",
    RemoveChampion = "REMOVE_CHAMPION",
    SortChampion = "SORT_CHAMPION",
}

function reducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case AppActionType.ChangePage:
            return {
                ...state,
                currentPage: action.page ?? state.currentPage,
            };
        case AppActionType.ChangeUserSelectionType:
            return {
                ...state,
                curentUserSelection:
                    action.changeUserSelectionType ?? state.curentUserSelection,
            };

        case AppActionType.InitializeSelection:
                return {
                    ...state,
                    selections: action.selections,
                };

        case AppActionType.SortChampion:
                return {
                    ...state,

                    // Update User Selection
                    selections: selectionReducer(state.selections, {
                    type: "CHANGE_ORDER",
                        selectionType: state.curentUserSelection,
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
                        selectionType: state.curentUserSelection,
                    phase: action.phase,
                        championId: action.championId,
                    }),
                };

        case AppActionType.StartChampionSelect:
                return {
                    ...state,
                    // Switch the Page
                    currentPage: Page.SelectChampion,

                    // Setup the selectedPhase
                selectedPhase: action.phase,
                };

        case AppActionType.ChampionSelected:
            if (state.selectedPhase) {
                return {
                    ...state,

                    // Go Back to View Page. Reset the selectedPhase
                    currentPage: Page.ViewUserSelections,
                    selectedPhase: null,

                    // Update User Selection
                    selections: selectionReducer(state.selections, {
                        type: "ADD",
                        selectionType: state.curentUserSelection,
                        phase: state.selectedPhase,
                        championId: action.championId,
                    }),
                };
            } else {
                return { ...state }; // Invalid state, Do nothing
            }

        case AppActionType.CancelChampionSelect:
            return {
                ...state,
                currentPage: Page.ViewUserSelections,
                selectedPhase: null,
            };
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

    function handleChampionSelected(championId: number) {
        dispatch({ type: AppActionType.ChampionSelected, championId });
    }

    function cancelChampionSelect() {
        dispatch({ type: AppActionType.CancelChampionSelect });
    }

    function renderSelectedPage() {
        switch (state.currentPage) {
            case Page.ViewUserSelections:
                return (
                    <>
                        <PositionSelector
                            position={state.curentUserSelection}
                            onChange={(selectionType: UserSelectionType) =>
                                dispatch({
                                    type: AppActionType.ChangeUserSelectionType,
                                    changeUserSelectionType: selectionType,
                                })
                            }
                            onSettingsOpened={() =>
                                dispatch({
                                    type: AppActionType.ChangePage,
                                    changePage: Page.Settings,
                                })
                            }
                            onRemoveChampion={(championId, phase) =>
                                dispatch({
                                    type: AppActionType.RemoveChampion,
                                    selectedPhase: phase,
                                    championId,
                                })
                            }
                        />

                        <SelectionView
                            currentTab={state.curentUserSelection}
                            phase="pick"
                            selection={state.selections}
                            onAddChampion={(selectedPhase) => {
                                dispatch({
                                    type: AppActionType.StartChampionSelect,
                                    selectedPhase,
                                });
                            }}
                            onMoveChampion={(oldIndex, newIndex) =>
                                dispatch({
                                    type: AppActionType.SortChampion,
                                    selectedPhase: "pick",
                                    oldIndex,
                                    newIndex,
                                })
                            }
                            onRemoveChampion={(championId, phase) =>
                                dispatch({
                                    type: AppActionType.RemoveChampion,
                                    selectedPhase: phase,
                                    championId,
                                })
                            }
                            onDefaultClicked={() =>
                                dispatch({
                                    type: AppActionType.ChangeUserSelectionType,
                                    changeUserSelectionType: "all",
                                })
                            }
                        />
                        {/* <SelectionView
                            currentTab={state.curentUserSelection}
                            phase="ban"
                            selection={state.selections}
                            onAdd={startChampionRequest}
                        /> */}
                        {/* <SelectionView
                            currentTab={state.curentUserSelection}
                            phase="hover"
                            selection={state.selections}
                            onAdd={startChampionRequest}
                        />
                        <SelectionView
                            currentTab={state.curentUserSelection}
                            phase="pick"
                            selection={state.selections}
                            onAdd={startChampionRequest}
                        /> */}
                    </>
                );

            case Page.SelectChampion:
                return (
                    <SelectChamp
                        onChampionSelected={handleChampionSelected}
                        onCancel={cancelChampionSelect}
                    />
                );

            case Page.Settings:
                return (
                    <section>
                        <button
                            onClick={() =>
                                dispatch({
                                    type: AppActionType.ChangePage,
                                    changePage: Page.ViewUserSelections,
                                })
                            }
                        >
                            Home
                        </button>
                        <h1>Settings Page!</h1>
                    </section>
                );
        }
    }

    return <section className={styles.app}>{renderSelectedPage()}</section>;
}
