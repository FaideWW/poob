"use client";

import { useState } from "react";
import { resolveCharacterStats } from "./calcs";
import {
  BaseClass,
  CLASS_DISPLAY_NAMES,
  Character,
  createCharacter,
} from "./stats";

const Character = () => {
  const [character, setCharacter] = useState<Character | null>(null);

  const handleSelectBaseClass = (e: React.FormEvent<HTMLSelectElement>) => {
    const baseClass = e.currentTarget.value as BaseClass | "";
    if (baseClass === "") return;
    setCharacter(resolveCharacterStats(createCharacter(baseClass)));
  };

  return (
    <div className="w-full">
      <section className="my-4 mx-auto w-1/2">
        <h2>Choose base class (resets current character):</h2>
        <select onChange={handleSelectBaseClass} className="p-2 w-full">
          <option value="">-- Select a base class --</option>
          <option value="MARAUDER">{CLASS_DISPLAY_NAMES.MARAUDER}</option>
          <option value="DUELIST">{CLASS_DISPLAY_NAMES.DUELIST}</option>
          <option value="RANGER">{CLASS_DISPLAY_NAMES.RANGER}</option>
          <option value="SHADOW">{CLASS_DISPLAY_NAMES.SHADOW}</option>
          <option value="WITCH">{CLASS_DISPLAY_NAMES.WITCH}</option>
          <option value="TEMPLAR">{CLASS_DISPLAY_NAMES.TEMPLAR}</option>
          <option value="SCION">{CLASS_DISPLAY_NAMES.SCION}</option>
        </select>
      </section>
      {character && (
        <section className="w-full">
          <h2 className="text-3xl font-bold text-center">
            {CLASS_DISPLAY_NAMES[character.baseClass]}
          </h2>
          <div className="flex flex-row gap-x-24">
            <div>
              <h3 className="text-xl font-bold">Stats</h3>
              <div className="text-red-500">
                Strength: {Math.floor(character.resolvedStats.strength)}
              </div>
              <div className="text-green-500">
                Dexterity: {Math.floor(character.resolvedStats.dexterity)}
              </div>
              <div className="text-blue-500">
                Intelligence: {Math.floor(character.resolvedStats.intelligence)}
              </div>
              <hr className="my-4" />
              <div className="">
                Life: {Math.floor(character.resolvedStats.life)}
              </div>
              <div className="">
                Mana: {Math.floor(character.resolvedStats.mana)}
              </div>
              <div className="">
                Energy shield:{" "}
                {Math.floor(character.resolvedStats.energyShield)}
              </div>
              <hr className="my-4" />
              <div className="">
                Accuracy rating:{" "}
                {Math.floor(character.resolvedStats.accuracyRating)}
              </div>
              <div className="">
                Evasion rating:{" "}
                {Math.floor(character.resolvedStats.evasionRating)}
              </div>
            </div>
            <div className="grow">
              <h3 className="text-xl font-bold">Modifiers</h3>
              <textarea className="w-full" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Character;