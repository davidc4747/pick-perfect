/* ======================== *\
    #User Config
\* ======================== */

export interface UserConfig {
    all: RoleSelections;
    top: RoleSelections;
    jungle: RoleSelections;
    middle: RoleSelections;
    utility: RoleSelections;
    bottom: RoleSelections;
}
interface RoleSelections {
    bans: number[]; // if ban is empty, use the generic BanList
    hover: number[]; // If hover is empty, use the PickList
    picks: number[];
}

/* ======================== *\
    #Summoner
\* ======================== */

export interface CurrentSummoner {
    accountId: number;
    displayName: string;
    internalName: string;
    nameChangeFlag: boolean;
    percentCompleteForNextLevel: number;
    privacy: string;
    profileIconId: number;
    puuid: string;
    rerollPoints: {
        currentPoints: number;
        maxRolls: number;
        numberOfRolls: number;
        pointsCostToRoll: number;
        pointsToReroll: number;
    };
    summonerId: number;
    summonerLevel: number;
    unnamed: boolean;
    xpSinceLastLevel: number;
    xpUntilNextLevel: number;
}

/* ======================== *\
    #Champ Select
\* ======================== */

export interface ChampSelectSession {
    actions: Action[][];
    allowBattleBoost: boolean;
    allowDuplicatePicks: boolean;
    allowLockedEvents: boolean;
    allowRerolling: boolean;
    allowSkinSelection: boolean;
    bans: {
        myTeamBans: number[];
        numBans: number;
        theirTeamBans: number[];
    };
    benchChampions: number[];
    benchEnabled: boolean;
    boostableSkinCount: number;
    chatDetails: {
        chatRoomName: string;
        chatRoomPassword: string | null;
        multiUserChatJWT: string;
    };
    counter: number;
    entitledFeatureState: {
        additionalRerolls: number;
        unlockedSkinIds: number[];
    };
    gameId: number;
    hasSimultaneousBans: boolean;
    hasSimultaneousPicks: boolean;
    isCustomGame: boolean;
    isSpectating: boolean;
    localPlayerCellId: number;
    lockedEventIndex: number;

    recoveryCounter: number;
    rerollsRemaining: number;
    skipChampionSelect: boolean;

    myTeam: TeamMember[];
    theirTeam: TeamMember[];
    timer: ChampSelectTimer;

    pickOrderSwaps: any[];
    trades: any[];
}

export type ChampSelectPhase = "PLANNING" | "BAN_PICK" | "FINALIZATION";

export interface ChampSelectTimer {
    adjustedTimeLeftInPhase: number;
    internalNowInEpochMs: number;
    isInfinite: boolean;
    phase: ChampSelectPhase;
    totalTimeInPhase: number;
}

export type AssignedPosition =
    | "top"
    | "jungle"
    | "middle"
    | "utility"
    | "bottom";

// type Phase = "hover" | "ban" | "pick";

export interface TeamMember {
    assignedPosition: AssignedPosition;
    cellId: number;
    championId: number;
    championPickIntent: number;
    entitledFeatureType: "NONE" | string;
    nameVisibilityType: "HIDDEN" | string;
    obfuscatedPuuid: "string";
    obfuscatedSummonerId: 2713173400550627;
    puuid: string;
    selectedSkinId: number;
    spell1Id: number;
    spell2Id: number;
    summonerId: number;
    team: number;
    wardSkinId: number;
}

export interface Action {
    id: number;
    actorCellId: number;
    championId: number;
    completed: boolean;
    isAllyAction: boolean;
    isInProgress: boolean;
    type: "ban" | "pick" | "ten_bans_reveal";
}
