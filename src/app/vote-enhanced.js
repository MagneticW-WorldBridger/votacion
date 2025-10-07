"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Activity, 
  Heart, 
  Users,
  Wind,
  Star,
  ExternalLink,
  Info,
  MapPin,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Flame,
  Waves
} from "lucide-react";
import ENHANCED_DATA from "./enriched-places.json";

const VOTERS = [
  "José", "Lolis", "Montse", "Marco", "Leo", "Caro", "Diego",
  "Emmanuel", "Jénesis", "Lea", "Robert", "Robert Jr", "Alondra", "Esperanza"
];

const slug = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();

// Limpiar markdown links de las descripciones
const cleanMarkdown = (text) => {
  if (!text) return '';
  // Remover markdown links: [text](url) -> text
  return text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remover citation links tipo [oai_citation:0‡domain.com]
    .replace(/\[oai_citation:\d+‡[^\]]+\]/g, '')
    .trim();
};

// IMAGE CAROUSEL Component - Para múltiples fotos
function ImageCarousel({ images, nombre, destino }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!images || images.length === 0) return null;
  
  // Si solo hay 1 imagen, no mostrar controles
  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={nombre}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
    );
  }
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <div className="relative w-full h-full">
      {/* Imagen actual */}
      <img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`${nombre} - Foto ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-300"
        loading="lazy"
        onError={(e) => {
          // Si falla, intentar siguiente imagen
          if (currentIndex < images.length - 1) {
            goToNext();
          }
        }}
      />
      
      {/* Botones de navegación */}
      <button
        onClick={(e) => { e.stopPropagation(); goToPrev(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full shadow-xl transition-all hover:scale-110 z-10"
        aria-label="Foto anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full shadow-xl transition-all hover:scale-110 z-10"
        aria-label="Siguiente foto"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      {/* Indicadores de posición */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Ir a foto ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* Counter */}
      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  );
}

// HUMAN-READABLE Requirements Display
function IntensityIndicator({ intensidad, accesibilidad, requisitos_especificos }) {
  const { fisica = 0, vertigo = 0, atletico = 0 } = intensidad || {};
  
  const getColorClass = (value) => {
    if (value === 0) return { text: "text-green-600", bg: "bg-green-500", label: "Relajado" };
    if (value <= 2) return { text: "text-blue-600", bg: "bg-blue-500", label: "Ligero" };
    if (value <= 3) return { text: "text-yellow-600", bg: "bg-yellow-500", label: "Moderado" };
    if (value <= 4) return { text: "text-orange-600", bg: "bg-orange-500", label: "Intenso" };
    return { text: "text-red-600", bg: "bg-red-600", label: "Extremo" };
  };

  const energiaInfo = getColorClass(fisica);
  const emocionInfo = getColorClass(vertigo);
  const habilidadInfo = getColorClass(atletico);

  const getAccesibilidadDisplay = () => {
    if (accesibilidad === "alta") {
      return {
        icon: <Heart className="w-6 h-6 text-green-600 fill-green-600" />,
        label: "Para Todos",
        sublabel: "Perfecto para toda la familia",
        bg: "bg-green-50",
        border: "border-green-200"
      };
    }
    if (accesibilidad === "media") {
      return {
        icon: <Users className="w-6 h-6 text-yellow-600" />,
        label: "Moderado",
        sublabel: "Cualquiera puede hacerlo",
        bg: "bg-yellow-50",
        border: "border-yellow-200"
      };
    }
    return {
      icon: <Flame className="w-6 h-6 text-red-600" />,
      label: "Aventureros",
      sublabel: "Para los más activos",
      bg: "bg-red-50",
      border: "border-red-200"
    };
  };

  const accInfo = getAccesibilidadDisplay();
  
  // Show specific requirements if available
  const hasSpecificReqs = requisitos_especificos && requisitos_especificos.length > 0;

  return (
    <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-slate-200 shadow-sm">
      {/* Accessibility Badge - SUPER CLEAR */}
      <div className={`flex items-center gap-3 p-3 rounded-lg ${accInfo.bg} border-2 ${accInfo.border}`}>
        {accInfo.icon}
        <div className="flex-1">
          <div className="font-bold text-sm text-slate-800">{accInfo.label}</div>
          <div className="text-xs text-slate-600">{accInfo.sublabel}</div>
        </div>
      </div>
      
      {/* SPECIFIC REQUIREMENTS - HUMAN READABLE */}
      {hasSpecificReqs && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 mb-2">Qué necesitas:</div>
          {requisitos_especificos.slice(0, 3).map((req, idx) => (
            <div key={idx} className="text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 flex items-start gap-2">
              <span className="flex-shrink-0">{req.split(' ')[0]}</span>
              <span className="flex-1">{req.substring(req.indexOf(' ') + 1)}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Intensity Bars - Compact version when we have specific reqs */}
      <div className={`space-y-2 ${hasSpecificReqs ? 'opacity-60' : 'space-y-3'}`}>
        {/* Energía */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${energiaInfo.text}`} />
              <span className="text-xs font-bold text-slate-700">Energía:</span>
              <span className={`text-xs font-bold ${energiaInfo.text}`}>{energiaInfo.label}</span>
            </div>
            <span className="text-xs text-slate-500">{fisica}/5</span>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2.5 rounded-sm transition-all ${
                  i < fisica ? energiaInfo.bg : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Emoción */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Wind className={`w-4 h-4 ${emocionInfo.text}`} />
              <span className="text-xs font-bold text-slate-700">Emoción:</span>
              <span className={`text-xs font-bold ${emocionInfo.text}`}>{emocionInfo.label}</span>
            </div>
            <span className="text-xs text-slate-500">{vertigo}/5</span>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2.5 rounded-sm transition-all ${
                  i < vertigo ? emocionInfo.bg : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Habilidad */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Star className={`w-4 h-4 ${habilidadInfo.text}`} />
              <span className="text-xs font-bold text-slate-700">Habilidad:</span>
              <span className={`text-xs font-bold ${habilidadInfo.text}`}>{habilidadInfo.label}</span>
            </div>
            <span className="text-xs text-slate-500">{atletico}/5</span>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2.5 rounded-sm transition-all ${
                  i < atletico ? habilidadInfo.bg : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Rich Links Modal - MOBILE FIRST con Gestalt principles
function LinksModal({ isOpen, onClose, item }) {
  if (!item) return null;

  const links = item.links_utiles || item.links || [];
  const requisitos = item.requisitos_especificos || [];
  const hasContent = links.length > 0 || requisitos.length > 0;
  
  if (!hasContent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* HEADER - Sticky, MOBILE OPTIMIZED */}
        <div className="sticky top-0 bg-gradient-to-br from-cyan-50 to-blue-50 border-b-2 border-cyan-200 p-3 sm:p-5 z-10">
          <DialogTitle className="text-base sm:text-xl font-bold text-slate-800 pr-6 leading-tight mb-1.5 break-words">
            {item.nombre}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-700 leading-snug break-words">
            {cleanMarkdown(item.descripcion)}
          </DialogDescription>
        </div>

        {/* SCROLLABLE CONTENT - TODO RESPONSIVE */}
        <div className="p-3 sm:p-5 space-y-4">
          {/* REQUISITOS - TODO ADAPTABLE */}
          {requisitos.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-slate-200 p-3 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-center flex-wrap gap-2 text-sm sm:text-base mb-3">
                <Activity className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                <span className="break-words">Qué Necesitas Saber</span>
                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">
                  {requisitos.length}
                </span>
              </h3>
              <div className="space-y-2">
                {requisitos.map((req, idx) => (
                  <div 
                    key={idx} 
                    className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-2.5 flex items-start gap-2"
                  >
                    <span className="text-xl sm:text-2xl flex-shrink-0 leading-none">{req.split(' ')[0]}</span>
                    <span className="flex-1 text-xs sm:text-sm text-slate-700 leading-relaxed pt-0.5 break-words">
                      {req.substring(req.indexOf(' ') + 1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* ENLACES - TODO COMPACTO EN MÓVIL */}
          {links.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-slate-200 p-3 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-center flex-wrap gap-2 text-sm sm:text-base mb-3">
                <ExternalLink className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                <span className="break-words">Enlaces Útiles</span>
                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">
                  {links.length}
                </span>
              </h3>
              
              <div className="space-y-2.5">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group active:scale-[0.98] transition-transform"
                  >
                    {/* CARD SÚPER COMPACTA PARA MÓVIL */}
                    <div className="border-2 border-slate-200 rounded-lg p-2.5 sm:p-3 bg-white hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 hover:border-cyan-400 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start gap-2.5">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0 overflow-hidden">
                          {/* TÍTULO COMPACTO */}
                          <h4 className="font-bold text-slate-800 group-hover:text-cyan-700 text-xs sm:text-sm leading-tight mb-1 flex items-start gap-1.5 break-words">
                            <span className="flex-1 line-clamp-2">{link.titulo}</span>
                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-cyan-500 mt-0.5" />
                          </h4>
                          
                          {/* DESCRIPCIÓN COMPACTA */}
                          <p className="text-xs text-slate-600 leading-snug mb-1.5 line-clamp-2 break-words">
                            {link.descripcion}
                          </p>
                          
                          {/* URL SÚPER TRUNCADA */}
                          <div className="bg-cyan-50 px-1.5 py-1 rounded">
                            <span className="text-[10px] sm:text-xs text-cyan-600 font-mono truncate block">
                              {link.url.replace('https://', '').replace('http://', '').substring(0, 40)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// FIXED: Flatten data properly - works with both enriched and consolidated formats
function flattenData() {
  const out = [];
  
  // Check if we have enriched format (with places array)
  if (ENHANCED_DATA.places && Array.isArray(ENHANCED_DATA.places)) {
    return ENHANCED_DATA.places.map(item => ({
      ...item,
      id: slug(`${item.destino}_${item.categoria}_${item.nombre}`)
    }));
  }
  
  // Otherwise use old format
  Object.entries(ENHANCED_DATA).forEach(([destino, categories]) => {
    if (destino === 'metadata') return; // Skip metadata
    
    Object.entries(categories).forEach(([categoria, content]) => {
      // Handle gastronomy nested structure
      if (categoria === "gastronomía_local" && typeof content === "object" && !Array.isArray(content)) {
        Object.entries(content).forEach(([subcategoria, items]) => {
          if (Array.isArray(items)) {
            items.forEach((item) => {
              const id = [destino, categoria, subcategoria, item.nombre].map(slug).join("__");
              out.push({
                id,
                destino,
                categoria: `${categoria.replace(/_/g, ' ')} - ${subcategoria.replace(/_/g, ' ')}`,
                ...item
              });
            });
          }
        });
      } else if (Array.isArray(content)) {
        // Regular array
        content.forEach((item) => {
          const id = [destino, categoria, item.nombre].map(slug).join("__");
          out.push({
            id,
            destino,
            categoria: categoria.replace(/_/g, ' '),
            ...item
          });
        });
      }
    });
  });
  
  return out;
}

const ALL_ITEMS = flattenData();

export default function VotingAppEnhanced() {
  const [voter, setVoter] = useState("");
  const [votes, setVotes] = useState({});
  const [filterDestino, setFilterDestino] = useState("Todos");
  const [filterCategoria, setFilterCategoria] = useState("Todas");
  const [filterIntensidad, setFilterIntensidad] = useState("Todas");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());

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
    return ["Todos", ...Array.from(unique).sort()];
  }, []);

  const categorias = useMemo(() => {
    const unique = new Set(ALL_ITEMS.map(it => it.categoria));
    return ["Todas", ...Array.from(unique).sort()];
  }, []);

  const filteredItems = useMemo(() => {
    return ALL_ITEMS.filter(it => {
      const matchDestino = filterDestino === "Todos" || it.destino === filterDestino;
      const matchCategoria = filterCategoria === "Todas" || it.categoria === filterCategoria;
      
      let matchIntensidad = true;
      if (filterIntensidad === "Fácil") {
        matchIntensidad = it.accesibilidad === "alta";
      } else if (filterIntensidad === "Moderado") {
        matchIntensidad = it.accesibilidad === "media";
      } else if (filterIntensidad === "Desafiante") {
        matchIntensidad = it.accesibilidad === "baja";
      }
      
      return matchDestino && matchCategoria && matchIntensidad;
    });
  }, [filterDestino, filterCategoria, filterIntensidad]);

  const myVotesCount = useMemo(() => {
    return voter ? (votes[voter] || []).length : 0;
  }, [votes, voter]);

  const topVoted = useMemo(() => {
    const sorted = [...ALL_ITEMS].sort((a, b) => {
      const aVotes = totalsByItem.get(a.id) || 0;
      const bVotes = totalsByItem.get(b.id) || 0;
      return bVotes - aVotes;
    });
    return sorted.slice(0, 5);
  }, [totalsByItem]);

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

  function openLinks(item) {
    const links = item.links_utiles || item.links || [];
    if (links.length > 0) {
      setSelectedItem({...item, links: links});
      setIsModalOpen(true);
    }
  }
  
  function toggleDescription(id) {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  const destinoEmoji = {
    "Cancún": "🏖️",
    "Cozumel": "🤿",
    "Playa del Carmen": "🌴"
  };
  
  // Get image URL - prioridad: real URLs > picsum fallback
  function getImageUrl(nombre, id, imageUrls) {
    // Si hay URLs reales de SerpApi, usar la primera
    if (imageUrls && imageUrls.length > 0) {
      return imageUrls[0];
    }
    
    // Fallback: picsum.photos con seed determinístico
    const seed = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return `https://picsum.photos/seed/${seed}/400/300`;
  }
  
  // Fallback gradients por categoría
  function getCategoryGradient(categoria, nombre) {
    const lower = (categoria + nombre).toLowerCase();
    
    if (lower.includes('playa') || lower.includes('beach')) {
      return 'from-sky-200 via-blue-300 to-cyan-400';
    }
    if (lower.includes('snorkel') || lower.includes('buceo') || lower.includes('diving')) {
      return 'from-blue-300 via-cyan-400 to-teal-500';
    }
    if (lower.includes('cenote')) {
      return 'from-emerald-300 via-teal-400 to-cyan-500';
    }
    if (lower.includes('museo') || lower.includes('cultura') || lower.includes('arqueolog')) {
      return 'from-amber-200 via-orange-300 to-yellow-400';
    }
    if (lower.includes('gastronom') || lower.includes('restaurante') || lower.includes('comida')) {
      return 'from-rose-300 via-pink-400 to-red-400';
    }
    if (lower.includes('tour') || lower.includes('excursion') || lower.includes('aventura')) {
      return 'from-purple-300 via-violet-400 to-indigo-400';
    }
    
    return 'from-cyan-200 via-blue-300 to-teal-400';
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* HEADER - Sticky with collapsible filters */}
      <div className="sticky top-0 bg-white shadow-lg z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
          {/* Top row - always visible */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                <Waves className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600 flex-shrink-0" />
                <span className="leading-tight">Votación Caribe</span>
              </h1>
              {voter && (
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-cyan-700">{voter}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    <span>{myVotesCount} votados</span>
                  </span>
                </p>
              )}
            </div>
            
            <Select onValueChange={setVoter} value={voter}>
              <SelectTrigger className="w-full sm:w-[200px] border-2 border-cyan-200 hover:border-cyan-400 transition-colors h-11">
                <SelectValue placeholder="👤 Tu nombre" />
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

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="w-full mt-3 sm:hidden flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-lg border-2 border-cyan-200"
          >
            <span className="text-sm font-semibold text-slate-700">
              Filtros ({filteredItems.length} de {ALL_ITEMS.length})
            </span>
            {filtersExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {/* Filters - Collapsible on mobile, always visible on desktop */}
          <div className={`
            ${filtersExpanded ? 'flex' : 'hidden'} sm:flex
            flex-col sm:flex-row gap-3 mt-3 sm:mt-4
          `}>
            <Select onValueChange={setFilterDestino} value={filterDestino}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-300 h-10">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {destinos.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "Todos" ? "📍 Todos" : `${destinoEmoji[d]} ${d}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setFilterCategoria} value={filterCategoria}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white border-slate-300 h-10">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {categorias.map((c) => (
                  <SelectItem key={c} value={c} className="text-sm">
                    {c === "Todas" ? "⭐ Todas" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setFilterIntensidad} value={filterIntensidad}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-300 h-10">
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Fácil">❤️ Para Todos</SelectItem>
                <SelectItem value="Moderado">👥 Moderado</SelectItem>
                <SelectItem value="Desafiante">🔥 Aventureros</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-center bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-2 rounded-lg border-2 border-cyan-200 h-10">
              <span className="font-bold text-cyan-700 text-sm">{filteredItems.length}</span>
              <span className="mx-1 text-slate-500 text-sm">de</span>
              <span className="font-bold text-blue-700 text-sm">{ALL_ITEMS.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP VOTED SECTION */}
      {topVoted.some(it => (totalsByItem.get(it.id) || 0) > 0) && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-3 sm:p-4 border-2 border-yellow-200 shadow-md">
            <h2 className="text-base sm:text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              Top 5 Más Votados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {topVoted.map((it, idx) => {
                const votes = totalsByItem.get(it.id) || 0;
                if (votes === 0) return null;
                return (
                  <div key={it.id} className="bg-white rounded-lg p-3 shadow-sm border border-amber-200">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl font-bold text-amber-600">#{idx + 1}</span>
                      <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {votes} 🗳️
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 line-clamp-2">{it.nombre}</p>
                    <p className="text-xs text-slate-500 mt-1">{destinoEmoji[it.destino]} {it.destino}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONTENT CARDS - Material Design */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((it) => {
            const myVoted = voterHasVotedIds.has(it.id);
            const total = totalsByItem.get(it.id) || 0;
            const links = it.links_utiles || it.links || [];
            const hasLinks = links.length > 0;
            const isExpanded = expandedDescriptions.has(it.id);
            const descripcion = cleanMarkdown(it.descripcion) || "";
            const shouldTruncate = descripcion.length > 150;
            
            return (
              <Card 
                key={it.id} 
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  myVoted ? 'ring-4 ring-blue-400 shadow-xl' : 'hover:scale-[1.02]'
                }`}
              >
                {/* Image Carousel o imagen única */}
                <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                  {it.image_urls && it.image_urls.length > 0 ? (
                    <ImageCarousel 
                      images={it.image_urls} 
                      nombre={it.nombre}
                      destino={it.destino}
                    />
                  ) : (
                    <img
                      src={getImageUrl(it.nombre, it.id, null)}
                      alt={it.nombre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  )}
                  {/* Fallback - Color-coded gradient */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(it.categoria, it.nombre)} flex items-center justify-center`} 
                    style={{display: it.image_urls && it.image_urls.length > 0 ? 'none' : 'none'}}
                  >
                    <div className="text-7xl opacity-40 drop-shadow-lg">
                      {destinoEmoji[it.destino]}
                    </div>
                  </div>
                  {/* Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/95 backdrop-blur-sm text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg border border-slate-200">
                      {destinoEmoji[it.destino]} {it.destino}
                    </span>
                  </div>
                  
                  <div className="absolute top-2 right-2 flex gap-2">
                    {myVoted && (
                      <div className="bg-blue-500 text-white rounded-full p-1.5 sm:p-2 shadow-lg animate-pulse">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    )}
                    <span className="bg-cyan-600 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                      {total} 🗳️
                    </span>
                  </div>

                  {/* BOTÓN DE INFO - siempre visible si hay algo que mostrar */}
                  {(hasLinks || (it.requisitos_especificos && it.requisitos_especificos.length > 3)) && (
                    <button
                      onClick={() => openLinks(it)}
                      className="absolute bottom-2 right-2 bg-cyan-600 hover:bg-cyan-700 text-white p-2.5 rounded-full shadow-xl transition-all hover:scale-110 border-2 border-white animate-bounce"
                      title={hasLinks ? `Ver ${links.length} enlaces útiles` : "Ver más información"}
                    >
                      <Info className="w-5 h-5 sm:w-6 sm:h-6 font-bold" />
                    </button>
                  )}
                </div>

                <CardContent className="p-3 sm:p-5 space-y-3">
                  {/* Category + Title */}
                  <div>
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md">
                        {it.categoria}
                      </span>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-800 line-clamp-2 mb-2">
                      {it.nombre}
                    </h3>
                    
                    {/* EXPANDABLE DESCRIPTION */}
                    <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <p className={`${!isExpanded && shouldTruncate ? 'line-clamp-3' : ''}`}>
                        {descripcion}
                      </p>
                      {shouldTruncate && (
                        <button
                          onClick={() => toggleDescription(it.id)}
                          className="text-cyan-600 font-semibold hover:text-cyan-700 mt-1 text-xs flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>Ver menos <ChevronUp className="w-3 h-3" /></>
                          ) : (
                            <>Ver más <ChevronDown className="w-3 h-3" /></>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Intensity Indicator with SPECIFIC REQUIREMENTS */}
                  {it.intensidad && (
                    <IntensityIndicator 
                      intensidad={it.intensidad} 
                      accesibilidad={it.accesibilidad}
                      requisitos_especificos={it.requisitos_especificos}
                    />
                  )}

                  {/* Vote Button */}
                  <Button
                    variant={myVoted ? "default" : "outline"}
                    className={`w-full font-semibold transition-all duration-200 h-10 sm:h-11 text-sm sm:text-base ${
                      myVoted 
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg" 
                        : "hover:bg-cyan-50 hover:border-cyan-400 border-2"
                    }`}
                    onClick={() => toggleVote(it.id)}
                  >
                    {myVoted ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Votado
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Votar
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-4">🏝️</div>
            <p className="text-slate-500 text-base sm:text-lg font-medium">
              No hay lugares con estos filtros
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Intenta ajustar los filtros
            </p>
          </div>
        )}
      </div>

      {/* Links Modal */}
      <LinksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedItem} />
    </div>
  );
}
