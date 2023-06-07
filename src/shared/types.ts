/* ======================== *\
    #User Config
\* ======================== */

export type SelectionGroup =
    | "all"
    | "top"
    | "jungle"
    | "middle"
    | "utility"
    | "bottom";

export interface UserSelections {
    all: RoleSelections;
    top: RoleSelections;
    jungle: RoleSelections;
    middle: RoleSelections;
    utility: RoleSelections;
    bottom: RoleSelections;
}
export interface RoleSelections {
    ban: number[]; // if ban is empty, use the generic BanList
    hover: number[]; // If hover is empty, use the PickList
    pick: number[];
}

export type SelectionPhase = "ban" | "hover" | "pick";
