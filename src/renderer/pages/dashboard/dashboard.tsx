import styles from "./dashboard.module.css";
import { ChampionSelectPhase } from "../../services/types";
import { RoleSelections } from "../../../shared/types";
import SelectionView from "../../components/selection-view/selection-view";

/* ===================== *\
    # Dashboard
\* ===================== */

interface PropTypes {
    roleSelection: RoleSelections;
    onAddChampion: (data: ChampionSelectPhase) => void;
}

export default function Dashboard(props: PropTypes) {
    const { roleSelection, onAddChampion } = props;

    return (
        <section className={styles.dashboard}>
            <SelectionView
                type="ban"
                roleSelection={roleSelection}
                onAdd={onAddChampion}
            />
            <SelectionView
                type="hover"
                roleSelection={roleSelection}
                onAdd={onAddChampion}
            />
            <SelectionView
                type="pick"
                roleSelection={roleSelection}
                onAdd={onAddChampion}
            />
        </section>
    );
}
