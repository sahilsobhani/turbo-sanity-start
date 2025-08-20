
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PatchEvent, set, unset } from "sanity";
import {
  Box,
  Button,
  Card,
  Flex,
  Spinner,
  Stack,
  Text,
  TextInput,
  Badge,
} from "@sanity/ui";
import { CloseIcon, SearchIcon, WarningOutlineIcon } from "@sanity/icons";

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

    const controller = new AbortController();
    const signal = controller.signal;

    const handler = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${query.trim().toLowerCase()}`,
          { signal }
        );

        if (!res.ok) {
          setResults([]);
          setError(res.status === 404 ? "No Pokémon found" : "Error fetching Pokémon");
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
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setResults([]);
          setError("Error fetching Pokémon");
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [query]);

  const handleSelect = useCallback(
    (pokemon: PokemonData) => {
      if (!readOnly) {
        onChange(PatchEvent.from(set(pokemon)));
        setQuery("");
        setResults([]);
      }
    },
    [onChange, readOnly]
  );

  const handleClear = useCallback(() => {
    if (!readOnly) {
      onChange(PatchEvent.from(unset()));
    }
  }, [onChange, readOnly]);

  const resultList = useMemo(() => {
    if (results.length === 0 || readOnly) return null;
    return (
      <Card
        padding={2}
        radius={2}
        shadow={1}
        style={{ maxHeight: 200, overflowY: "auto" }}
      >
        <Stack space={2}>
          {results.map((p) => (
            <Card
              key={p.id}
              padding={2}
              radius={2}
              tone="transparent"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelect(p)}
            >
              <Flex gap={3} align="center">
                <img src={p.sprite} width={40} height={40} alt={p.name} />
                <Box>
                  <Text weight="semibold" style={{ textTransform: "capitalize" }}>
                    {p.name}
                  </Text>
                  <Text size={1} muted style={{ marginTop: "4px" }}>
                    {p.types.join(", ")}
                  </Text>
                </Box>
              </Flex>
            </Card>
          ))}
        </Stack>
      </Card>
    );
  }, [results, handleSelect, readOnly]);

  return (
    <Stack space={3}>
      {/* Title + description */}
      {type?.title && (
        <Text size={1} weight="semibold">
          {type.title}
        </Text>
      )}
      {type?.description && <Text size={1}>{type.description}</Text>}

      {/* Selected Pokémon card */}
      {value && (
        <Card padding={2} radius={2} shadow={1} tone="transparent">
          <Flex gap={3} align="center">
            <img src={value.sprite} width={48} height={48} alt={value.name} />
            <Box>
              <Text weight="semibold" style={{ textTransform: "capitalize" }}>
                {value.name}
              </Text>
              <Text size={1} muted style={{ marginTop: "4px" }}>
                {value.types.join(", ")}
              </Text>
            </Box>
            {!readOnly && (
              <Button
                icon={CloseIcon}
                mode="bleed"
                tone="critical"
                title="Clear selection"
                onClick={handleClear}
                style={{ marginLeft: "auto" }}
              />
            )}
          </Flex>
        </Card>
      )}

      {/* Input field */}
      {!readOnly && (
        <TextInput
          value={query}
          placeholder="Search Pokémon by name"
          onChange={(e) => setQuery(e.currentTarget.value)}
          icon={SearchIcon}
        />
      )}

      {/* Feedback states */}
      {loading && (
        <Flex align="center" gap={2}>
          <Spinner muted />
          <Text size={1} muted>
            Searching...
          </Text>
        </Flex>
      )}
      {error && (
        <Badge tone="critical" padding={3} radius={2}>
          <Flex gap={2} align="center">
            <WarningOutlineIcon />
            <Text size={1}>{error}</Text>
          </Flex>
        </Badge>
      )}

      {/* Results */}
      {resultList}
    </Stack>
  );
}
