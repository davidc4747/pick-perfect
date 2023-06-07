import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    SelectionPhase,
    SelectionGroup,
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
    currentTab: SelectionGroup;
    onTabChange(tab: SelectionGroup): void;
    onRemoveChampion(phase: SelectionPhase, championId: number): void;
    moveChampion(
        phase: SelectionPhase,
        oldIndex: number,
        newIndex: number
    ): void;
}

export default function ViewUserSelections(
    props: PropTypes
): React.ReactElement {
    const navigate = useNavigate();
    const {
        currentTab,
        selections,
        onTabChange,
        onRemoveChampion,
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
            navigate("/settings");
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
            <NavBar value={currentTab} onChange={onTabChange} />

            <SelectionView
                currentTab={currentTab}
                phase="pick"
                selection={selections}
                onRemoveChampion={onRemoveChampion}
                onMoveChampion={moveChampion}
                viewAllTab={viewAllTab}
            />
            <SelectionView
                currentTab={currentTab}
                phase="ban"
                selection={selections}
                onRemoveChampion={onRemoveChampion}
                onMoveChampion={moveChampion}
                viewAllTab={viewAllTab}
            />
            <SelectionView
                currentTab={currentTab}
                phase="hover"
                selection={selections}
                onRemoveChampion={onRemoveChampion}
                onMoveChampion={moveChampion}
                viewAllTab={viewAllTab}
            />
        </>
    );
}
