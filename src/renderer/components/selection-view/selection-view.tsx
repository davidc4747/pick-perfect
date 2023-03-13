import React from "react";
import styles from "./selection-view.module.css";
import { getChampionMap } from "../../services/championData";
import { ChampionSelectPhase } from "../../services/types";
import { UserSelections, UserSelectionType } from "../../services/userdata";
import CoverButton from "../cover-button/cover-button";
import Droppable from "../dragdrop/droppable";
import DragNDrop from "../dragdrop/dragndrop";

/* ===================== *\
    # Champ List
\* ===================== */

interface PropTypes {
    currentTab: UserSelectionType;
    phase: ChampionSelectPhase;
    selection: UserSelections;
    onAddChampion: (type: ChampionSelectPhase) => void;
    onRemoveChampion: (championId: number, phase: ChampionSelectPhase) => void;
    onMoveChampion: (oldIndex: number, newIndex: number) => void;
    onDefaultClicked: () => void;
}

export default function SelectionView(props: PropTypes) {
    const {
        currentTab,
        phase,
        selection,
        onAddChampion,
        onRemoveChampion,
        onMoveChampion,
        onDefaultClicked,
    } = props;
    const phaseSelection = selection[currentTab][phase];
    const defaultSelection = selection["default"][phase];
    const champData = getChampionMap();

    return (
        <>
            <h3 className={styles.header}>{getTitle(phase)}</h3>
            <ul
                data-testid={`selections-${phase}`}
                className={styles.selectionList}
            >
                {phaseSelection?.map((id, index) => (
                    <DragNDrop
                        key={id}
                        data={{ index, championId: id, phase }}
                        dragStartClass={styles.selectionItemDragStart}
                        dragOverClass={styles.selectionItemDragOver}
                        onDrop={(data) => onMoveChampion(data.index, index)}
                    >
                        <li
                            data-testid={`champion-${id}`}
                            className={styles.selectionItem}
                            onContextMenu={() => onRemoveChampion(id, phase)}
                        >
                            <img
                                title={champData.get(id)?.name}
                                alt={champData.get(id)?.name}
                                src={champData.get(id)?.image}
                            ></img>
                        </li>
                    </DragNDrop>
                ))}

                {/* Default Selections */}
                {currentTab !== "default" && defaultSelection.length > 0 && (
                    <li
                        data-testid={`champion-defaults`}
                        className={styles.default}
                        title={`All Roles`}
                    >
                        {defaultSelection?.slice(0, 4).map((id) => (
                            <img
                                key={id}
                                alt={champData.get(id)?.name}
                                src={champData.get(id)?.image}
                            ></img>
                        ))}
                        <CoverButton
                            text="Show Your Defaults"
                            onClick={onDefaultClicked}
                        />
                    </li>
                )}
                <Droppable
                    dragOverClass={styles.selectionItemDragOver}
                    onDrop={(data) =>
                        onMoveChampion(
                            data.index,
                            phaseSelection.length + 1 - 1
                        )
                    }
                >
                    <li className={styles.selectionItem}>
                        <button
                            className={styles.addButton}
                            onClick={() => onAddChampion(phase)}
                        >
                            Add Champion
                        </button>
                    </li>
                </Droppable>
            </ul>
        </>
    );
}

/* ------------------------- *\
    #Helpers
\* ------------------------- */

function getTitle(type: ChampionSelectPhase): string {
    switch (type) {
        case "hover":
            return "Hover";
        case "ban":
            return "Bans";
        case "pick":
            return "Picks";
    }
}
