# Checkpoint: Características Premium Incorporadas

Este documento resume las mejoras de diseño, usabilidad, rendimiento y SEO implementadas en el portfolio y currículum vitae de Francisco Fernández. Todas las actualizaciones están completamente integradas, optimizadas en producción y subidas al repositorio de GitHub.

---

## 🎨 1. Diseño y Estética Visual (Premium Tier)

- **Color Corporativo Original:** Se respeta escrupulosamente el código de color de marca original `#7b1527` (granate) en el modo claro. Para el modo oscuro, se utiliza una variante más luminosa (`#E53b55`) que mantiene un contraste de alto nivel (WCAG AA) sin perder la identidad cromática.
- **Suavizado de Sombras y Pies de Página:**
  - El sombreado duro del footer se ha suavizado por completo.
  - El subfooter ahora cuenta con un fondo ligeramente grisáceo/rosado (`#faf5fa` en el tema claro) que enmarca visualmente los créditos de la web con gran sutileza.
- **Constelación Interactive con Colores de Google:**
  - Las partículas del fondo de la cabecera (Hero) ahora interpolan de forma dinámica entre los cuatro colores principales de Google: **Azul** (`#4285F4`), **Rojo** (`#EA4335`), **Amarillo** (`#FBBC05`) y **Verde** (`#34A853`).
  - La intensidad y opacidad de las partículas (nodos) y de las líneas de conexión se incrementaron en el modo oscuro para garantizar que la constelación resplandezca.
  - Se implementó un ajuste automático de contraste en modo claro que oscurece el tono amarillo (`rgb(218, 158, 5)`) para que las partículas nunca pierdan visibilidad sobre el fondo blanco.

---

## 💻 2. Experiencia de Usuario Interactiva (UX)

- **Cursor Interactivo con Seguimiento Magnético (Desktop):**
  - Se diseñó un cursor dinámico compuesto por un puntero central y un anillo seguidor que se desplaza aplicando interpolación física suave (`lerp`).
  - Al hacer hover sobre elementos clicables, el anillo exterior se expande un 50% y se tiñe de color primario translúcido.
  - Al hacer clic, el anillo se contrae para dar feedback físico.
  - **Inversión Inteligente de Contraste:** Si el cursor se sitúa sobre un elemento con fondo de color corporativo (como los botones principales), tanto el puntero como la anilla cambian automáticamente a **blanco de alto contraste** para no perderse visualmente.
  - **Optimización de Posicionamiento:** El cursor utiliza coordenadas `left`/`top` inline para evitar conflictos con las transformaciones de escala y rotación de Tailwind, garantizando una alineación perfecta en todo momento (incluso al hacer scroll profundo).
- **Efectos Hover Premium en Tarjetas:**
  - Las tarjetas de **Portfolio**, **Experiencia** e **Idiomas** se elevan `6px` verticalmente (`hover:-translate-y-1.5`) y emiten un suave resplandor perimetral difuso de color primario al 10%.
  - Se añade un anillo de contorno exterior sólido (`hover:border-primary hover:ring-2 hover:ring-primary/20`) que resalta las tarjetas sin provocar desplazamientos de interfaz (*jitter*).
  - Se corrigió el recorte lateral del slider del portfolio añadiendo padding compensado (`p-4 -m-4`), permitiendo que el resplandor y la elevación de las tarjetas de la primera fila no sean recortados por el contenedor `overflow-hidden`.

---

## 🔌 3. Integración con WordPress (Headless CMS)

- **Página de Política de Privacidad:**
  - Se creó la ruta Next.js `/politica-privacidad` totalmente integrada dentro del `DashboardLayout` (mantiene la barra lateral, cabecera y selector de tema).
  - Consume el HTML de forma dinámica de WordPress a través del helper `getPageBySlug`.
  - Cuenta con un texto de respaldo automático que asegura el renderizado de la página en caso de desconexión de la API.
