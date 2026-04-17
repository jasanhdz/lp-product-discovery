# Whitepaper Arquitectónico: LP Product Discovery & Citadel Auth

## Introducción
Este documento detalla las decisiones técnicas y arquitectónicas que tomé durante el diseño y construcción del proyecto **LP Product Discovery**. Elegí dotar a la aplicación de un hilo conductor conceptual—la "Ciudadela" de Rick & Morty—para ir un paso más allá de los requisitos estándar, creando un sistema robusto, escalable e inmersivo. El reto nos exige un alto nivel de control del DOM y asincronía, y he abordado cada requerimiento pensando en un ciclo de vida propio de aplicaciones tipo "enterprise".

## Pila Tecnológica & Decisiones Core

Para demostrar mi dominio fundamental de las herramientas y evitar la dependencia forzada de "cajas negras" como Next.js o los andamiajes pre-hechos de Vite, decidí estructurar el proyecto utilizando configuraciones explícitas:

- **React 19 & React Router V7**: El núcleo de la aplicación utiliza componentes 100% funcionales (Hooks) minimizando el payload. Implementé `Suspense` y `Lazy Loading` para fraccionar código por rutas.
- **Transpilación Manual (Webpack 5 + Babel)**: Hice el *setup* completo del bundler desde cero. Esto me permitió un control granular sobre mis minificadores, separaciones de "chunks" y los *loaders* para resolver módulos de SCSS de manera nativa sin contaminaciones de variables globales.
- **Manejo de Estado Global y Caché**: `@reduxjs/toolkit` (RTK) y **RTK Query**. Implementar el consumo en bruto a la API de Rick & Morty conlleva el riesgo de topes de peticiones (*rate limiting*). RTK Query me garantizó inmutabilidad e instantáneo "refetch caching", centralizando los endpoints en un solo *Store*.
- **Backend as a Service (BaaS)**: Elegí utilizar **Supabase** de manera nativa (PostgreSQL + Auth) aportando funcionalidades reales de autenticación persistente y Google OAuth en un servidor en vivo. De tal modo, el registro y recuperación de sesiones es 100% verídico.

## 3 Principios de Código Aplicados

1. **Clean Code & Extracción Agresiva (HOCs y Hooks)**
   Mantuve limpias mis vistas. Implementé todo el proceso de recuperación de sesiones JWT en un *Higher-Order Component* asíncrono (`AuthProvider`), encapsulando la lectura del caché del navegador y bloqueando los intentos de la UI antes de conocer si un usuario es verídico.
   
2. **Cero Constantes de Código Duro (Hardcoded Strings)**
   En lugar de contaminar el JSX con diccionarios de datos, refactoricé todas las colecciones, configuraciones o "magic strings" a la carpeta de constantes lógicas (`src/constants/`).
   
3. **Internacionalización Adaptativa (i18n)**
   Bajo mi criterio de buenas prácticas para repositorios escalables, mantuve estricta y rígidamente todo el código base (variables, descripciones de commits, documentaciones asíncronas y tipos) en **Inglés**. Por paralelo, trasladé y localicé todo lo que concierne a UI (`frontend strings`) expuesto al usuario a nivel **Español**, adecuándolo al *lore* del universo en cuestión.

## Implementación Dinámica (Schema-Driven UI)

La solicitud exigió renderizar un formulario utilizando un Mock Dinámico. Aprovechando `JSON` servidos localmente por RTK Query, sistematicé un renderizador. El formulario no contiene `<inputs>` escritos a mano; iterativamente lee el diccionario y reacciona de forma automática en base a las dependencias inyectadas, forzando estado *isMandatory* en donde aplique. Esto es extremadamente útil para el desarrollo de dashboards escalables o multi-tenancy.

-- Jasan Hernández.
