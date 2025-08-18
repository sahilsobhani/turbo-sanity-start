import React from "react";

interface PokemonCardProps {
  pokemon?: {
    name: string | null;
    sprite: string | null;
    types: string[] | null;
  } | null;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  if (!pokemon || !pokemon.name || !pokemon.sprite || !pokemon.types) return null; 

  return (
    <div className="my-4 mb-8 flex items-center gap-4 rounded-lg border border-gray-200/10 p-4 dark:bg-slate-800/10 bg-white shadow-inner">
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        className="h-16 w-16 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-lg font-semibold dark:text-gray-50 text-gray-900">{pokemon.name}</span>
        <span className="text-sm dark:text-gray-200 text-gray-600">
          {pokemon.types.join(", ")}
        </span>
      </div>
    </div>
  );
}
