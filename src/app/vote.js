"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Image from "next/image";
import DATA from "./data.json";

const VOTERS = [
  "José",
  "Lolis",
  "Montse",
  "Marco",
  "Leo",
  "Caro",
  "Diego",
  "Emmanuel",
  "Jénesis",
  "Lea",
  "Robert",
  "Robert Jr",
  "Alondra",
  "Esperanza",
];

const slug = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();

// Helper to extract a short summary for "imperdible_por"
function extractImperdible(descripcion) {
  // Take first sentence or first 100 chars
  const firstSentence = descripcion.split('.')[0];
  return firstSentence.length > 100 
    ? firstSentence.substring(0, 100) + "..." 
    : firstSentence;
}

// Helper to generate image placeholder path
function getImagePath(destino, categoria, nombre) {
  const destinoSlug = slug(destino);
  const nombreSlug = slug(nombre);
  return `/images/${destinoSlug}/${nombreSlug}.jpg`;
}

function flattenData() {
  const out = [];
  
  // DATA structure: { "Cancún": {...}, "Cozumel": {...}, "Playa del Carmen": {...} }
  Object.entries(DATA).forEach(([destino, categories]) => {
    Object.entries(categories).forEach(([categoria, content]) => {
      // Handle nested gastronomy structure
      if (categoria === "gastronomía_local" && typeof content === "object" && !Array.isArray(content)) {
        // Process platillos_típicos and restaurantes_recomendados
        Object.entries(content).forEach(([subcategoria, items]) => {
          if (Array.isArray(items)) {
            items.forEach((item) => {
              const id = [destino, categoria, subcategoria, item.nombre].map(slug).join("__");
              out.push({
                id,
                destino,
                categoria: `${categoria} - ${subcategoria.replace(/_/g, ' ')}`,
                nombre: item.nombre,
                descripcion: item.descripcion,
                imperdible_por: item.especialidad || extractImperdible(item.descripcion),
                imagen: getImagePath(destino, categoria, item.nombre),
                ...item
              });
            });
          }
        });
      } else if (Array.isArray(content)) {
        // Regular array of items
        content.forEach((item) => {
          const id = [destino, categoria, item.nombre].map(slug).join("__");
          out.push({
            id,
            destino,
            categoria: categoria.replace(/_/g, ' '),
            nombre: item.nombre,
            descripcion: item.descripcion,
            imperdible_por: extractImperdible(item.descripcion),
            imagen: getImagePath(destino, categoria, item.nombre),
            ...item
          });
        });
      }
    });
  });
  
  return out;
}

const ALL_ITEMS = flattenData();

export default function VotingApp() {
  const [voter, setVoter] = useState("");
  const [votes, setVotes] = useState({});
  const [filterDestino, setFilterDestino] = useState("Todos");
  const [filterCategoria, setFilterCategoria] = useState("Todas");

  const voterHasVotedIds = useMemo(() => new Set(votes[voter] || []), [votes, voter]);

  const totalsByItem = useMemo(() => {
    const counts = new Map();
    Object.values(votes).forEach((arr) => {
      (arr || []).forEach((id) => {
        counts.set(id, (counts.get(id) || 0) + 1);
      });
    });
    return counts;
  }, [votes]);

  const destinos = useMemo(() => {
    const unique = new Set(ALL_ITEMS.map(it => it.destino));
    return ["Todos", ...Array.from(unique)];
  }, []);

  const categorias = useMemo(() => {
    const unique = new Set(ALL_ITEMS.map(it => it.categoria));
    return ["Todas", ...Array.from(unique)];
  }, []);

  const filteredItems = useMemo(() => {
    return ALL_ITEMS.filter(it => {
      const matchDestino = filterDestino === "Todos" || it.destino === filterDestino;
      const matchCategoria = filterCategoria === "Todas" || it.categoria === filterCategoria;
      return matchDestino && matchCategoria;
    });
  }, [filterDestino, filterCategoria]);

  const myVotesCount = useMemo(() => {
    return voter ? (votes[voter] || []).length : 0;
  }, [votes, voter]);

  function toggleVote(id) {
    if (!voter) {
      alert("Primero selecciona tu nombre para votar.");
      return;
    }
    setVotes((prev) => {
      const copy = { ...prev };
      const prevArr = new Set(copy[voter] || []);
      if (prevArr.has(id)) prevArr.delete(id);
      else prevArr.add(id);
      copy[voter] = Array.from(prevArr);
      return copy;
    });
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* HEADER */}
      <div className="sticky top-0 bg-white shadow-md z-10 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-cyan-700">🏝️ Votación Caribe Mexicano</h1>
                {voter && (
                  <p className="text-sm text-gray-600 mt-1">
                    Hola, <span className="font-semibold">{voter}</span> - Has votado por {myVotesCount} lugares
                  </p>
                )}
              </div>
              <Select onValueChange={setVoter} value={voter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecciona tu nombre" />
                </SelectTrigger>
                <SelectContent>
                  {VOTERS.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select onValueChange={setFilterDestino} value={filterDestino}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por destino" />
                </SelectTrigger>
                <SelectContent>
                  {destinos.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={setFilterCategoria} value={filterCategoria}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                Mostrando {filteredItems.length} de {ALL_ITEMS.length} lugares
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT CARDS */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((it) => {
            const myVoted = voterHasVotedIds.has(it.id);
            const total = totalsByItem.get(it.id) || 0;
            return (
              <Card 
                key={it.id} 
                className={`rounded-xl overflow-hidden shadow hover:shadow-xl transition-all ${
                  myVoted ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                <div className="relative w-full h-48 bg-gradient-to-br from-cyan-100 to-blue-200 flex items-center justify-center">
                  {/* Placeholder for image */}
                  <div className="text-6xl opacity-30">
                    {it.destino === "Cancún" && "🏖️"}
                    {it.destino === "Cozumel" && "🤿"}
                    {it.destino === "Playa del Carmen" && "🌴"}
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/90 text-xs font-semibold px-2 py-1 rounded-full shadow">
                      {it.destino}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-cyan-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                      {total} 🗳️
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-cyan-600 font-medium">
                      {it.categoria}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{it.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">{it.descripcion}</p>
                  <p className="text-xs text-blue-600 mb-3 italic line-clamp-2">
                    ✨ {it.imperdible_por}
                  </p>
                  <Button
                    variant={myVoted ? "default" : "outline"}
                    className={`w-full ${
                      myVoted 
                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                        : "hover:bg-blue-50"
                    }`}
                    onClick={() => toggleVote(it.id)}
                  >
                    {myVoted ? "✓ Votado" : "Votar"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay lugares que coincidan con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}