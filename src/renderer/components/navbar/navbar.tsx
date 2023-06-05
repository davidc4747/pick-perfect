import {
    navbar,
    navItem,
    navItemSelected,
    settingsBtn,
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
                aria-label={`View all lanes selections`}
            >
                <Icon name="house-solid" />
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
                    aria-label={`View ${item.tag} lane selections`}
                >
                    <img src={item.image} alt={item.displayName} />
                </button>
            ))}

            <button
                data-testid={`btn-settings`}
                className={[navItem, settingsBtn].join(" ")}
                onClick={onSettingsOpened}
                aria-label="Open Settings"
            >
                <Icon name="gear-solid" />
            </button>
        </nav>
    );
}
