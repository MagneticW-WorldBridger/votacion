/**
 * Script para obtener URLs de imágenes REALES de Google Images usando SerpApi
 * 
 * NECESITAS: SerpApi API Key (no la de Google Maps)
 * Get one at: https://serpapi.com/manage-api-key
 * 
 * Free tier: 100 búsquedas/mes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⚠️ PONER TU SERPAPI KEY AQUÍ (NO la de Google Maps)
const SERPAPI_KEY = process.env.SERPAPI_KEY || "YOUR_SERPAPI_KEY_HERE";

/**
 * Busca imágenes para un lugar usando SerpApi
 */
async function searchImages(placeName, location = "Mexico") {
  const query = `${placeName} ${location}`;
  const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&num=10`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const images = data.images_results || [];
    
    // Retornar las primeras 6 URLs de imágenes
    return images.slice(0, 6).map(img => img.original || img.thumbnail).filter(url => url);
  } catch (error) {
    console.error(`❌ Error buscando imágenes para "${placeName}":`, error.message);
    return [];
  }
}

/**
 * Procesa todos los lugares y agrega URLs de imágenes reales
 */
async function enrichWithRealImages() {
  console.log('📸 Buscando imágenes REALES con SerpApi...\n');
  
  // Leer el archivo de datos
  const dataPath = path.join(__dirname, 'src/app/enriched-places.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  let processed = 0;
  let total = data.places.length;
  
  // Procesar cada lugar (con rate limiting para no gastar todas las búsquedas)
  for (const place of data.places) {
    processed++;
    
    // Skip si ya tiene imágenes
    if (place.image_urls && place.image_urls.length > 0) {
      console.log(`⏭️  [${processed}/${total}] ${place.nombre} - ya tiene imágenes`);
      continue;
    }
    
    console.log(`🔍 [${processed}/${total}] Buscando imágenes para: ${place.nombre}`);
    
    // Construir query más específico
    const searchQuery = `${place.nombre} ${place.destino}`;
    const imageUrls = await searchImages(searchQuery);
    
    if (imageUrls.length > 0) {
      place.image_urls = imageUrls;
      console.log(`   ✅ Encontradas ${imageUrls.length} imágenes`);
      
      // GUARDAR DESPUÉS DE CADA LUGAR (por si se interrumpe)
      data.metadata = data.metadata || {};
      data.metadata.last_image_update = new Date().toISOString();
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    } else {
      console.log(`   ⚠️  No se encontraron imágenes`);
    }
    
    // Rate limiting: esperar 1 segundo entre búsquedas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n✅ Completado! ${processed} lugares procesados`);
  console.log(`📁 Archivo actualizado: ${dataPath}`);
  
  // Stats
  const withImages = data.places.filter(p => p.image_urls && p.image_urls.length > 0).length;
  console.log(`\n📊 Stats:`);
  console.log(`   Lugares con imágenes: ${withImages}/${total}`);
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  enrichWithRealImages()
    .then(() => console.log('\n🎉 ¡Listo!'))
    .catch(err => {
      console.error('\n💥 Error:', err);
      process.exit(1);
    });
}

export { searchImages, enrichWithRealImages };
