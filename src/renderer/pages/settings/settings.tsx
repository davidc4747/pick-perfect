import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { settings, header, buttonGroup } from "./settings.module.css";
import { Settings as SettingData } from "../../../shared/types";
import { useKeyBinds } from "../../services/useKeyBinds";

declare const electron: {
    updateSettings(data: SettingData): void;
    getSettings(): Promise<SettingData>;
};

/* ===================== *\
    # Settings
\* ===================== */

export default function Settings(): React.ReactElement {
    const navigate = useNavigate();
    const [accecptReadyCheck, setAcceptRC] = useState(true);
    const [requeue, setRequeue] = useState(true);
    const [smiteKey, setSmiteKey] = useState<SettingData["smiteKey"]>("D");

    useKeyBinds({
        Escape() {
            navigate("/");
        },
        Enter(e) {
            // Ctrl + Enter will Submit the Changes
            if (e.ctrlKey) {
                handleSave();
                navigate("/");
            }
        },
    });

    function handleSave(): void {
        electron.updateSettings({
            shouldAcceptReadyCheck: accecptReadyCheck,
            shouldRequeue: requeue,
            smiteKey,
        });
    }

    useEffect(function () {
        electron.getSettings().then(function (settings: SettingData) {
            setAcceptRC(settings.shouldAcceptReadyCheck);
            setRequeue(settings.shouldRequeue);
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
