# Whitepaper Arquitectónico: LP Product Discovery

## 1. Introducción y Visión General
Este documento expone las decisiones técnicas, patrones de diseño y justificaciones arquitectónicas que apliqué durante la construcción del proyecto **LP Product Discovery** (bajo la temática inmersiva de la "Ciudadela" de Rick & Morty). Abordé esta prueba integrando prácticas de grado empresarial, demostrando perfilamiento en el Front-End y garantizando una escalabilidad absoluta desde el día cero.

## 2. Decisiones Arquitectónicas y Herramientas

### Empleo de Webpack 5 sobre Vite/CRA
Decidí prescindir intencionalmente de frameworks automáticos o empaquetadores exprés (como Vite o Next.js). Construí e integré el entorno de **Webpack 5 + Babel** totalmente desde cero. Esta decisión no fue por falta de familiaridad con herramientas rápidas, sino con el objetivo explícito de **demostrar mis habilidades sólidas en minificación, manejo de AST, personalización total del proceso de desarrollo y fine-tuning del empaquetador**. Al dominar Webpack, logré inyectar plugins para extracción de CSS (`MiniCssExtractPlugin`), controlar los entornos con `dotenv-webpack` y manipular directamente la partición de módulos (*chunking*).

### Optimizaciones (Code-Splitting y Lazy Loading)
Aplicando mi experiencia en rendimiento, no serví la aplicación en un solo bloque estático. Implementé técnicas agresivas de **Code Splitting** a nivel de rutas, utilizando la API `React.lazy()` en conjunto con `Suspense`. Cada vista principal de la aplicación viaja a través del network únicamente cuando el usuario la solicita, manteniendo el flujo principal ligero y cumpliendo con métricas sanas de los *Core Web Vitals*.

### Configuración de Enrutamiento Manual
Basándome en mis patrones de experiencia directos, realicé la configuración de `react-router-dom` v7 de forma **completamente manual**, modelando las barreras de autenticación en la hidratación de estado puro. Diseñé un esquema de *Public* y *Private Routers* a medida, logrando tener un control central de accesos que no dependa ciegamente de librerías externas o middleware de caja negra.

### Mock de API para Formulario Dinámico (Resiliencia)
Durante la fase técnica, intenté integrar el endpoint del formulario proporcionado en la prueba (*dummyjson.com/c/e357-8ef8...*), sin embargo, dicho entorno se encontraba caído y no retornaba respuestas viables. En lugar de permitir que esto se convirtiera en un bloqueante, **decidí construir y servir mi propio Mock API** (simulación JSON a través de los estáticos locales de Webpack). Esto me garantizó cumplir al 100% el requerimiento de orquestar un "Schema-Driven UI" (Formularios Dinámicos construidos a tiempo de ejecución leyendo JSON puro validando obligatoriedades) sin depender de agentes inestables de terceros.

### Hibridación Estratégica (TypeScript + JavaScript)
Aposté por una arquitectura híbrida donde **TypeScript** dictamina toda la lógica de negocio (Slices de Redux, Endpoints, Hooks asíncronos y Modelos de datos), garantizando un tipado estricto y seguro en las tuberías de información. Como contraparte, utilicé **JavaScript (JSX)** nativo en los componentes puramente visuales, lo que acelera la iteración de la Interfaz de Usuario y reduce el exceso de verbosidad donde no es drásticamente necesaria.

### SEO Dinámico y Metadatos (React Helmet)
Para potenciar la indexación y la compartición de enlaces (Open Graph), implementé un sistema de "Head" reactivo. Utilicé `react-helmet-async` para inyectar metadatos dinámicos, de manera que cada monstruo o alienígena en su vista de `ProductDetail` actualiza programáticamente el título del navegador y su meta-descripción en base a los atributos locales de su especie y estatus.

### Integración de Backend con Supabase
Elegí agregar **Supabase** (Postgres + Auth + OAuth) como Backend-as-a-Service porque tengo una amplia y profunda experiencia profesional operándolo. La facilidad y seguridad que proporciona me permitió dotar al proyecto de un *feeling* completamente **real y premium**; los usuarios de esta prueba pueden crear cuentas en un entorno verídico de bases de datos o logearse instantáneamente con Google, superando con creces la experiencia de una simple persistencia falsa con `localStorage`.

### Mantenibilidad, Patrones Estrictos y CSS
- **Arquitectura Limpia**: Separé estrictamente los ámbitos del software. Aislé cualquier asincronía destructiva mediante Custom Hooks y pasé toda la gestión del estado a `@reduxjs/toolkit` y `RTK Query` para gozar de inmutabilidad y de una caché global contra bloqueístas rate-limits de Rick & Morty.
- **SCSS Modules**: Escribí variables exclusivas de SCSS Modules en lugar de ensuciar los componentes con clases sueltas. Esto aisla completamente los módulos, evitando dependencias cíclicas de estilos y permitiendo la escalabilidad infinita si colaboraran múltiples ingenieros.
- **Limpieza de "Magic Strings"**: Todo diccionario numérico o alfabético que fije el modelo de negocio fue extraído a la capa abstracta `src/constants/`, purificando mis componentes React para que actúen únicamente como pintores de la UI.

-- *Jasan Hernández.*
