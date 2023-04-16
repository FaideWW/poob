export type BaseClass =
  | "MARAUDER"
  | "DUELIST"
  | "RANGER"
  | "SHADOW"
  | "WITCH"
  | "TEMPLAR"
  | "SCION";

type MarauderAscendancy = "JUGGERNAUT" | "BERSERKER" | "CHIEFTAIN";
type DuelistAscendancy = "SLAYER" | "GLADIATOR" | "CHAMPION";
type RangerAscendancy = "DEADEYE" | "RAIDER" | "PATHFINDER";
type ShadowAscendancy = "ASSASSIN" | "SABOTEUR" | "TRICKSTER";
type WitchAscendancy = "NECROMANCER" | "OCCULTIST" | "ELEMENTALIST";
type TemplarAscendancy = "INQUISITOR" | "HIEROPHANT" | "GUARDIAN";
type ScionAscendancy = "ASCENDANT";

type AscendancyClass =
  | MarauderAscendancy
  | DuelistAscendancy
  | RangerAscendancy
  | ShadowAscendancy
  | WitchAscendancy
  | TemplarAscendancy
  | ScionAscendancy;

export const CLASS_DISPLAY_NAMES: Record<BaseClass, string> = {
  MARAUDER: "Marauder",
  DUELIST: "Duelist",
  RANGER: "Ranger",
  SHADOW: "Shadow",
  WITCH: "Witch",
  TEMPLAR: "Templar",
  SCION: "Scion",
};

export interface Character {
  baseClass: BaseClass;
  ascendancy: AscendancyClass | null;
  level: number;
  baseStats: StatSheet;
  resolvedStats: StatSheet;
}

export type Stat =
  | "strength"
  | "dexterity"
  | "intelligence"
  | "life"
  | "mana"
  | "energyShield"
  | "evasionRating"
  | "accuracyRating";

export type StatSheet = Record<Stat, number>;

// export interface StatSheet {
//   strength: number;
//   dexterity: number;
//   intelligence: number;
//   life: number;
//   mana: number;
//   energyShield: number;
//   evasionRating: number;
//   accuracyRating: number;
// }

export const ZERO_STAT_SHEET: StatSheet = {
  strength: 0,
  dexterity: 0,
  intelligence: 0,
  life: 0,
  mana: 0,
  energyShield: 0,
  evasionRating: 0,
  accuracyRating: 0,
};

export function createCharacter(baseClass: BaseClass): Character {
  return {
    baseClass,
    ascendancy: null,
    level: 1,
    baseStats: BASE_CLASS_STATS[baseClass],
    resolvedStats: ZERO_STAT_SHEET,
  };
}

const COMMON_BASE_STATS = {
  life: 50,
  mana: 40,
  energyShield: 0,
  evasionRating: 15,
  accuracyRating: 0,
};

const BASE_CLASS_STATS: Record<BaseClass, StatSheet> = {
  MARAUDER: {
    ...COMMON_BASE_STATS,
    strength: 32,
    dexterity: 14,
    intelligence: 14,
  },
  DUELIST: {
    ...COMMON_BASE_STATS,
    strength: 23,
    dexterity: 23,
    intelligence: 14,
  },
  RANGER: {
    ...COMMON_BASE_STATS,
    strength: 14,
    dexterity: 32,
    intelligence: 14,
  },
  SHADOW: {
    ...COMMON_BASE_STATS,
    strength: 14,
    dexterity: 23,
    intelligence: 23,
  },
  WITCH: {
    ...COMMON_BASE_STATS,
    strength: 14,
    dexterity: 14,
    intelligence: 32,
  },
  TEMPLAR: {
    ...COMMON_BASE_STATS,
    strength: 23,
    dexterity: 14,
    intelligence: 23,
  },
  SCION: {
    ...COMMON_BASE_STATS,
    strength: 20,
    dexterity: 20,
    intelligence: 20,
  },
};

// Level Bonuses

export const LIFE_PER_LEVEL = 12;
export const MANA_PER_LEVEL = 6;
export const ACCURACY_RATING_PER_LEVEL = 2;

// Attribute bonuses

export const LIFE_PER_STRENGTH = 0.5;
export const INC_PHYS_DAMAGE_PER_STRENGTH = 0.2;

export const ACCURACY_RATING_PER_DEXTERITY = 2;
export const INC_EVASION_RATING_PER_DEXTERITY = 0.2;

export const MANA_PER_INTELLIGENCE = 0.5;
export const INC_ENERGY_SHIELD_PER_INTELLIGENCE = 0.2;
