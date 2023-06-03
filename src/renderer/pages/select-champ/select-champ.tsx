import { useState, useRef, ChangeEvent, useEffect } from "react";
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
import { useKeyPress } from "../../services/useKeyPress";
import CoverButton from "../../components/cover-button/cover-button";

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
    useKeyPress(function (e: KeyboardEvent) {
        switch (e.key) {
            case "Escape":
                onCancel();
                break;
            case "?":
                dialogRef.current?.showModal();
                e.preventDefault();
                break;
            case "/":
                searchRef.current?.focus();
                e.preventDefault();
                break;
        }
    });

    return (
        <>
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

            <dialog ref={dialogRef}>
                <h3>Keyboard Shortcuts</h3>
                <ul>
                    <li>Close page - Escape</li>
                    <li>Shortcut help - ?</li>
                    <li>Search - /</li>
                </ul>
            </dialog>
        </>
    );
}