- **Formateado de Tablas y Textos:**
  - Las tablas HTML provenientes de WordPress ahora se renderizan con un estilo tipo tarjeta flotante (bordes redondeados, colores de celda legibles y hover interactivo por filas).
  - Las tablas son **100% responsivas**, transformándose en contenedores con scroll horizontal en móviles para evitar que el diseño se rompa.
  - Las cabeceras y textos destacados se colorean de manera automática en el color de la marca.
- **Enlaces Clicables Directos (`mailto`):**
  - Una expresión regular dinámica con aserción retrospectiva (`lookbehind`) analiza el texto legal y convierte cualquier aparición de tu correo `info@disenadorenmalaga` (.es o .com) en un enlace directo `mailto:` con estilos corporativos, omitiendo aquellos que ya estén enlazados previamente en WordPress.
- **Estrategia Lingüística Nativa (Sin "Spanglish"):**
  - Se define como pauta fija que toda la web debe presentarse en el idioma nativo del usuario. 
  - Para la versión en español se descartan anglicismos y terminología anglosajona corporativa de tipo LinkedIn.
  - La terminología en inglés (como *AI Solutions Architect* o *Agentic Workflows*) se integrará única y exclusivamente en la versión traducida al inglés para mantener una pureza del idioma y profesionalidad del 100%.

---

## ⚙️ 4. SEO, Enrutamiento y Accesibilidad

- **SEO On-Page en Privacidad:** La página de políticas legales cuenta con metadatos estructurados (título descriptivo y meta-descripción) y se configuró explícitamente la directiva de robots **`noindex, follow`**, evitando que los buscadores la muestren en los resultados de búsqueda pero permitiendo el seguimiento de enlaces de retorno.
- **Enlaces Multiorigen:** Todos los enlaces del menú lateral y de la cabecera móvil se adaptan a la ruta activa. Si el usuario se encuentra en `/politica-privacidad`, hacer clic en un enlace de ancla (ej: *Portfolio*) lo redirige instantáneamente a la home y efectúa el scroll de ancla (`/#proyectos`) sin provocar bloqueos de navegación.
- **Botón Ascensor Altamente Visible:** El botón para volver arriba en pantallas móviles se amplió de tamaño (`p-3` e icono `size={20}`) y se le asignó un `z-[99]` y color blanco sólido (`text-white`) para garantizar que resalte por encima de cualquier capa en modo claro y oscuro.

---

## 🌓 5. Modo Oscuro y Adaptación Móvil/Responsive

- **Sistema Integrado de Modo Claro/Oscuro:**
  - El sitio cuenta con un sistema de alternancia de temas basado en CSS Variables (`:root` y `html.light`) en `globals.css`.
  - Guarda la preferencia en el `localStorage` del navegador y respeta las preferencias de color predeterminadas del sistema operativo del usuario en su primera visita.
  - El selector visual cuenta con iconos interactivos de sol/luna (`Sun`/`Moon`) y transiciones de color globales en todos los fondos y textos de la web.
- **Cabecera Móvil y Menú Desplegable:**
  - **Comportamiento Inteligente (Autohide):** La cabecera móvil detecta la dirección de scroll del usuario; se oculta automáticamente al deslizar hacia abajo para maximizar el área de lectura del currículum, y reaparece suavemente al hacer scroll hacia arriba.
  - **Logo Adaptativo al Tema:** El logo SVG del header móvil cambia dinámicamente: carga la versión con texto oscuro en modo claro (`New-Logo-Web-FF.svg`) y la versión con texto blanco en modo oscuro (`New-Logo-Web-FF-W.svg`), evitando problemas de invisibilidad.
  - **Transición de Despliegue de Menú:** Al presionar el botón de hamburguesa, el menú se despliega verticalmente empujando de manera fluida y suave (`transition-all duration-300`) el contenido inferior de la página a través de un ajuste dinámico de padding en la etiqueta `main`.

