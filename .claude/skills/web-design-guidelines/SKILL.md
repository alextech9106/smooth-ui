---
name: web-design-guidelines
description: Revisa código de UI frente a las Web Interface Guidelines. Úsala cuando pidan "revisa mi UI", "comprueba la accesibilidad", "audita el diseño", "revisa la UX" o "comprueba mi sitio frente a las buenas prácticas".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <archivo-o-patrón>
---

# Web Interface Guidelines

Revisa archivos para comprobar que cumplen las Web Interface Guidelines.

## Cómo funciona

1. Descarga las guías más recientes desde la URL de origen de abajo
2. Lee los archivos indicados (o pide al usuario los archivos o el patrón)
3. Comprueba todas las reglas de las guías descargadas
4. Muestra los hallazgos en el formato breve `archivo:línea`

## Origen de las guías

Descarga las guías actualizadas antes de cada revisión:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Usa WebFetch para obtener las reglas más recientes. El contenido descargado incluye todas las reglas y las
instrucciones del formato de salida.

## Uso

Cuando el usuario indique un archivo o un patrón como argumento:
1. Descarga las guías desde la URL de origen de arriba
2. Lee los archivos indicados
3. Aplica todas las reglas de las guías descargadas
4. Muestra los hallazgos con el formato que indican las guías

Si no se indica ningún archivo, pregunta al usuario qué archivos revisar.
