# LP Product Discovery (Citadel Portal)

Este repositorio aloja la solución técnica de frontend al reto planteado. La plataforma fue construida desde cero empleando metodologías modernas de desarrollo (React 19, Redux RTK, Supabase, SCSS Modules, Webpack).

👉 **[Consulta el Whitepaper de Arquitectura Aquí](./docs/WHITEPAPER.md)** para entender a fondo la justificación técnica, patrones de diseño implementados y limpieza de código.

## Enlaces e Información Obligatoria

- **Repositorio de GitHub**: [https://github.com/jasanhernandez/lp-product-discovery](https://github.com/jasanhernandez/lp-product-discovery)
- **Despliegue de Producción (Vercel)**: [https://lp-product-discovery.vercel.app](https://lp-product-discovery.vercel.app/)

### Permisos Otorgados (Evaluadores)
Se ha extendido el acceso a este repositorio a los correos obligatorios:
- `daalvaradol@liverpool.com.mx`
- `dteofilom@liverpool.com.mx`

---

## Levantamiento del Entorno Local

Para correr el proyecto tal cual fue desarrollado, asegúrate de tener instalados los siguientes requerimientos del sistema:

- **Node.js**: >= 18.0.0 (Recomendado o superior a v18)
- **NPM**: >= 9.x.x o Yarn / PNPM

### Paso 1: Instalación de Dependencias

1. Clona este repositorio y navega a la carpeta root:

   ```bash
   git clone <URL_REPOSITORIO>
   cd lp-product-discovery
   ```

2. Instala todos los paquetes del sistema, incluyendo transpiladores (Babel) y bundlers (Webpack), corriendo:
   ```bash
   npm install
   ```

### Paso 2: Variables de Entorno (Supabase Auth)

Dado que agregamos características extras como Auth Persistente (Login regular y con Google OAuth) y una Whitelist personal de los personajes favoritos con Base de Datos, el proyecto requiere de `Supabase`.

Asegúrate de configurar o tener en la raíz de la carpeta un archivo `.env` configurado:

```env
REACT_APP_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Paso 3: Levantar Servidor Webpack Local

Ejecuta el script `dev` el cual levantará un servidor de live-reload con Webpack:

```bash
npm run dev
```

El portal interdimensional estará accesible en tu navegador abriendo **http://localhost:8080**.

---

## Comandos Adicionales Incluidos

- `npm run build` : Produce el bondle minificado para Producción.
- `npm run build:analyze` : Genera `stats.json` para inspeccionar tiempos y tree-shaking interno.
- `npm run format` : Formatea de manera universal todos los archivos fuente bajo las reglas estrictas de Prettier.
- `npm run lint` / `npm run lint:fix` : Evalúa code style usando ESLint para JS y TS.
