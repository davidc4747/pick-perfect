import { Link } from "react-router-dom";
import { settings, header, buttonGroup } from "./settings.module.css";

/* ===================== *\
    # Settings
\* ===================== */

interface PropTypes {
    onSave(): void;
}

type Settings = {
    accecptReadyCheck: boolean;
    requeue: boolean;
    setSmite: "false" | "D" | "F";
};

export default function Settings(props: PropTypes): React.ReactElement {
    const { onSave } = props;

    return (
        <section className={settings}>
            <h1 className={header}>Settings</h1>
            <label>
                <span>Auto Import Smite (when Jungling) </span>
                <select id="smite" className="select" value="D">
                    <option value="false">No Key</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                </select>
            </label>

            <label>
                <span>Accept Ready Check</span>
                <input className="chk" type="checkbox" checked />
            </label>

            <label>
                <span>ReQueue after Honor</span>
                <input className="chk" type="checkbox" checked />
            </label>

            <div className={buttonGroup}>
                <Link className="btn" to="/">
                    Cancel
                </Link>

                <button
                    className={["btn", "btn--primary"].join(" ")}
                    onClick={onSave}
                >
                    Save
                </button>
            </div>
        </section>
    );
}
