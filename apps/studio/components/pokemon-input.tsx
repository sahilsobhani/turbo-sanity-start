"use client";

import React, { useEffect, useState } from "react";
import { PatchEvent, set, unset } from "sanity";

interface PokemonData {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

interface PokemonInputProps {
  type?: any;
  value: PokemonData | null;
  onChange: (event: PatchEvent) => void;
  readOnly?: boolean;
}

export function PokemonInput({ value, onChange, type, readOnly }: PokemonInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PokemonData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.trim().toLowerCase()}`);
        if (!res.ok) {
          setResults([]);
          setError("No Pokémon found");
          setLoading(false);
          return;
        }
        const data = await res.json();

        const pokemon: PokemonData = {
          id: data.id,
          name: data.name,
          sprite: data.sprites.front_default,
          types: data.types.map((t: any) => t.type.name),
        };

        setResults([pokemon]);
      } catch (err) {
        setResults([]);
        setError("Error fetching Pokémon");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSelect = (pokemon: PokemonData) => {
    if (!readOnly) {
      onChange(PatchEvent.from(set(pokemon)));
      setQuery("");
      setResults([]);
    }
  };

  const handleClear = () => {
    if (!readOnly) {
      onChange(PatchEvent.from(unset()));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "sans-serif" }}>
      {type?.title && <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>{type.title}</label>}
      {type?.description && <small style={{ color: "#555" }}>{type.description}</small>}

      {value && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#f9f9f9",
          }}
        >
          <img src={value.sprite} width={48} height={48} alt={value.name} />
          <div>
            <strong style={{ textTransform: "capitalize" }}>{value.name}</strong>
            <div style={{ fontSize: "0.85rem", color: "#666" }}>{value.types.join(", ")}</div>
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                marginLeft: "auto",
                padding: "4px 8px",
                border: "none",
                borderRadius: "4px",
                background: "#e74c3c",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {!readOnly && (
        <input
          type="text"
          value={query}
          placeholder="Search Pokémon by name"
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
      )}

      {loading && <div style={{ color: "#888" }}>Searching...</div>}
      {error && <div style={{ color: "#e74c3c" }}>{error}</div>}

      {results.length > 0 && !readOnly && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginTop: "4px",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {results.map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <img src={p.sprite} width={40} height={40} alt={p.name} />
              <div>
                <strong>{p.name}</strong>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>{p.types.join(", ")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
