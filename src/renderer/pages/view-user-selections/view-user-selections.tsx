import { useRef } from "react";
import {
    ChampionSelectPhase,
    UserSelectionType,
    UserSelections,
} from "../../../shared/types";
import { useKeyBinds } from "../../services/useKeyBinds";
import NavBar from "../../components/navbar/navbar";
import SelectionView from "../../components/selection-view/selection-view";
import ShortcutDialog from "../../components/shortcut-dialog/shortcut-dialog";

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

    // Keyboard Shortcuts
    const dialogRef = useRef<HTMLDialogElement>(null);
    useKeyBinds({
        "?"() {
            dialogRef.current?.showModal();
        },
        s() {
            onSettingsOpened();
        },
        F1: () => onTabChange("all"),
        F2: () => onTabChange("top"),
        F3: () => onTabChange("jungle"),
        F4: () => onTabChange("middle"),
        F5: () => onTabChange("utility"),
        F6: () => onTabChange("bottom"),
    });

    return (
        <>
            <ShortcutDialog
                ref={dialogRef}
                keybinds={[
                    ["?", "Shortcut Help"],
                    ["s", "Open Settings"],
                    ["F1 → F6", "Change Tab"],
                    ["Backspace/Delete", "Delete Champion"],
                    ["Left/Right Arrow Keys", "Reorder Champions"],
                ]}
            />
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