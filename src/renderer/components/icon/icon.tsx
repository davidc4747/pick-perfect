import React from "react";

/* ===================== *\
    # Icon
\* ===================== */

export type IconType =
    | "plus-solid"
    | "house-solid"
    | "gear-solid"
    | "bars-solid"
    | "trash-solid";

interface PropTypes {
    name: IconType;
    [key: string]: any;
}

export default function Icon(props: PropTypes): React.ReactElement {
    const { name, ...otherProps } = props;

    switch (name) {
        case "plus-solid":
            return (
                <svg {...otherProps} viewBox="0 0 448 512">
                    <use xlinkHref="./icons/plus-solid.svg#plus"></use>
                </svg>
            );
        case "house-solid":
            return (
                <svg {...otherProps} viewBox="0 0 576 512">
                    <use xlinkHref="./icons/house-solid.svg#home"></use>
                </svg>
            );
        case "gear-solid":
            return (
                <svg {...otherProps} viewBox="0 0 512 512">
                    <use xlinkHref="./icons/gear-solid.svg#gear"></use>
                </svg>
            );
        case "trash-solid":
            return (
                <svg {...otherProps} viewBox="0 0 448 512">
                    <use xlinkHref="./icons/trash-can-solid.svg#trash"></use>
                </svg>
            );
        case "bars-solid":
            return (
                <svg {...otherProps} viewBox="0 0 448 512">
                    <use xlinkHref="./icons/bars-solid.svg#bars"></use>
                </svg>
            );
    }
}
