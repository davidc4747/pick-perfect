import React, { Children, cloneElement, useState } from "react";

/* ======================== *\
    #Draggable
\* ======================== */

interface PropTypes {
    data: any;
    dragStartClass?: string | undefined;
    children: React.ReactElement;
}

export default function Draggable({
    data,
    dragStartClass,
    children,
}: PropTypes) {
    const child = Children.only(children);
    const [isDragging, setIsDragging] = useState(false);

    function onDragEnd(e: any) {
        setIsDragging(false);
    }

    function onDragStart(e: any) {
        e.dataTransfer.setData("text/plain", JSON.stringify(data));
        setIsDragging(true);
    }

    return cloneElement(child, {
        draggable: true,
        onDragStart,
        onDragEnd,
        ...child.props,
        className: [
            child.props.className,
            isDragging ? dragStartClass : "",
        ].join(" "),
    });
}
