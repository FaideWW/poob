import rawTree from "../../../data/skilltree/3_22/data.json";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Coord {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Tree {
  tree: string;
  classes: Class[];
  groups: Record<string, Group>;
  nodes: Record<string, Node | SkillNode | MasteryNode>;

  extraImages: Record<string, { x: number; y: number; image: string }>;
  jewelSlots: number[];

  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;

  constants: {
    classes: Record<string, number>;
    characterAttributes: Record<string, number>;
    PSSCentreInnerRadius: number;
    skillsPerOrbit: number[];
    orbitRadii: number[];
  };

  sprites: {
    background: SpriteMap;
    normalActive: SpriteMap;
    notableActive: SpriteMap;
    keystoneActive: SpriteMap;
    normalInactive: SpriteMap;
    notableInactive: SpriteMap;
    keystoneInactive: SpriteMap;
    mastery: SpriteMap;
    masteryConnected: SpriteMap;
    masteryActiveSelected: SpriteMap;
    masteryInactive: SpriteMap;
    masterActiveEffect: SpriteMap;
    tattooActiveEffect: SpriteMap;
    ascendancyBackground: SpriteMap;
    ascendancy: SpriteMap;
    startNode: SpriteMap;
    groupBackground: SpriteMap;
    frame: SpriteMap;
    jewel: SpriteMap;
    line: SpriteMap;
    jewelRadius: SpriteMap;
  };

  imageZoomLevels: number[];
  points: {
    totalPoints: number;
    ascendancyPoints: number;
  };
}

interface Class {
  name: string;
  base_str: number;
  base_dex: number;
  base_int: number;
  ascendancies: Ascendancy[];
}

interface Ascendancy {
  id: string;
  name: string;
  flavourText: string;
  flavourTextColour: string;
  flavourTextRect: Rect;
}

interface Group {
  x: number;
  y: number;
  isProxy?: boolean;
  orbits: number[];
  background: {
    image: string;
    isHalfImage?: boolean;
    offsetX?: number;
    offsetY?: number;
  };
  nodes: string[];
}

interface Node {
  group: number;
  orbit: number;
  orbitIndex: number;
  out: string[];
  in: string[];
}

interface SkillNode extends Node {
  skill: number;
  name: string;
  icon: string;
  isNotable?: boolean;
  recipe?: string[];
  stats: string[];
  reminderText?: string[];
  ascendancyName?: string;
  isAscendancyStart?: boolean;
  grantedStrength?: number;
  grantedDexterity?: number;
  grantedIntelligence?: number;
  isJewelSocket?: boolean;
  expansionJewel?: {
    size: number;
    index: number;
    proxy: string;
    parent: string;
  };
  grantedPassivePoints?: number;
  isKeystone?: boolean;
  flavourText?: string;
  isProxy?: boolean;
  isMultipleChoiceOption?: boolean;
  isBlighted?: boolean;
  classStartIndex?: number;
}

interface MasteryNode extends SkillNode {
  isMastery: boolean;
  inactiveIcon: string;
  activeIcon: string;
  activeEffectImage: string;
  masteryEffects: { effect: number; stats: string[] }[];
}

type SpriteMap = Record<string, Sprite>;

interface Sprite {
  filename: string;
  w: number;
  h: number;
  coords: Record<string, Coord>;
}

export const tree = rawTree as Tree;
