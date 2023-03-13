import React, { useReducer } from "react";
import styles from "./app.module.css";
import { Page, ChampionSelectPhase } from "../../services/types";
import {
    UserSelectionType,
    UserSelections,
    DEFAULT_USER_CONFIG,
    userSelectionsReducer,
} from "../../services/userdata";
// import Dashboard from "../../pages/dashboard/dashboard";
import PositionSelector from "../position-selector/position-selector";
import SelectionView from "../selection-view/selection-view";
import SelectChamp from "../../pages/select-champ/select-champ";

/* ===================== *\
    # App
\* ===================== */

interface AppState {
    currentPage: Page;

    selections: UserSelections;
    curentUserSelection: UserSelectionType;
    selectedPhase: ChampionSelectPhase | null;
}

const initialState: AppState = {
    currentPage: Page.ViewUserSelections,

    selections: DEFAULT_USER_CONFIG,
    curentUserSelection: "default",
    selectedPhase: null,
};

interface AppAction {
    type: AppActionType;
    changePage?: Page;

    changeUserSelectionType?: UserSelectionType;
    selectedPhase?: ChampionSelectPhase;
    championId?: number;
    oldIndex?: number;
    newIndex?: number;
}

enum AppActionType {
    ChangePage = "CHANGE_PAGE",
    ChangeUserSelectionType = "CHANGE_USER_SELECTION_TYPE",

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
                currentPage: action.changePage ?? state.currentPage,
            };
        case AppActionType.ChangeUserSelectionType:
            return {
                ...state,
                curentUserSelection:
                    action.changeUserSelectionType ?? state.curentUserSelection,
            };

        case AppActionType.SortChampion:
            if (
                action.selectedPhase &&
                // NOTE: I specifically check for undefined here cuz 'oldIndex' could be 0 [DC]
                action.oldIndex !== undefined &&
                action.newIndex !== undefined
            ) {
                return {
                    ...state,

                    // Update User Selection
                    selections: userSelectionsReducer(state.selections, {
                        type: "change_order",
                        selectionType: state.curentUserSelection,
                        phase: action.selectedPhase,
                        oldIndex: action.oldIndex,
                        newIndex: action.newIndex,
                    }),
                };
            } else {
                return state; // invalid action, don't do anything.
            }

        case AppActionType.RemoveChampion:
            if (action.selectedPhase && action.championId) {
                return {
                    ...state,

                    // Update User Selection
                    selections: userSelectionsReducer(state.selections, {
                        type: "remove",
                        selectionType: state.curentUserSelection,
                        phase: action.selectedPhase,
                        championId: action.championId,
                    }),
                };
            } else {
                return state; // invalid action, don't do anything.
            }

        case AppActionType.StartChampionSelect:
            if (action.selectedPhase) {
                return {
                    ...state,
                    // Switch the Page
                    currentPage: Page.SelectChampion,

                    // Setup the selectedPhase
                    selectedPhase: action.selectedPhase,
                };
            } else {
                return state; // invalid action, don't do anything.
            }

        case AppActionType.ChampionSelected:
            if (state.selectedPhase && action.championId) {
                return {
                    ...state,

                    // Go Back to View Page. Reset the selectedPhase
                    currentPage: Page.ViewUserSelections,
                    selectedPhase: null,

                    // Update User Selection
                    selections: userSelectionsReducer(state.selections, {
                        type: "add",
                        selectionType: state.curentUserSelection,
                        phase: state.selectedPhase,
                        championId: action.championId,
                    }),
                };
            } else {
                return state; // invalid action, don't do anything.
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
                                    changeUserSelectionType: "default",
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
