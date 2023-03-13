import React, { ReactElement } from "react";
import Draggable from "./draggable";
import Droppable, { DropEffect } from "./droppable";

/* ======================== *\
    #Drag N Drop
\* ======================== */

interface PropTypes {
    data: any;
    children: React.ReactElement;
    dropEffect?: DropEffect;
    dragOverClass?: string;
    dragStartClass?: string;
    onDrop: (data: any, event?: DragEvent) => void;
}

export default function DragNDrop({
    data,
    dragOverClass,
    dragStartClass,
    dropEffect,
    onDrop,
    children,
}: PropTypes) {
    /* 
        NOTE: 
        When I try to Compose these two components use JSX it doesn't pass the properties
        down to children the way I think they should. so I just call the components manually here [DC]
    */
    return Droppable({
        dragOverClass,
        dropEffect,
        onDrop,
        children: Draggable({
            data,
            dragStartClass,
            children: React.Children.only(children),
        }),
    });

    // return (
    //     <Droppable
    //         dropEffect={dropEffect}
    //         dragOverClass={dragOverClass}
    //         onDrop={onDrop}
    //     >
    //         <Draggable data={data}>
    //             <div>{children}</div>
    //         </Draggable>
    //     </Droppable>
    // );
}
