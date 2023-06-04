// import { viewUserSelections } from "./view-user-selections.module.css";
import {
    ChampionSelectPhase,
    UserSelectionType,
    UserSelections,
} from "../../../shared/types";
import NavBar from "../navbar/navbar";
import SelectionView from "../selection-view/selection-view";

/* ===================== *\
    # View User Selections
\* ===================== */

interface PropTypes {
    selections: UserSelections;
    currentTab: UserSelectionType;
    onTabChange(tab: UserSelectionType): void;
    onSettingsOpened(): void;
    onRemoveChampion(phase: ChampionSelectPhase, championId: number): void;
    startChampionSelection(phase: ChampionSelectPhase): void;
    moveChampion(
        phase: ChampionSelectPhase,
        oldIndex: number,
        newIndex: number
    ): void;
}

export default function ViewUserSelections(
    props: PropTypes
): React.ReactElement {
    const {
        currentTab,
        selections,
        onTabChange,
        onSettingsOpened,
        onRemoveChampion,
        startChampionSelection,
        moveChampion,
    } = props;
    const viewAllTab = () => onTabChange("all");

    return (
        <>
            <NavBar
                value={currentTab}
                onChange={onTabChange}
                onSettingsOpened={onSettingsOpened}
            />

            <SelectionView
                currentTab={currentTab}
                phase="pick"
                selection={selections}
                onAddChampion={startChampionSelection}
                onMoveChampion={moveChampion}
                onRemoveChampion={onRemoveChampion}
                viewAllTab={viewAllTab}
            />
            <SelectionView
                currentTab={currentTab}
                phase="ban"
                selection={selections}
                onAddChampion={startChampionSelection}
                onMoveChampion={moveChampion}
                onRemoveChampion={onRemoveChampion}
                viewAllTab={viewAllTab}
            />
            <SelectionView
                currentTab={currentTab}
                phase="hover"
                selection={selections}
                onAddChampion={startChampionSelection}
                onMoveChampion={moveChampion}
                onRemoveChampion={onRemoveChampion}
                viewAllTab={viewAllTab}
            />
        </>
    );
}
