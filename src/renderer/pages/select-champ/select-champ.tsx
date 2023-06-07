import { useState, useRef, ChangeEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    cancelButton,
    searchbar,
    searchbarInput,
    searchbarClear,
    champList,
    championItem,
} from "./select-champ.module.css";
import { SelectionGroup, SelectionPhase } from "../../../shared/types";
import { getChampionList } from "../../services/championData";
import { ChampionData } from "../../services/championData";
import { useKeyBinds } from "../../services/useKeyBinds";
import CoverButton from "../../components/cover-button/cover-button";
import ShortcutDialog from "../../components/shortcut-dialog/shortcut-dialog";

/* ===================== *\
    # Select Champ
\* ===================== */

interface PropTypes {
    onSelect(
        role: SelectionGroup | undefined,
        phase: SelectionPhase | undefined,
        id: number
    ): void;
}

type Params = {
    role?: SelectionGroup;
    phase?: SelectionPhase;
};

export default function SelectChamp(props: PropTypes) {
    const navigate = useNavigate();
    const { role, phase } = useParams<Params>();
    const { onSelect } = props;
    const [searchString, setSearchString] = useState<string>("");

    const filterChampionList = getChampionList().filter((champ) =>
        searchString
            ? champ.name.toLowerCase().includes(searchString.toLowerCase())
            : true
    );

    // Keyboard Shortcuts
    const searchRef = useRef<HTMLInputElement>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    useKeyBinds({
        Escape() {
            navigate("/");
        },
        "?"() {
            dialogRef.current?.showModal();
        },
        "/"() {
            searchRef.current?.focus();
        },
    });

    function selectAndRedirect(
        role: SelectionGroup | undefined,
        phase: SelectionPhase | undefined,
        id: number
    ): void {
        onSelect(role, phase, id);
        navigate("/");
    }

    function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        // If they press enter while the Searchbar is Focused
        if (e.key === "Enter" && filterChampionList.length === 1) {
            const [champ] = filterChampionList;
            selectAndRedirect(role, phase, champ.id);
        }
    }

    return (
        <>
            <ShortcutDialog
                ref={dialogRef}
                keybinds={[
                    ["?", "Shortcut Help"],
                    ["/", "Search"],
                    ["Escape", "Cancel Champion Select"],
                ]}
            />
            <Link
                data-testid="btn-cancel"
                className={cancelButton}
                aria-label="Cancel Champion Select"
                to="/"
            >
                Cancel
            </Link>

            <section className={searchbar}>
                <input
                    type="text"
                    placeholder="Search for Champion"
                    ref={searchRef}
                    className={searchbarInput}
                    value={searchString}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSearchString(e.target.value)
                    }
                    onKeyUp={handleEnter}
                    // As long as the use knows before hand that they're being redirect, this should be okay [DC]
                    autoFocus
                />
                <button
                    className={searchbarClear}
                    aria-label="Clear Searchbar"
                    onClick={() => setSearchString("")}
                >
                    X
                </button>
            </section>

            <span>{`${filterChampionList.length} ${
                filterChampionList.length === 1 ? "Champion" : "Champions"
            } Found`}</span>
            <ul className={champList}>
                {filterChampionList.map((champ: ChampionData) => (
                    <li className={championItem} key={champ.id}>
                        <img
                            src={champ.image}
                            title={champ.name}
                            alt={champ.name}
                        />
                        <CoverButton
                            text="+"
                            data-testid={`add-champion-${champ.id}`}
                            title={`Select ${champ.name}`}
                            aria-label={`Select ${champ.name}`}
                            onClick={() =>
                                selectAndRedirect(role, phase, champ.id)
                            }
                        />
                    </li>
                ))}
            </ul>
        </>
    );
}
