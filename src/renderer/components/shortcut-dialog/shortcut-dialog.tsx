import { forwardRef } from "react";
import {
    shortcutDialog,
    header,
    list,
    keyItem,
    keybind,
} from "./shortcut-dialog.module.css";

/* ===================== *\
    # Shortcut Dialog
\* ===================== */

interface PropTypes {
    keybinds: [key: string, description: string][];
}

export default forwardRef(function ShortcutDialog(
    props: PropTypes,
    dialogRef: React.RefObject<HTMLDialogElement>
): React.ReactElement {
    const { keybinds } = props;

    function handleClose() {
        dialogRef.current?.close();
    }

    return (
        <dialog ref={dialogRef} className={shortcutDialog}>
            <h2 className={header}>
                Keyboard Shortcuts{" "}
                <button aria-label="Close Modal" onClick={handleClose}>
                    X
                </button>
            </h2>
            <ul className={list}>
                {keybinds.map(([key, description]) => (
                    <li key={key} className={keyItem}>
                        <div>{description}</div>
                        <div className={keybind}>{key}</div>
                    </li>
                ))}
            </ul>
        </dialog>
    );
});
