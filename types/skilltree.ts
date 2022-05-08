import { Modify } from "./utils";
// Tree data interface types

export interface Class {
  name: string;
  base_str: number;
  base_dex: number;
  base_int: number;
  ascendancies: Ascendancy[];
}

export interface Ascendancy {
  id: string;
  name: string;
  flavourText?: string;
  flavourTextColour?: string;
  flavourTextRect?: Rect;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Group {
  x: number;
  y: number;
  orbits: number[]; // TODO: Orbit enum?
  nodes: number[]; // TODO: NodeId enum?
}

export interface RootNode {
  group?: number;
  orbit?: number;
  orbitIndex?: number;
  out?: string[]; // TODO: NodeId
  in?: string[]; // TODO: NodeId
}

export interface Node extends RootNode {
  skill: number; // TODO: SkillId enum?
  name: string;
  icon: string;
  ascendancyName?: string;
  isNotable?: boolean;
  stats: string[];
  reminderText?: string[];

  isAscendancyStart?: boolean;

  // Ascendant skills
  isMultipleChoiceOption?: boolean;

  // Anoint recipe
  recipe?: string[];

  // Mastery nodes; could be its own interface maybe?
  isMastery?: boolean;
  inactiveIcon?: string;
  activeIcon?: string;
  activeEffectImage?: string;
  masteryEffects?: MasteryEffect[];
}

export interface MasteryEffect {
  effect: number; // TODO: SkillId
  stats: string[];
  reminderText: string[];
}

// Other marshal types for tree art, assets, etc.

export interface ExtraImage {
  x: number;
  y: number;
  image: string;
}

export interface Asset {
  [scale: string]: string;
}

export interface SkillSprite {
  filename: string;
  coords: Record<string, TextureAtlasRect>;
}

export interface TextureAtlasRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SkillTreeData {
  tree: string;
  classes: Class[];
  groups: Record<string, Group>;
  nodes: { root: RootNode } & Record<string, Node>;
  extraImages: Record<string, ExtraImage>;
  jewelSlots: number[]; // TODO: NodeId
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
  assets: { [assetName: string]: Asset };
  constants: {
    classes: {
      StrDexIntClass: number;
      StrClass: number;
      DexClass: number;
      IntClass: number;
      StrDexClass: number;
      StrIntClass: number;
      DexIntClass: number;
    };
    characterAttributes: {
      Strength: number;
      Dexterity: number;
      Intelligence: number;
    };
    PSSCentreInnerRadius: number;
    skillsPerOrbit: number[];
    orbitRadii: number[];
  };
  skillSprites: {
    [spriteState: string]: SkillSprite[];
  };
  imageZoomLevels: number[];
  points: {
    totalPoints: number;
    ascendancyPoints: number;
  };
}

// Amended types for loading assets into memory

export interface LoadedAsset {
  [scale: string]: HTMLImageElement;
}

export type LoadedSkillSprite = Modify<
  SkillSprite,
  {
    filename: HTMLImageElement;
  }
>;

export type AssetLoadedSkillTreeData = Modify<
  SkillTreeData,
  {
    assets: {
      [assetName: string]: LoadedAsset;
    };
    skillSprites: {
      [spriteState: string]: LoadedSkillSprite[];
    };
  }
>;
