# Guía de Modificación de Títulos y Traducciones

Esta guía detalla la ubicación exacta de todos los títulos de sección y textos estáticos traducidos en el frontend para que puedas localizarlos y modificarlos fácilmente en el futuro.

---

## 1. Menú Lateral y Tarjeta de Contratación (CTA)
Todos los enlaces de navegación, los modos de tema (claro/oscuro) y los textos de la tarjeta de contratación se gestionan en:
*   **Archivo:** [src/components/DashboardLayout.tsx](file:///c:/Users/Paco/Documents/GitHub/Curso-de-JavaScript/Practicas Paco Fernandez/CV/cv-francisco/src/components/DashboardLayout.tsx)
*   **Variable:** `translations` (líneas 37-67)

### Modificables:
```typescript
const translations = {
  es: {
    portfolio: 'Portfolio',
    experiencia: 'Experiencia',
    formacion: 'Formación',
    habilidades: 'Habilidades',
    otrasHabilidades: 'Otras Habilidades',
    idiomas: 'Idiomas',
    contacto: 'Contacto',
    modoClaro: 'Modo Claro',
    modoOscuro: 'Modo Oscuro',
    disponible: 'Disponible para trabajar',
    ctaPregunta: '¿Buscas impulsar tu proyecto o reforzar tu equipo?',
    ctaBoton: '¡Hablemos!',
    // ...
  },
  en: {
    portfolio: 'Portfolio',
    // ... (Equivalentes en inglés)
  }
};
```

---

## 2. Pie de Página (Footer)
Los textos de derechos reservados, el rol profesional y las políticas del footer se gestionan en:
*   **Archivo:** [src/components/Footer.tsx](file:///c:/Users/Paco/Documents/GitHub/Curso-de-JavaScript/Practicas Paco Fernandez/CV/cv-francisco/src/components/Footer.tsx)
*   **Variable:** `translations` (líneas 14-27)

### Modificables:
```typescript
const translations = {
  es: {
    privacyPolicy: "Política de privacidad",
    cookiesPolicy: "Política de cookies",
    rightsReserved: "Todos los derechos reservados.",
    role: "Fullstack Developer",
  },
  en: {
    // ... (Equivalentes en inglés)
  }
};
```

---

## 3. Títulos H2 de las Secciones del Cuerpo
Los títulos principales de cada sección se configuran individualmente dentro de sus respectivos componentes para sincronizarse con el idioma:

### A. Experiencia
*   **Archivo:** [src/components/sections/ExperienceSection.tsx](file:///c:/Users/Paco/Documents/GitHub/Curso-de-JavaScript/Practicas Paco Fernandez/CV/cv-francisco/src/components/sections/ExperienceSection.tsx)
*   **Variable:** `title` (línea 9)

### B. Formación
*   **Archivo:** [src/components/sections/EducationSection.tsx](file:///c:/Users/Paco/Documents/GitHub/Curso-de-JavaScript/Practicas Paco Fernandez/CV/cv-francisco/src/components/sections/EducationSection.tsx)
*   **Variable:** `t` (líneas 10-13) (controla "Formación Reglada" y "Formación no reglada y cursos").

### C. Habilidades y "Otras Habilidades"
*   **Archivo:** [src/components/sections/SkillsSection.tsx](file:///c:/Users/Paco/Documents/GitHub/Curso-de-JavaScript/Practicas Paco Fernandez/CV/cv-francisco/src/components/sections/SkillsSection.tsx)
*   **Variable:** `t` (líneas 16-19) (controla el título principal "Habilidades" y el subtítulo "Otras Habilidades").

#### Traducción de Categorías de WordPress (Taxonomías):
*   **Variable:** `categoryTranslations` (líneas 21-32)
*   *Nota:* Aquí es donde se traducen los nombres que vienen de WordPress como "Diseño y Desarrollo Web" o "IA Generativa y Agentes".

### D. Otras habilidades (Habilidades Blandas / Soft Skills)
*   **Archivo:** [src/components/sections/SoftSkillsSection.tsx](file:///c:/Users/Paco/Documents/GitHub/Curso-de-JavaScript/Practicas Paco Fernandez/CV/cv-francisco/src/components/sections/SoftSkillsSection.tsx)
*   **Código:** Cabecera H2 (líneas 80-82) que comprueba `locale === 'en' ? 'Other Skills' : 'Otras Habilidades'`.

### E. Idiomas
*   **Archivo:** [src/components/sections/LanguagesSection.tsx](file:///c:/Users/Paco/Documents/GitHub/Curso-de-JavaScript/Practicas Paco Fernandez/CV/cv-francisco/src/components/sections/LanguagesSection.tsx)
*   **Variable:** `title` (línea 10)

### F. Portfolio (Paginadores y Título)
*   **Archivo:** [src/components/sections/PortfolioSection.tsx](file:///c:/Users/Paco/Documents/GitHub/Curso-de-JavaScript/Practicas Paco Fernandez/CV/cv-francisco/src/components/sections/PortfolioSection.tsx)
*   **Variable:** `translations` (líneas 25-36) (controla "Portfolio", "Página anterior", "Página siguiente" y "Ir a la página").

---

## 4. Portada (Hero)
El saludo dinámico delante de tu nombre se gestiona en:
*   **Archivo:** [src/components/sections/HeroSection.tsx](file:///c:/Users/Paco/Documents/GitHub/Curso-de-JavaScript/Practicas Paco Fernandez/CV/cv-francisco/src/components/sections/HeroSection.tsx)
*   **Variable:** `greeting` (línea 11) (imprime "¡Hola! Soy " o "Hi! I'm ").

---

## 5. Formulario de Contacto
Todos los textos del formulario, etiquetas, mensajes de error, mensajes de éxito y campos GDPR se gestionan en:
*   **Archivo:** [src/components/sections/ContactSection.tsx](file:///c:/Users/Paco/Documents/GitHub/Curso-de-JavaScript/Practicas Paco Fernandez/CV/cv-francisco/src/components/sections/ContactSection.tsx)
*   **Variable:** `translations` (líneas 19-67)

---

## 6. Política de Privacidad (Textos de Fallback)
Los textos por defecto que se muestran en caso de que la página de política de privacidad no se pueda cargar desde la API de WordPress se encuentran en:
*   **Archivo:** [src/app/[locale]/politica-privacidad/page.tsx](file:///c:/Users/Paco/Documents/GitHub/Curso-de-JavaScript/Practicas Paco Fernandez/CV/cv-francisco/src/app/[locale]/politica-privacidad/page.tsx)
*   **Variables:** `defaultContentEs` y `defaultContentEn` (líneas 21-39).
