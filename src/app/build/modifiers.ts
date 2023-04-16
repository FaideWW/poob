import Character from "./Character";
import {
  ACCURACY_RATING_PER_DEXTERITY as ACCURACY_RATING_PER_DEXTERITY,
  ACCURACY_RATING_PER_LEVEL,
  INC_ENERGY_SHIELD_PER_INTELLIGENCE,
  INC_EVASION_RATING_PER_DEXTERITY,
  LIFE_PER_LEVEL,
  LIFE_PER_STRENGTH,
  MANA_PER_INTELLIGENCE,
  MANA_PER_LEVEL,
  Stat,
} from "./stats";

export type ModifierNature = "ADDED" | "INCREASED" | "MORE";

export interface Modifier {
  originalString?: string;
  affectedStat: Stat;
  nature: ModifierNature;
  value: number | ((character: Character) => number);
}

export const BASE_CHARACTER_MODS: Modifier[] = [
  {
    affectedStat: "life",
    nature: "ADDED",
    value: ({ level }) => (level - 1) * LIFE_PER_LEVEL,
  },
  {
    affectedStat: "life",
    nature: "ADDED",
    value: ({ resolvedStats }) => resolvedStats.strength * LIFE_PER_STRENGTH,
  },
  {
    affectedStat: "mana",
    nature: "ADDED",
    value: ({ level }) => (level - 1) * MANA_PER_LEVEL,
  },
  {
    affectedStat: "mana",
    nature: "ADDED",
    value: ({ resolvedStats }) =>
      resolvedStats.intelligence * MANA_PER_INTELLIGENCE,
  },
  {
    affectedStat: "energyShield",
    nature: "INCREASED",
    value: ({ resolvedStats }) =>
      resolvedStats.intelligence * INC_ENERGY_SHIELD_PER_INTELLIGENCE,
  },
  {
    affectedStat: "accuracyRating",
    nature: "ADDED",
    value: ({ level }) => (level - 1) * ACCURACY_RATING_PER_LEVEL,
  },
  {
    affectedStat: "accuracyRating",
    nature: "ADDED",
    value: ({ resolvedStats }) =>
      resolvedStats.dexterity * ACCURACY_RATING_PER_DEXTERITY,
  },
  {
    affectedStat: "evasionRating",
    nature: "INCREASED",
    value: ({ resolvedStats }) =>
      resolvedStats.dexterity * INC_EVASION_RATING_PER_DEXTERITY,
  },
];
