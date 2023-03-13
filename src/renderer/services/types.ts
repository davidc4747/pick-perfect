export enum Page {
    ViewUserSelections,
    SelectChampion,
    Settings,
}
export enum AssignedPosition {
    Top = "top",
    Jungle = "jungle",
    Middle = "middle",
    Utility = "utility",
    Bottom = "bottom",
}

export type ChampionSelectPhase = "ban" | "hover" | "pick";
