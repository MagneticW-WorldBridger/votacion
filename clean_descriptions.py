#!/usr/bin/env python3
"""
Limpiar markdown links de todas las descripciones
"""

import json
import re

def clean_markdown(text):
    if not text:
        return text
    
    # Remover markdown links: [text](url) -> text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    
    # Remover citation links tipo [oai_citation:0‡domain.com]
    text = re.sub(r'\[oai_citation:\d+‡[^\]]+\]', '', text)
    
    return text.strip()

# Cargar datos
with open('src/app/enriched-places.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Limpiar descripciones
cleaned = 0
for place in data['places']:
    original = place.get('descripcion', '')
    cleaned_desc = clean_markdown(original)
    
    if original != cleaned_desc:
        place['descripcion'] = cleaned_desc
        cleaned += 1
        print(f"✅ {place['nombre']}")

# Guardar
with open('src/app/enriched-places.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n🎉 {cleaned} descripciones limpiadas")
