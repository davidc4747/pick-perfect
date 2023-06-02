import styles from "./position-selector.module.css";
import { ChampionSelectPhase, UserSelectionType } from "../../../shared/types";
import Droppable from "../dragdrop/droppable";
import Icon from "../icon/icon";

/* ===================== *\
    # Position Selector
\* ===================== */

interface PositionItem {
    displayName: string;
    tag: UserSelectionType;
    image: string;
}

const positionList: PositionItem[] = [
    {
        displayName: "Top",
        tag: "top",
        image: "./position/top.png",
    },
    {
        displayName: "Jungle",
        tag: "jungle",
        image: "./position/jungle.png",
    },
    {
        displayName: "Middle",
        tag: "middle",
        image: "./position/middle.png",
    },
    {
        displayName: "Utility",
        tag: "utility",
        image: "./position/utility.png",
    },
    {
        displayName: "Bottom",
        tag: "bottom",
        image: "./position/bottom.png",
    },
];

interface PropTypes {
    position: UserSelectionType;
    onChange(selectionType: UserSelectionType): void;
    onSettingsOpened(): void;
    onRemoveChampion(phase: ChampionSelectPhase, championId: number): void;
}

export default function PositionSelector(props: PropTypes) {
    const { position, onChange, onSettingsOpened, onRemoveChampion } = props;

    return (
        <section className={styles.positionSelector}>
            <label
                className={styles.position}
                htmlFor="default"
                data-testid={`position-default`}
            >
                <input
                    id="default"
                    className={styles.positionRadio}
                    type="radio"
                    name="position-rdo"
                    value={"default"}
                    checked={"all" === position}
                    onChange={() => onChange("all")}
                />
                <Icon className={styles.positionIcon} name="house-solid" />
            </label>

            {positionList.map((item) => (
                <label
                    key={item.tag}
                    className={styles.position}
                    htmlFor={item.tag}
                    data-testid={`position-${item.tag}`}
                >
                    <input
                        id={item.tag}
                        className={styles.positionRadio}
                        type="radio"
                        name="position-rdo"
                        value={item.tag}
                        checked={item.tag === position}
                        onChange={() => onChange(item.tag)}
                    />
                    <img
                        className={styles.positionIcon}
                        src={item.image}
                        alt={item.displayName}
                    />
                </label>
            ))}

            <aside className={styles.rightNav}>
                <Droppable
                    dropEffect="move"
                    dragOverClass={styles.trashOver}
                    onDrop={(data) =>
                        onRemoveChampion(data.phase, data.championId)
                    }
                >
                    <div>
                        <Icon
                            data-testid={`trashzone`}
                            className={[styles.navicon, styles.trash].join(" ")}
                            name="trash-solid"
                        />
                    </div>
                </Droppable>

                <button
                    data-testid={`btn-settings`}
                    className={styles.settingsBtn}
                    onClick={onSettingsOpened}
                    aria-label="Open Settings"
                >
                    <Icon className={styles.navicon} name="gear-solid" />
                </button>
            </aside>
        </section>
    );
}
