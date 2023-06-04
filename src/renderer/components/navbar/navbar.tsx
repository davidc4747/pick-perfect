import styles, {
    navbar,
    navItem,
    navItemSelected,
    rightNav,
} from "./navbar.module.css";
import { UserSelectionType } from "../../../shared/types";
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
    value: UserSelectionType;
    onChange(selectionType: UserSelectionType): void;
    onSettingsOpened(): void;
}

export default function NavBar(props: PropTypes) {
    const { value, onChange, onSettingsOpened } = props;

    return (
        <nav className={navbar}>
            <button
                className={[
                    navItem,
                    "all" === value ? navItemSelected : "",
                ].join(" ")}
                onClick={() => onChange("all")}
            >
                <Icon className={styles.positionIcon} name="house-solid" />
            </button>

            {positionList.map((item) => (
                <button
                    key={item.tag}
                    className={[
                        navItem,
                        item.tag === value ? navItemSelected : "",
                    ].join(" ")}
                    data-testid={`position-${item.tag}`}
                    onClick={() => onChange(item.tag)}
                >
                    <img src={item.image} alt={item.displayName} />
                </button>
            ))}

            <aside className={rightNav}>
                <button
                    data-testid={`btn-settings`}
                    className={navItem}
                    onClick={onSettingsOpened}
                    aria-label="Open Settings"
                >
                    <Icon name="gear-solid" />
                </button>
            </aside>
        </nav>
    );
}
