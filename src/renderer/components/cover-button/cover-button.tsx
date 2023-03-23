import { ReactElement } from "react";
import styles from "./cover-button.module.css";
import Icon, { IconType } from "../icon/icon";

/* ===================== *\
    # Cover Button
\* ===================== */

interface PropTypes {
    text: string;
    icon?: IconType;
    className?: string;
    [key: string]: any;
}

export default function CoverButton(props: PropTypes): ReactElement {
    const { text, icon, className, ...etc } = props;

    return (
        <button
            className={[styles.coverButton, className ?? ""].join(" ")}
            {...etc}
        >
            {icon ? <Icon name={icon} /> : text}
        </button>
    );
}
