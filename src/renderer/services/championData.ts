import champFull from "../data/championFull.json";

interface ChampionFullJSON {
    type: "champion";
    format: "full";
    version: string;
    data: Record<string, FullChampionData>;
    keys: Record<string, string>;
}

interface FullChampionData {
    id: string; // "Aatrox";
    key: string; // "266";
    name: string; // "Aatrox";
    title: string; // "the Darkin Blade";
    image: any;
    skins: {
        id: string; // "266000";
        num: number;
        name: string;
        chromas: boolean;
    }[];
    lore: string;
    blurb: string;
    allytips: string[];
    enemytips: string[];
    tags: string[]; // ["Fighter", "Tank"];
    partype: string; // "Blood Well";
    info: {
        attack: number;
        defense: number;
        magic: number;
        difficulty: number;
    };
    stats: {
        hp: number;
        hpperlevel: number;
        mp: number;
        mpperlevel: number;
        movespeed: number;
        armor: number;
        armorperlevel: number;
        spellblock: number;
        spellblockperlevel: number;
        attackrange: number;
        hpregen: number;
        hpregenperlevel: number;
        mpregen: number;
        mpregenperlevel: number;
        crit: number;
        critperlevel: number;
        attackdamage: number;
        attackdamageperlevel: number;
        attackspeedperlevel: number;
        attackspeed: number;
    };
    spells: {
        id: string; // AatroxQ";
        name: string; // "The Darkin Blade";
        description: string; // "Aatrox slams his greatsword down, dealing physical damage. He can swing three times, each with a dif...";
        tooltip: string; // "Aatrox slams his greatsword, dealing <physicalDamage>{{ qdamage }} physical damage</physicalDamage>....";
        leveltip: { label: any[]; effect: any[] };
        maxrank: number; // 5;
        cooldown: number[]; // [14, 12, 10, 8, 6];
        cooldownBurn: string; // "14/12/10/8/6";
        cost: number[]; // [0, 0, 0, 0, 0];
        costBurn: string; // "0";
        datavalues: any;
        effect: any[];
        effectBurn: [null, "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
        vars: [];
        costType: string; // "No Cost";
        maxammo: string; // "-1";
        range: number[]; // [25000, 25000, 25000, 25000, 25000];
        rangeBurn: string; // "25000";
        image: any;
        resource: string; // "No Cost";
    }[];
    passive: {
        name: string;
        description: string;
        image: any;
    };
    recommended: any[];
}

/* ======================== *\
    # Functions
\* ======================== */

export interface ChampionData {
    id: number;
    name: string;
    title: string;
    image: string;
    tags: string[];
}

export function getChampionList(): ChampionData[] {
    const champions = champFull.data as ChampionFullJSON["data"];
    const arr: ChampionData[] = [];
    for (const champName in champions) {
        if (Object.hasOwn(champions, champName)) {
            const data: ChampionData = filterData(champions[champName]);
            arr.push(data);
        }
    }
    return arr;
}

export function getChampionMap(): Map<number, ChampionData> {
    const champions = champFull.data as ChampionFullJSON["data"];
    const map = new Map<number, ChampionData>();
    for (const champName in champions) {
        if (Object.hasOwn(champions, champName)) {
            const data: ChampionData = filterData(champions[champName]);
            map.set(data.id, data);
        }
    }
    return map;
}

/* ======================== *\
    #Helpers
\* ======================== */

function filterData(data: FullChampionData): ChampionData {
    const { key, name, title, image, tags } = data;
    return {
        id: Number(key),
        name,
        title,
        image: `./champions/${image.full}`,
        tags,
    };
}
