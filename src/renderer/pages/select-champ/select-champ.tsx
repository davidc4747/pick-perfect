import { useState, useRef, ChangeEvent } from "react";
import {
    cancelButton,
    searchbar,
    searchbarInput,
    searchbarClear,
    champList,
    championItem,
} from "./select-champ.module.css";
import { getChampionList } from "../../services/championData";
import { ChampionData } from "../../services/championData";
import { useKeyBinds } from "../../services/useKeyBinds";
import CoverButton from "../../components/cover-button/cover-button";
import ShortcutDialog from "../../components/shortcut-dialog/shortcut-dialog";

/* ===================== *\
    # Select Champ
\* ===================== */

interface PropTypes {
    onChampionSelected(id: number): void;
    onCancel(): void;
}

export default function SelectChamp(props: PropTypes) {
    const { onChampionSelected, onCancel } = props;
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
            onCancel();
        },
        "?"() {
            dialogRef.current?.showModal();
        },
        "/"() {
            searchRef.current?.focus();
        },
    });

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
            <button
                data-testid="btn-cancel"
                className={cancelButton}
                onClick={onCancel}
                aria-label="Cancel Champion Select"
            >
                Cancel
            </button>

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
                            onClick={() => onChampionSelected(champ.id)}
                        />
                    </li>
                ))}
            </ul>
        </>
    );
}
