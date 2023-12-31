import { Link } from "react-router-dom";
import styles, { selectionItem } from "./selection-view.module.css";
import { getChampionMap } from "../../services/championData";
import {
    UserSelections,
    SelectionGroup,
    SelectionPhase,
} from "../../../shared/types";
import Droppable from "../dragdrop/droppable";
import DragNDrop from "../dragdrop/dragndrop";

/* ===================== *\
    # Champ List
\* ===================== */

interface PropTypes {
    currentTab: SelectionGroup;
    phase: SelectionPhase;
    selection: UserSelections;
    onRemoveChampion(phase: SelectionPhase, championId: number): void;
    onMoveChampion(
        phase: SelectionPhase,
        oldIndex: number,
        newIndex: number
    ): void;
    viewAllTab(): void;
}

export default function SelectionView(props: PropTypes) {
    const {
        currentTab,
        phase,
        selection,
        onRemoveChampion,
        onMoveChampion,
        viewAllTab,
    } = props;
    const phaseSelection = selection[currentTab][phase];
    const defaultSelection = selection["all"][phase];
    const champData = getChampionMap();

    function handleKeybind(
        e: React.KeyboardEvent<HTMLElement>,
        championId: number
    ) {
        switch (e.key) {
            case "Backspace":
            case "Delete":
                onRemoveChampion(phase, championId);
                document.activeElement;
                break;
            case "ArrowLeft": {
                const index = phaseSelection.indexOf(championId);
                onMoveChampion(
                    phase,
                    index,
                    index - 1 < 0 ? phaseSelection.length : index - 1
                );
                break;
            }
            case "ArrowRight": {
                const index = phaseSelection.indexOf(championId);
                onMoveChampion(
                    phase,
                    index,
                    (index + 1) % phaseSelection.length
                );
                break;
            }

            default:
                break;
        }
    }

    return (
        <>
            <h3 className={styles.header}>{getTitle(phase)}</h3>

            {/* Champions */}
            <section
                data-testid={`selections-${phase}`}
                className={styles.selectionList}
                role="application"
            >
                {phaseSelection?.map((id, index) => (
                    <DragNDrop
                        key={id}
                        data={{ index, championId: id, phase }}
                        dragStartClass={styles.selectionItemDragging}
                        dragOverClass={styles.selectionItemDragOver}
                        onDrop={(data) =>
                            onMoveChampion(phase, data.index, index)
                        }
                    >
                        <button
                            data-testid={`champion-${id}`}
                            className={selectionItem}
                            onContextMenu={() => onRemoveChampion(phase, id)}
                            onKeyUp={(e) => handleKeybind(e, id)}
                        >
                            <img
                                title={champData.get(id)?.name}
                                alt={champData.get(id)?.name}
                                src={champData.get(id)?.image}
                            ></img>
                        </button>
                    </DragNDrop>
                ))}

                {/* Default Selections */}
                {currentTab !== "all" && defaultSelection.length > 0 && (
                    <button
                        data-testid={`champion-defaults`}
                        className={styles.default}
                        title={`All Roles`}
                        onClick={viewAllTab}
                    >
                        {defaultSelection?.slice(0, 4).map((id) => (
                            <img
                                key={id}
                                alt={champData.get(id)?.name}
                                src={champData.get(id)?.image}
                            ></img>
                        ))}
                    </button>
                )}

                {/* Add Champion Button */}
                <Droppable
                    dragOverClass={styles.selectionItemDragOver}
                    onDrop={(data) =>
                        onMoveChampion(
                            phase,
                            data.index,
                            phaseSelection.length + 1 - 1
                        )
                    }
                >
                    <Link
                        className={styles.addButton}
                        to={`/select/${currentTab}/${phase}`}
                        aria-label={`Add Champion to your ${getTitle(phase)}`}
                    >
                        Add Champion
                    </Link>
                </Droppable>
            </section>
        </>
    );
}

/* ------------------------- *\
    #Helpers
\* ------------------------- */

function getTitle(type: SelectionPhase): string {
    switch (type) {
        case "hover":
            return "Hover";
        case "ban":
            return "Bans";
        case "pick":
            return "Picks";
    }
}
