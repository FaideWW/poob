import {
  SkillTreeData,
  AssetLoadedSkillTreeData,
  Asset,
  LoadedAsset,
  SkillSprite,
  LoadedSkillSprite,
} from "../../types/skilltree";

const cachedLoadedImages = {};

async function loadRemoteImage(filepath: string): Promise<HTMLImageElement> {
  if (cachedLoadedImages[filepath]) return cachedLoadedImages[filepath];
  return new Promise<HTMLImageElement>((resolve) => {
    const image = new Image();
    image.src = filepath;
    image.addEventListener("load", () => {
      cachedLoadedImages[filepath] = image;
      resolve(image);
    });
  });
}

async function loadAssetScales(asset: Asset): Promise<LoadedAsset> {
  const loadedScaleArray: [scalename: string, image: HTMLImageElement][] =
    await Promise.all(
      Object.entries(asset).map(async ([scaleName, url]) => {
        const image = await loadRemoteImage(url);
        return [scaleName, image];
      })
    );
  return loadedScaleArray.reduce((obj, [scale, img]) => {
    obj[scale] = img;
    return obj;
  }, {});
}

async function loadAssets(assetTree: {
  [assetName: string]: Asset;
}): Promise<{ [assetName: string]: LoadedAsset }> {
  const loadedAssetArray: [assetName: string, loadedScales: LoadedAsset][] =
    await Promise.all(
      Object.entries(assetTree).map(async ([assetName, asset]) => {
        const loadedScales = await loadAssetScales(asset);
        return [assetName, loadedScales];
      })
    );
  return loadedAssetArray.reduce((obj, [assetName, loadedScales]) => {
    obj[assetName] = { ...assetTree[assetName], ...loadedScales };
    return obj;
  }, {});
}

async function loadSkillSpriteArray(
  skillSpriteArray: SkillSprite[]
): Promise<LoadedSkillSprite[]> {
  return Promise.all(
    skillSpriteArray.map(async (skillSprite) => {
      const img = await loadRemoteImage(skillSprite.filename);
      return {
        ...skillSprite,
        filename: img,
      };
    })
  );
}

async function loadSkillSprites(skillSpritesTree: {
  [skillSprite: string]: SkillSprite[];
}): Promise<{ [skillSprite: string]: LoadedSkillSprite[] }> {
  const loadedSkillSpriteArray: [
    spriteState: string,
    loadedAtlas: LoadedSkillSprite[]
  ][] = await Promise.all(
    Object.entries(skillSpritesTree).map(
      async ([spriteState, skillSprites]) => {
        const loadedSpriteArray = await loadSkillSpriteArray(skillSprites);
        return [spriteState, loadedSpriteArray];
      }
    )
  );
  return loadedSkillSpriteArray.reduce((obj, [spriteState, loadedAtlas]) => {
    obj[spriteState] = { ...skillSpritesTree[spriteState], ...loadedAtlas };
    return obj;
  }, {});
}

export default async function loadSkillTreeAssets(
  tree: SkillTreeData
): Promise<AssetLoadedSkillTreeData> {
  const loadedAssets = await loadAssets(tree.assets);
  const loadedSkillSprites = await loadSkillSprites(tree.skillSprites);
  return {
    ...tree,
    assets: loadedAssets,
    skillSprites: loadedSkillSprites,
  };
}
