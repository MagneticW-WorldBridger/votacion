# 🏝️ Votación Caribe Mexicano

**La app definitiva para que tu familia decida qué hacer en el Caribe!**

## 📊 Stats

- ✅ **98 lugares** curados con investigación real
- 🎯 **3 destinos**: Cancún (33), Cozumel (31), Playa del Carmen (34)
- 👨‍👩‍👧‍👦 **14 votantes** de la familia
- 🎨 **Sistema de intensidad** con 3 dimensiones (Energía, Emoción, Habilidad)
- 📸 **Fotos reales** vía Unsplash
- 🔗 **Links útiles** investigados con Brave Search
- ⚡ **Material Design** + Gestalt Psychology

## 🚀 Quick Start

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 💡 Cómo Usar

1. **Selecciona tu nombre** en el dropdown
2. **Filtra** por destino, categoría o intensidad
3. **Vota** por tus lugares favoritos (ilimitado!)
4. **Click en el ícono ℹ️** para ver links útiles
5. **Mira el Top 5** para ver lo más votado

## 🎯 Sistema de Intensidad

### Energía ⚡ (0-5)
- 0 = Relax total
- 5 = Alta energía

### Emoción 🌀 (0-5)
- 0 = Tranquilo
- 5 = Emocionante

### Habilidad ⭐ (0-5)
- 0 = Principiante
- 5 = Experto

### Accesibilidad
- ❤️ **Para Todos**: Perfecto para toda la familia
- 👥 **Moderado**: Requiere condición física promedio
- 🔥 **Aventureros**: Para los más intrépidos

## 📂 Archivos Importantes

- `src/app/vote-enhanced.js` - La app principal
- `src/app/consolidated-data.json` - Los 98 lugares con ratings
- `enrich_data.py` - Script para enriquecer data con crawl4ai
- `venv/` - Python environment para crawl4ai

## 🔄 Actualizar Data

```bash
source venv/bin/activate
python enrich_data.py
```

## 🎨 Design

- **Material Design**: Cards con elevación, colores intencionales
- **Gestalt Principles**: Proximidad, similaridad, continuación
- **Responsive**: Móvil → Tablet → Desktop (1 → 2 → 3 → 4 columnas)
- **Icons**: Lucide React (consistentes y modernos)
- **Typography**: Jerarquía clara, legible
- **Colors**: Cyan/Blue (caribeño), Green (accesible), Red (intenso)

## 🛠️ Tech Stack

- **Next.js 15** con Turbopack
- **React 18** con hooks
- **Tailwind CSS** para styling
- **shadcn/ui** para components
- **Lucide React** para iconos
- **Python + crawl4ai** para data enrichment

## 📸 Imágenes

Usa Unsplash con fallback a gradientes + emoji si falla la imagen.

## 🗳️ Votación

- **Ilimitado**: Vota por todos los que quieras
- **Toggle**: Click de nuevo para quitar voto
- **Personal**: Cada quien tiene su lista
- **Agregado**: Ves el total de todos

## 🎯 Por Qué Es Chingón

1. **Data Real**: Investigación con Brave Search, no inventada
2. **98 Lugares**: TODO incluido (original + nuevo research)
3. **Fotos Reales**: No placeholders pedorros
4. **Sistema Psicológico**: Energía/Emoción/Habilidad (no físico/vértigo/atlético)
5. **Para TODOS**: De abuelos a niños, cada quien encuentra algo
6. **Links Útiles**: Click y ve más info de cualquier lugar
7. **Top 5 Live**: Ve qué está ganando en tiempo real
8. **Bonito AF**: Material Design hecho bien

## 🚧 TODO (Future)

- [ ] Agregar más links por lugar
- [ ] Sistema de comentarios
- [ ] Exportar itinerario
- [ ] Integrar precios
- [ ] Weather data
- [ ] Mapa interactivo
- [ ] Compartir resultados

---

**Made with 💙 for the familia**
