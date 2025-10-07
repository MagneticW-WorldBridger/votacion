#!/usr/bin/env python3
"""
Add REAL LINKS from Brave Search research
"""

import json
from pathlib import Path

# REAL LINKS from our Brave Search research
REAL_LINKS = {
    "Playa Norte - Isla Mujeres": [
        {"titulo": "Island Life Mexico - Isla Mujeres Guide 2025", "url": "https://www.islandlifemexico.com/isla-mujeres-guide/", "descripcion": "Complete travel guide for Isla Mujeres with top activities"},
        {"titulo": "Xcaret - What to Do in Isla Mujeres", "url": "https://www.xcaret.com/en/what-to-do-in-isla-mujeres/", "descripcion": "Top activities and must-see spots in Isla Mujeres"},
        {"titulo": "TripAdvisor - 15 Best Things in Isla Mujeres", "url": "https://www.tripadvisor.com/Attractions-g150810-Activities-Isla_Mujeres_Yucatan_Peninsula.html", "descripcion": "Top-rated attractions and activities"}
    ],
    "Snorkel con Tortugas en Akumal": [
        {"titulo": "Fjords and Beaches - Swimming with Turtles 2025", "url": "https://www.fjordsandbeaches.com/turtles-in-akumal/", "descripcion": "Complete 2025 guide to swimming with turtles in Akumal"},
        {"titulo": "Viator - Akumal Turtle Snorkeling Tour", "url": "https://www.viator.com/tours/Playa-del-Carmen/Snorkeling-with-Turtles-in-Akumal-in-a-Small-Group/d5501-343229P1", "descripcion": "Half-day guided tour to snorkel with sea turtles"},
        {"titulo": "Ultimate Guide - 8 Steps for Akumal Turtles", "url": "https://www.janineintheworld.com/swimming-with-turtles-akumal-mexico-ultimate-guide/", "descripcion": "8 essential steps for an unforgettable turtle experience"}
    ],
    "Ruta de los Cenotes - Puerto Morelos": [
        {"titulo": "Travel Yucatan - Ruta de los Cenotes Guide", "url": "https://travelyucatan.com/ruta-de-los-cenotes-puerto-morelos-mexico/", "descripcion": "Complete guide with top cenote picks and activities"},
        {"titulo": "Anna Everywhere - Best Cenotes Puerto Morelos", "url": "https://annaeverywhere.com/ruta-de-los-cenotes/", "descripcion": "Detailed guide with tour info and recommendations"},
        {"titulo": "Mexican Caribbean - Cenotes Route Paradise", "url": "https://mexicancaribbean.travel/explore-the-cenotes-route-of-puerto-morelos-an-underground-paradise-in-the-mexican-caribbean/", "descripcion": "Swimming, snorkeling, diving, zip-lining in underground paradise"}
    ],
    "Arrecife Nacional de Puerto Morelos": [
        {"titulo": "Snorkeling Report - Puerto Morelos Guide", "url": "https://www.snorkeling-report.com/spot/snorkeling-puerto-morelos-mexico/", "descripcion": "Reef snorkeling with rays, turtles, barracudas and colorful fish"},
        {"titulo": "Destination Less Travel - 12 Tips for Snorkeling", "url": "https://destinationlesstravel.com/snorkeling-in-puerto-morelos/", "descripcion": "Best snorkeling spots, tours, and essential tips"}
    ],
    "Punta Sur Eco Beach Park": [
        {"titulo": "Cozumel Cruise Tours - Wild Side of Cozumel", "url": "https://www.cozumelcruisetours.com/post/other-side-of-cozumel-mexico", "descripcion": "Deserted beaches, blow holes, hidden caves, and wildlife"},
        {"titulo": "Viva La Travelista - Punta Sur Guide 2025", "url": "https://vivalatravelista.com/punta-sur-cozumel/", "descripcion": "Hidden gem with stunning natural beauty and Caribbean views"},
        {"titulo": "Deviating the Norm - Best Self-Guided Snorkeling", "url": "http://www.deviatingthenorm.com/blogarchive/2024/4/1/punta-sur-best-self-guided-snorkeling-in-cozumel", "descripcion": "Wildlife, lighthouse tower, and two epic snorkel locations"}
    ],
    "Playa Punta Morena (Lado Este)": [
        {"titulo": "Island Life Mexico - Best Cozumel Beaches", "url": "https://www.islandlifemexico.com/five-best-beaches-in-cozumel/", "descripcion": "Remote East Coast beaches without the crowds"},
        {"titulo": "Travel Safe Abroad - 12 Best Beaches Cozumel", "url": "https://www.travelsafe-abroad.com/best-beaches-in-cozumel/", "descripcion": "Guide to powder-soft sand beaches on eastern coast"}
    ],
    "Parque Los Fundadores": [
        {"titulo": "Viva Playa - Parque Fundadores Complete Guide", "url": "https://www.vivaplaya.net/viva/parque-fundadores-playa-del-carmen/", "descripcion": "Show times, Voladores de Papantla schedule, and activities"}
    ],
    "Cenote Siete Bocas": [
        {"titulo": "Mexican Caribbean - 10 Things Puerto Morelos", "url": "https://mexicancaribbean.travel/10-things-to-do-in-puerto-morelos-discover-the-charm-of-the-mexican-caribbean/", "descripcion": "Top activities including cenotes Verde Lucero, Siete Bocas, La Noria"}
    ],
    "Punta Esmeralda": [
        {"titulo": "BRIC Rental - Punta Esmeralda Wonder", "url": "https://www.bricrental.com/es/descubre-una-rara-maravilla-en-la-pintoresca-playa-punta-esmeralda-en-playa-del-carmen.htm", "descripcion": "Discover the rare freshwater cenote meeting the ocean"}
    ]
}

def main():
    # Load enriched data
    data_path = Path("src/app/enriched-places.json")
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Add links to matching places
    added_count = 0
    for place in data['places']:
        nombre = place.get('nombre', '')
        if nombre in REAL_LINKS:
            place['links_utiles'] = REAL_LINKS[nombre]
            added_count += 1
            print(f"✓ Added {len(REAL_LINKS[nombre])} links to: {nombre}")
    
    # Save updated data
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Added links to {added_count} places!")
    print(f"📁 Updated: {data_path}")

if __name__ == "__main__":
    main()

