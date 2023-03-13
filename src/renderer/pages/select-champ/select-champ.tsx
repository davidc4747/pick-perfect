import React, { useState } from "react";
import styles from "./select-champ.module.css";
import { getChampionList } from "../../services/championData";
import { ChampionData } from "../../services/championData";
import CoverButton from "../../components/cover-button/cover-button";

/* ===================== *\
    # Select Champ
\* ===================== */

interface PropTypes {
    onChampionSelected: (id: number) => void;
    onCancel: () => void;
}

export default function SelectChamp(props: PropTypes) {
    const { onChampionSelected, onCancel } = props;
    const [searchString, setSearchString] = useState<string>("");
    const fullChampionList = getChampionList();

    function handleSelectChampion(champ: ChampionData) {
        onChampionSelected(champ.id);
    }

    return (
        <>
            <button
                data-testid="btn-cancel"
                className={styles.cancelButton}
                onClick={onCancel}
            >
                Cancel
            </button>

            <section className={styles.searchbar}>
                <input
                    type="text"
                    placeholder="Search"
                    className={styles.searchbarInput}
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                />
                <button
                    className={styles.searchbarClear}
                    onClick={() => setSearchString("")}
                >
                    X
                </button>
            </section>

            <ul className={styles.champList}>
                {fullChampionList
                    .filter((champ) =>
                        searchString
                            ? champ.name
                                  .toLowerCase()
                                  .search(searchString.toLowerCase()) !== -1
                            : true
                    )
                    .map((champ) => (
                        <li className={styles.championItem} key={champ.id}>
                            <img
                                src={champ.image}
                                title={champ.name}
                                alt={champ.name}
                            />
                            <CoverButton
                                text="+"
                                data-testid={`add-champion-${champ.id}`}
                                title={`Select ${champ.name}`}
                                onClick={() => handleSelectChampion(champ)}
                            />
                        </li>
                    ))}
            </ul>
        </>
    );
}
