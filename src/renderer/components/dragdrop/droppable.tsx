import { useState, useRef } from "react";

/* ======================== *\
    #Droppable
\* ======================== */

export type DropEffect = "link" | "copy" | "move" | "none";

interface PropTypes {
    dropEffect?: DropEffect | undefined;
    dragOverClass?: string | undefined;
    children: React.ReactElement;
    onDrop: (data: any, event?: DragEvent) => void;
}

export default function Droppable({
    dragOverClass,
    onDrop,
    children,
    dropEffect,
}: PropTypes) {
    const [isOver, setIsOver] = useState(false);
    const containerRef = useRef(null);

    const onDragOver = (e: any) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = dropEffect ?? "";
        updateIsOver(e);
    };

    function updateIsOver(e: any) {
        // this event Shouldn't trigger for any of the nested elements
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setIsOver(isInRectangle(e.clientX, e.clientY, rect));
        }
    }

    function handleDrop(e: DragEvent) {
        // return drag Data if it exists
        const dragData = JSON.parse(
            e.dataTransfer?.getData("text/plain") ?? ""
        );
        if (dragData) {
            onDrop(dragData, e);
        }
        setIsOver(false);
    }
    const child = React.Children.only(children);
    return React.cloneElement(child, {
        ref: containerRef,
        onDragEnter: updateIsOver,
        onDragLeave: updateIsOver,
        onDragOver,
        onDrop: handleDrop,
        ...child.props,
        className: [child.props.className, isOver ? dragOverClass : ""].join(
            " "
        ),
    });
}

/* ------------------------- *\
    #Helpers
\* ------------------------- */

function isInRectangle(x: number, y: number, rect: DOMRect): boolean {
    return rect.left < x && x < rect.right && rect.top < y && y < rect.bottom;
}
