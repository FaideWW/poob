import { Modifier, ModifierNature } from "./modifiers";
import { Stat } from "./stats";

type ModNaturePattern = [RegExp, ModifierNature];

const modNaturePatterns: ModNaturePattern[] = [
  [/^([\+\-]\d+) to/, "ADDED"],
  [/^(\d+)% (increased|reduced)/, "INCREASED"],
  [/^(\d+)% (more|less)/, "MORE"],
];

type ModTargetPattern = [RegExp, Stat];

const modTargetPatterns: ModTargetPattern[] = [
  [/strength/, "strength"],
  [/dexterity/, "dexterity"],
  [/intelligence/, "intelligence"],
  [/maximum life/, "life"],
  [/maximum mana/, "mana"],
  [/maxmimum energy shield/, "energyShield"],
  [/accuracy rating/, "accuracyRating"],
  [/evasion rating/, "evasionRating"],
];

export function parseMod(str: string): Modifier[] | null {
  const treatedStr = str.trim().toLowerCase();

  let affectedStat = null;
  let nature = null;
  let value = null;

  let match = null;
  for (let i = 0; i < modNaturePatterns.length; i++) {
    const [pattern, matchedNature] = modNaturePatterns[i];
    const match = pattern.exec(treatedStr);
    if (match === null) {
      continue;
    }

    let maybeValue = parseInt(match[1]);
    if (Number.isNaN(maybeValue)) continue;
    if (matchedNature === "INCREASED" && match[2] === "reduced") {
      maybeValue *= -1;
    }
    if (matchedNature === "MORE" && match[2] === "less") {
      maybeValue *= -1;
    }
    value = maybeValue;
    nature = matchedNature;
  }

  if (value === null) return null;
  if (nature === null) return null;

  for (let i = 0; i < modTargetPatterns.length; i++) {
    const [pattern, matchedStat] = modTargetPatterns[i];
    const match = pattern.exec(treatedStr);
    if (match === null) {
      continue;
    }

    affectedStat = matchedStat;
  }

  if (affectedStat === null) return null;

  return [
    {
      originalString: str,
      affectedStat,
      nature,
      value,
    },
  ];
}

export function parseMods(str: string): Modifier[] {
  const strs = str.split("\n");
  console.log(`parsing ${strs.length} mods`);
  return strs.reduce<Modifier[]>((arr, line) => {
    console.log(`mod: ${line}`);
    const mods = parseMod(line);
    if (mods === null) return arr;
    return arr.concat(mods);
  }, []);
}
