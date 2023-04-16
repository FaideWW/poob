import { produce } from "immer";
import Character from "./Character";
import { BASE_CHARACTER_MODS, Modifier, ModifierNature } from "./modifiers";
import { Stat } from "./stats";

export function resolveCharacterStats(
  character: Character,
  mods: Modifier[] = []
) {
  const sortedMods = mods
    .concat(BASE_CHARACTER_MODS)
    .reduce<Record<Stat, Modifier[]>>(
      (record, mod) => {
        record[mod.affectedStat].push(mod);
        return record;
      },
      {
        strength: [],
        dexterity: [],
        intelligence: [],
        life: [],
        mana: [],
        energyShield: [],
        evasionRating: [],
        accuracyRating: [],
      }
    );

  return produce(character, (draft) => {
    // Resolve attributes first, they may be used in later calcs
    draft.resolvedStats.strength = calculateStrength(
      draft,
      sortedMods.strength
    );
    draft.resolvedStats.dexterity = calculateDexterity(
      draft,
      sortedMods.dexterity
    );
    draft.resolvedStats.intelligence = calculateIntelligence(
      draft,
      sortedMods.intelligence
    );

    draft.resolvedStats.life = calculateLife(draft, sortedMods.life);
    draft.resolvedStats.mana = calculateMana(draft, sortedMods.mana);
    draft.resolvedStats.energyShield = calculateEnergyShield(
      draft,
      sortedMods.energyShield
    );

    draft.resolvedStats.accuracyRating = calculateAccuracyRating(
      draft,
      sortedMods.accuracyRating
    );
    draft.resolvedStats.evasionRating = calculateEvasionRating(
      draft,
      sortedMods.evasionRating
    );
  });
}

function computeModsByNature(character: Character, mods: Modifier[]) {
  return mods.reduce<Record<ModifierNature, number>>(
    (record, mod) => {
      switch (mod.nature) {
        case "ADDED": {
          const value =
            typeof mod.value === "function" ? mod.value(character) : mod.value;
          record.ADDED += value;
          break;
        }
        case "INCREASED": {
          const value =
            typeof mod.value === "function" ? mod.value(character) : mod.value;
          record.INCREASED += value / 100;
          break;
        }
        case "MORE": {
          const value =
            typeof mod.value === "function" ? mod.value(character) : mod.value;
          record.MORE *= 1 + value / 100;
          break;
        }
      }
      return record;
    },
    { ADDED: 0, INCREASED: 0, MORE: 1 }
  );
}

export function calculateStat(
  baseStat: number,
  character: Character,
  mods: Modifier[]
) {
  const modsByNature = computeModsByNature(character, mods);
  return Math.floor(
    (baseStat + modsByNature.ADDED) *
    (1 + modsByNature.INCREASED) *
    modsByNature.MORE
  );
}

export function calculateStrength(character: Character, mods: Modifier[]) {
  return calculateStat(character.baseStats.strength, character, mods);
}

export function calculateDexterity(character: Character, mods: Modifier[]) {
  return calculateStat(character.baseStats.dexterity, character, mods);
}

export function calculateIntelligence(character: Character, mods: Modifier[]) {
  return calculateStat(character.baseStats.intelligence, character, mods);
}

export function calculateLife(character: Character, mods: Modifier[]) {
  return calculateStat(character.baseStats.life, character, mods);
}

export function calculateMana(character: Character, mods: Modifier[]) {
  return calculateStat(character.baseStats.mana, character, mods);
}

export function calculateEnergyShield(character: Character, mods: Modifier[]) {
  return calculateStat(character.baseStats.energyShield, character, mods);
}

export function calculateAccuracyRating(
  character: Character,
  mods: Modifier[]
) {
  return calculateStat(character.baseStats.accuracyRating, character, mods);
}

export function calculateEvasionRating(character: Character, mods: Modifier[]) {
  return calculateStat(character.baseStats.evasionRating, character, mods);
}
