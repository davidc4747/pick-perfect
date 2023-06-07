import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { settings, header, buttonGroup } from "./settings.module.css";
import { Settings as SettingData } from "../../../shared/types";

declare const electron: {
    updateSettings(data: SettingData): void;
    getSettings(): Promise<SettingData>;
};

/* ===================== *\
    # Settings
\* ===================== */

export default function Settings(): React.ReactElement {
    const [accecptReadyCheck, setAcceptRC] = useState(true);
    const [requeue, setRequeue] = useState(true);
    const [smiteKey, setSmiteKey] = useState<SettingData["smiteKey"]>("D");

    function handleSave(): void {
        electron.updateSettings({ accecptReadyCheck, requeue, smiteKey });
    }

    useEffect(function () {
        electron.getSettings().then(function (settings: SettingData) {
            setAcceptRC(settings.accecptReadyCheck);
            setRequeue(settings.requeue);
            setSmiteKey(settings.smiteKey);
        });
    }, []);

    return (
        <section className={settings}>
            <h1 className={header}>Settings</h1>
            <label>
                <span>Auto Import Smite (when Jungling) </span>
                <select
                    id="smite"
                    className="select"
                    value={smiteKey}
                    onChange={(e) =>
                        setSmiteKey(e.target.value as SettingData["smiteKey"])
                    }
                >
                    <option value="none">No Key</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                </select>
            </label>

            <label>
                <span>Accept Ready Check</span>
                <input
                    className="chk"
                    type="checkbox"
                    checked={accecptReadyCheck}
                    onChange={(e) => setAcceptRC(e.target.checked)}
                />
            </label>

            <label>
                <span>ReQueue after Honor</span>
                <input
                    className="chk"
                    type="checkbox"
                    checked={requeue}
                    onChange={(e) => setRequeue(e.target.checked)}
                />
            </label>

            <div className={buttonGroup}>
                <Link className="btn" to="/">
                    Cancel
                </Link>

                <Link
                    className={["btn", "btn--primary"].join(" ")}
                    onClick={handleSave}
                    to="/"
                >
                    Save
                </Link>
            </div>
        </section>
    );
}
