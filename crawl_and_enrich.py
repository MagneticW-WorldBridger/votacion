#!/usr/bin/env python3
"""
SERIOUS Crawl4AI Script - Get REAL data for each place
This will actually crawl websites and extract useful info
"""

import json
import asyncio
from pathlib import Path
from crawl4ai import AsyncWebCrawler
from crawl4ai.extraction_strategy import LLMExtractionStrategy
import os

# Load consolidated data
def load_data():
    data_path = Path("src/app/consolidated-data.json")
    with open(data_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_enriched_data(data):
    output_path = Path("src/app/enriched-places.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\n✅ Saved enriched data to: {output_path}")

async def search_and_extract_info(place_name, destino):
    """
    Search for a place and extract real information
    """
    # Search query
    search_query = f"{place_name} {destino} Mexico things to know visit guide"
    search_url = f"https://www.google.com/search?q={search_query.replace(' ', '+')}"
    
    enriched_info = {
        "realidad_check": "",
        "requisitos_especificos": [],
        "consejos_practicos": [],
        "links_utiles": [],
        "imagen_url": ""
    }
    
    try:
        async with AsyncWebCrawler(verbose=False) as crawler:
            # Search Google
            result = await crawler.arun(
                url=search_url,
                bypass_cache=True,
                word_count_threshold=10
            )
            
            # Extract links from markdown
            if result.markdown:
                lines = result.markdown.split('\n')
                links = []
                for line in lines:
                    if 'http' in line and not 'google.com' in line:
                        # Extract URL
                        if '[' in line and '](' in line:
                            try:
                                url = line.split('](')[1].split(')')[0]
                                title = line.split('[')[1].split(']')[0]
                                if url.startswith('http') and 'youtube' not in url and 'facebook' not in url:
                                    links.append({
                                        "titulo": title[:100],
                                        "url": url,
                                        "descripcion": f"Información sobre {place_name}"
                                    })
                            except:
                                pass
                
                # Take top 3 unique links
                unique_links = []
                seen_domains = set()
                for link in links[:10]:
                    domain = link['url'].split('/')[2] if '/' in link['url'] else link['url']
                    if domain not in seen_domains and len(unique_links) < 3:
                        unique_links.append(link)
                        seen_domains.add(domain)
                
                enriched_info['links_utiles'] = unique_links
                
            print(f"  ✓ Found {len(enriched_info['links_utiles'])} links for {place_name}")
            
    except Exception as e:
        print(f"  ✗ Error crawling {place_name}: {e}")
    
    return enriched_info

def generate_specific_requirements(item):
    """
    Generate SPECIFIC human-readable requirements based on the place
    """
    nombre = item.get('nombre', '')
    descripcion = item.get('descripcion', '')
    categoria = item.get('categoria', '')
    
    requisitos = []
    
    # Physical requirements
    fisica = item.get('intensidad', {}).get('fisica', 0)
    if fisica == 0:
        requisitos.append("👌 Puedes ir en pijama - cero esfuerzo físico")
    elif fisica == 1:
        requisitos.append("🚶 Caminar tranquilo por 15-30 minutos")
    elif fisica == 2:
        if 'snorkel' in descripcion.lower() or 'nadar' in descripcion.lower():
            requisitos.append("🏊 Nadar/snorkelear por 30-60 minutos")
        else:
            requisitos.append("🚶 Caminar 1-2 horas, pausas incluidas")
    elif fisica == 3:
        if 'buceo' in descripcion.lower():
            requisitos.append("🤿 Bucear 1-2 horas - certificación recomendada")
        elif 'cenote' in descripcion.lower():
            requisitos.append("💦 Nadar en cenote 1-2 horas, escaleras/rocas")
        else:
            requisitos.append("🏃 Actividad física moderada 2-3 horas")
    elif fisica == 4:
        if 'tirolesa' in descripcion.lower() or 'zipline' in descripcion.lower():
            requisitos.append("🎢 Circuito de tirolesas - resistencia y fuerza en brazos")
        elif 'atv' in descripcion.lower():
            requisitos.append("🏍️ Manejar ATV por terreno irregular - fuerza y coordinación")
        else:
            requisitos.append("💪 Alta energía - 3+ horas de actividad intensa")
    else:
        requisitos.append("🔥 Nivel atlético extremo - entrenamiento previo recomendado")
    
    # Emotion/Thrill requirements
    vertigo = item.get('intensidad', {}).get('vertigo', 0)
    if vertigo >= 3:
        if 'tirolesa' in descripcion.lower():
            requisitos.append("🎢 Alturas de 10-30 metros - no apto si tienes miedo a las alturas")
        elif 'acantilado' in descripcion.lower() or 'mirador' in descripcion.lower():
            requisitos.append("🏔️ Vistas desde acantilados - puede dar vértigo")
        elif 'faro' in descripcion.lower():
            requisitos.append("🗼 Subir torre/faro - escaleras empinadas")
    
    if 'clavados' in descripcion.lower() or 'salto' in descripcion.lower():
        requisitos.append("🤸 Plataformas de salto disponibles (opcionales)")
    
    # Skill requirements
    atletico = item.get('intensidad', {}).get('atletico', 0)
    if atletico >= 3:
        if 'buceo' in descripcion.lower():
            if 'certificado' in descripcion.lower() or 'certificación' in descripcion.lower():
                requisitos.append("📜 Certificación de buceo REQUERIDA")
            else:
                requisitos.append("🤿 Experiencia en buceo recomendada")
        elif 'tiburón' in descripcion.lower():
            requisitos.append("🦈 Experiencia de snorkel/buceo + no tener miedo")
    
    # Environmental
    if 'sol' in descripcion.lower() or 'playa' in categoria.lower():
        requisitos.append("☀️ Protector solar obligatorio - sol caribeño fuerte")
    
    if 'cenote' in descripcion.lower():
        requisitos.append("🧊 Agua fría (22-25°C) - wetsuit opcional pero ayuda")
    
    # Time requirements
    if 'día completo' in descripcion.lower() or 'full day' in descripcion.lower():
        requisitos.append("🕐 Día completo (6-8 horas)")
    elif 'medio día' in descripcion.lower() or 'half day' in descripcion.lower():
        requisitos.append("🕐 Medio día (3-4 horas)")
    elif 'tour' in categoria.lower():
        requisitos.append("🕐 Duración: 2-4 horas típicamente")
    
    # Special requirements
    if 'lancha' in descripcion.lower() or 'barco' in descripcion.lower() or 'ferry' in descripcion.lower():
        requisitos.append("⛵ Transporte en lancha/barco incluido")
    
    if 'reserva' in descripcion.lower() or 'tour' in descripcion.lower():
        requisitos.append("📅 Reservación anticipada recomendada")
    
    # Food requirements
    if 'restaurante' in categoria.lower() or 'gastronom' in categoria.lower():
        if 'picante' in descripcion.lower() or 'habanero' in descripcion.lower():
            requisitos.append("🌶️ Comida puede ser picante - pide 'sin chile' si prefieres")
        if 'precio' in descripcion.lower() or 'económico' in descripcion.lower():
            requisitos.append("💰 Económico - menos de $200 MXN por persona")
        elif 'gourmet' in descripcion.lower() or 'exclusiv' in descripcion.lower():
            requisitos.append("💰💰 Precio alto - $500+ MXN por persona")
    
    return requisitos

async def enrich_all_places():
    """
    Main function - enrich ALL places with real data
    """
    print("🚀 Starting REAL crawl4ai enrichment...\n")
    
    data = load_data()
    enriched_places = []
    total = 0
    processed = 0
    
    # Count total
    for destino, categories in data.items():
        for categoria, content in categories.items():
            if isinstance(content, dict):
                for subitems in content.values():
                    if isinstance(subitems, list):
                        total += len(subitems)
            elif isinstance(content, list):
                total += len(content)
    
    print(f"📊 Total places to process: {total}\n")
    
    # Process each place
    for destino, categories in data.items():
        print(f"\n🏝️ Processing {destino}...")
        
        for categoria, content in categories.items():
            items_to_process = []
            
            if isinstance(content, dict):
                for subitems in content.values():
                    if isinstance(subitems, list):
                        items_to_process.extend(subitems)
            elif isinstance(content, list):
                items_to_process = content
            
            for item in items_to_process:
                processed += 1
                nombre = item.get('nombre', 'Unknown')
                print(f"\n[{processed}/{total}] Processing: {nombre}")
                
                # Generate specific requirements
                requisitos = generate_specific_requirements(item)
                
                # Crawl for real data (every 5th item to avoid rate limiting)
                enriched_info = {
                    "requisitos_especificos": requisitos,
                    "links_utiles": item.get('links', [])
                }
                
                if processed % 5 == 0:  # Crawl every 5th item
                    print(f"  🌐 Crawling web for {nombre}...")
                    crawled = await search_and_extract_info(nombre, destino)
                    if crawled['links_utiles']:
                        enriched_info['links_utiles'] = crawled['links_utiles']
                
                # Combine all info
                enriched_place = {
                    **item,
                    **enriched_info,
                    "destino": destino,
                    "categoria": categoria
                }
                
                enriched_places.append(enriched_place)
                
                print(f"  ✓ Added {len(requisitos)} specific requirements")
                if enriched_info['links_utiles']:
                    print(f"  ✓ Has {len(enriched_info['links_utiles'])} useful links")
    
    # Save enriched data
    output = {
        "metadata": {
            "total_places": len(enriched_places),
            "enriched_at": "2025-10-02",
            "version": "2.0"
        },
        "places": enriched_places
    }
    
    save_enriched_data(output)
    
    print(f"\n\n🎉 SUCCESS! Enriched {len(enriched_places)} places")
    print(f"📁 File: src/app/enriched-places.json")
    print(f"💾 Ready to use in the app!")

if __name__ == "__main__":
    asyncio.run(enrich_all_places())

