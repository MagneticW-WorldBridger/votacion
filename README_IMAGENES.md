# 📸 Cómo Agregar Imágenes REALES

## 🚨 TU GOOGLE MAPS API KEY NO FUNCIONA

La key que tienes (`AIzaSyDz6w55yhW8twmdBcmIRFeEZk_OiFVT7AU`) es de **Google Maps**, NO sirve para buscar imágenes.

## ✅ SOLUCIÓN: Usar SerpApi

### 1. Obtener API Key de SerpApi

1. Ve a: https://serpapi.com/manage-api-key
2. Crea una cuenta (gratis)
3. Copia tu API key
4. **Free tier**: 100 búsquedas/mes

### 2. Configurar la Key

```bash
export SERPAPI_KEY="tu_key_aqui"
```

O crea un archivo `.env` en la raíz:

```bash
SERPAPI_KEY=tu_key_aqui
```

### 3. Ejecutar el Script

```bash
node fetch_real_images.js
```

Este script:
- ✅ Busca imágenes REALES en Google Images
- ✅ Agrega las URLs al JSON (`image_urls`)
- ✅ Respeta rate limits (1 búsqueda/segundo)
- ✅ El frontend las usa automáticamente

### 4. Resultado

Cada lugar tendrá:

```json
{
  "nombre": "Playa Norte - Isla Mujeres",
  "destino": "Cancún",
  "image_urls": [
    "https://real-image-url-1.jpg",
    "https://real-image-url-2.jpg",
    "https://real-image-url-3.jpg"
  ]
}
```

El frontend usa `image_urls[0]` como imagen principal.

## 🔄 Alternativa: Usar URLs Directas

Si no quieres pagar por SerpApi, puedes agregar URLs manualmente en `enriched-places.json`:

```json
{
  "nombre": "Playa Norte - Isla Mujeres",
  "image_urls": [
    "https://ejemplo.com/imagen.jpg"
  ]
}
```

## 📊 Estado Actual

- **Sin SerpApi**: Usa picsum.photos (imágenes random pero consistentes)
- **Con SerpApi**: Usa imágenes REALES de Google Images

## 🎯 Próximos Pasos

1. Obtén tu SerpApi key
2. Corre `node fetch_real_images.js`
3. Espera ~2 minutos (98 lugares × 1 seg/cada uno)
4. ¡Listo! Recarga el frontend
