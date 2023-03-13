import champList from "../data/champDataArray.min.json";
import champMap from "../data/champDataMap.min.json";

export interface ChampionData {
    id: number;
    name: string;
    title: string;
    image: string;
    tags: string[];
}

export function getChampionList(): ChampionData[] {
    return champList;
}

export function getChampionMap(): Map<number, ChampionData> {
    return new Map<number, ChampionData>(champMap);
}
