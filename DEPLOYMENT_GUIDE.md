# 🚀 Guía de Despliegue de Template de Belleza

## 📋 Resumen Ejecutivo

Esta aplicación ha sido convertida en un **sistema de plantillas reutilizable** para generar rápidamente aplicaciones personalizadas para peluquerías, barberías y clínicas estéticas. El sistema permite despliegues personalizados en menos de 30 minutos.

## 🎯 Proceso de Despliegue para Cliente Nuevo

### ✅ **PASO 1: Recopilación de Información del Cliente**

Antes de iniciar el despliegue, recopila la siguiente información del cliente:

#### **Información Básica del Negocio**
- [ ] **Nombre del negocio**: (ej: "Bella Vista Salon")
- [ ] **Nombre corto/Iniciales**: (ej: "BV") - para logos pequeños
- [ ] **Eslogan/Tagline**: (ej: "Elegancia y sofisticación")
- [ ] **Tipo de negocio**: Peluquería / Barbería / Clínica Estética
- [ ] **Año de establecimiento**: (opcional)
- [ ] **Descripción del negocio**: 2-3 oraciones sobre la filosofía/misión

#### **Información de Contacto**
- [ ] **Teléfono principal**: +XX XXX XXX XXX
- [ ] **Email de contacto**: contacto@negocio.com
- [ ] **WhatsApp**: (si es diferente del teléfono)
- [ ] **Instagram**: @usuario_instagram
- [ ] **Facebook**: (opcional)

#### **Ubicación y Horarios**
- [ ] **Dirección completa**: Calle, número, barrio
- [ ] **Ciudad**: 
- [ ] **País**:
- [ ] **Horarios de atención**: Por cada día de la semana
  - Lunes: HH:MM - HH:MM
  - Martes: HH:MM - HH:MM
  - ... (hasta domingo)

#### **Servicios y Precios**
Para cada servicio, recopilar:
- [ ] **Nombre del servicio**
- [ ] **Precio** (solo número, sin símbolo de moneda)
- [ ] **Duración estimada** (ej: "45 min")
- [ ] **Descripción corta**
- [ ] **Categoría** (corte/color/tratamiento/etc.)

#### **Configuración de Moneda**
- [ ] **Símbolo de moneda**: $ / € / etc.
- [ ] **Código de moneda**: USD / EUR / UYU / etc.
- [ ] **Posición**: antes ($25) o después (25€)

#### **Estilo Visual Preferido**
- [ ] **Estilo de landing seleccionado**:
  - **Elegant** (sofisticado, minimalista)
  - **Modern** (contemporáneo, limpio)  
  - **Glamour** (lujoso, dorado)
  - **Industrial** (urbano, moderno) - solo barberías
  - **Vintage** (clásico, tradicional) - solo barberías

#### **Colores Personalizados** (opcional)
- [ ] **Color primario**: #HEXCODE
- [ ] **Color secundario**: #HEXCODE  
- [ ] **Color de acento**: #HEXCODE

### ✅ **PASO 2: Configuración Técnica**

#### **2.1. Clonar y Configurar el Repositorio**
```bash
# Clonar el repositorio template
git clone https://github.com/tu-repo/beauty-template.git nuevo-cliente-app
cd nuevo-cliente-app

# Instalar dependencias
npm install
```

#### **2.2. Crear Configuración del Cliente**
1. **Duplicar archivo de ejemplo:**
   ```bash
   cp src/config/business-examples.ts src/config/client-config.ts
   ```

2. **Editar `src/config/client-config.ts`:**
   ```typescript
   import type { BusinessConfig } from './business.config';

   export const CLIENT_CONFIG: BusinessConfig = {
     name: "NOMBRE_DEL_CLIENTE",
     shortName: "INICIALES",
     tagline: "ESLOGAN_CLIENTE",
     description: "DESCRIPCIÓN_DEL_NEGOCIO",
     established: "AÑO",
     businessType: "peluqueria", // o "barberia" o "clinica_estetica"
     
     contact: {
       phone: "TELÉFONO",
       email: "EMAIL",
       whatsapp: "WHATSAPP",
       instagram: "INSTAGRAM",
     },
     
     location: {
       address: "DIRECCIÓN",
       city: "CIUDAD", 
       country: "PAÍS",
     },
     
     hours: {
       monday: "09:00 - 18:00",
       tuesday: "09:00 - 18:00",
       // ... completar todos los días
     },
     
     services: [
       {
         name: "NOMBRE_SERVICIO_1",
         price: "PRECIO_SIN_SÍMBOLO",
         duration: "DURACIÓN",
         description: "DESCRIPCIÓN"
       },
       // ... agregar todos los servicios
     ],
     
     currency: {
       symbol: "SÍMBOLO_MONEDA",
       code: "CÓDIGO_MONEDA", 
       position: "before" // o "after"
     },
     
     seo: {
       title: "TÍTULO_SEO",
       description: "DESCRIPCIÓN_SEO", 
       keywords: ["palabra1", "palabra2", "etc"]
     }
     
     // ... completar toda la configuración según la información recopilada
   };
   ```

#### **2.3. Actualizar la Función de Configuración**
Editar `src/config/business.config.ts`:
```typescript
import { CLIENT_CONFIG } from './client-config';

export const getBusinessConfig = (): BusinessConfig => {
  return CLIENT_CONFIG;
};
```

### ✅ **PASO 3: Configuración Visual**

#### **3.1. Seleccionar Componentes de Estilo**
En `src/app/page.tsx`, configurar el estilo seleccionado:

```typescript
// Para Peluquería - elegir UNO:
import ElegantHome from '@/components/Landing/peluquerias/ElegantHome';   // Estilo elegante
import ModernHome from '@/components/Landing/peluquerias/ModernHome';     // Estilo moderno  
import GlamourHome from '@/components/Landing/peluquerias/GlamourHome';   // Estilo glamour

// Para Barbería - elegir UNO:
import HomepageModern from '@/components/Landing/barberia/HomepageModern';       // Estilo moderno
import HomepageVintage from '@/components/Landing/barberia/HomepageVintage';     // Estilo vintage
import HomepageIndustrial from '@/components/Landing/barberia/HomepageIndustrial'; // Estilo industrial
```

#### **3.2. Personalizar Colores** (opcional)
Si el cliente requiere colores específicos, crear `src/styles/client-colors.css`:
```css
:root {
  --primary: VALOR_HEX_PRIMARIO;
  --secondary: VALOR_HEX_SECUNDARIO;
  --accent: VALOR_HEX_ACENTO;
}
```

E importar en `src/app/layout.tsx`:
```typescript
import '../styles/client-colors.css';
```

### ✅ **PASO 4: Personalización de Imágenes**

#### **4.1. Reemplazar Imágenes**
Colocar las imágenes del cliente en `public/`:
- **Logo del negocio**: `public/logo-client.png`
- **Imagen principal**: `public/hero-main.jpg`
- **Imagen de servicios**: `public/services-work.jpg`
- **Galería de trabajos**: `public/gallery-1.jpg`, `public/gallery-2.jpg`, etc.

#### **4.2. Actualizar Referencias de Imágenes**
En los componentes de estilo, actualizar las rutas:
```typescript
// Cambiar de:
src="/nails2.jpg"
// A:
src="/hero-main.jpg"
```

### ✅ **PASO 5: Configuración SEO y Metadata**

#### **5.1. Actualizar Metadata Principal**
En `src/app/layout.tsx`, la metadata se actualiza automáticamente usando la configuración del cliente.

#### **5.2. Configurar robots.txt y sitemap**
Los archivos `src/app/robots.ts` y `src/app/sitemap.ts` se actualizan automáticamente.

### ✅ **PASO 6: Testing y Validación**

#### **6.1. Prueba Local**
```bash
npm run dev
```
Verificar:
- [ ] Información del negocio se muestra correctamente
- [ ] Servicios y precios están bien formateados  
- [ ] Información de contacto es correcta
- [ ] Horarios se muestran apropiadamente
- [ ] Estilo visual es el seleccionado
- [ ] Imágenes cargan correctamente
- [ ] Funcionalidad de reservas funciona

#### **6.2. Verificaciones de Calidad**
- [ ] **Responsive Design**: Probar en móvil, tablet, desktop
- [ ] **Performance**: Verificar tiempos de carga
- [ ] **SEO**: Verificar títulos, descripciones, keywords
- [ ] **Accesibilidad**: Verificar alt texts, contraste
- [ ] **Funcionalidades**: Sistema de reservas, formularios

### ✅ **PASO 7: Despliegue**

#### **7.1. Preparación para Producción**
```bash
npm run build
npm run lint
```

#### **7.2. Despliegue**
**Opción A - Vercel:**
```bash
npx vercel --prod
```

**Opción B - Netlify:**
```bash
npm run build
# Subir carpeta .next a Netlify
```

**Opción C - Docker:**
```bash
docker build -t cliente-beauty-app .
docker run -p 3000:3000 cliente-beauty-app
```

## 🛠️ Archivos Clave para Modificar

### **Configuración Principal**
- `src/config/client-config.ts` - **PRINCIPAL**: Toda la info del cliente
- `src/config/business.config.ts` - Actualizar función `getBusinessConfig()`

### **Estilo Visual** 
- `src/app/page.tsx` - Seleccionar componente de estilo
- `src/styles/client-colors.css` - Colores personalizados (opcional)

### **Imágenes**
- `public/` - Todas las imágenes del cliente
- Componentes de estilo - Actualizar rutas de imágenes

### **Funcionalidades** (si se requieren cambios)
- `src/util/constants.ts` - Configuraciones de email y servicios
- `src/app/layout.tsx` - Metadata y estructura general

## ⚡ Checklist Final de Despliegue

### **Pre-Launch**
- [ ] Información del cliente verificada y aprobada
- [ ] Estilo visual aprobado por el cliente  
- [ ] Imágenes optimizadas y en buena calidad
- [ ] Precios y servicios actualizados
- [ ] Información de contacto verificada
- [ ] Horarios confirmados
- [ ] Testing completo realizado
- [ ] SEO optimizado

### **Post-Launch**
- [ ] SSL certificado configurado
- [ ] Google Analytics/Tag Manager (opcional)
- [ ] Google Business Profile conectado
- [ ] Backup y monitoreo configurado
- [ ] Cliente entrenado en uso del panel admin
- [ ] Documentación entregada al cliente

## 🚨 Notas Importantes

### **Elementos que NO se deben modificar**
- Sistema de reservas y base de datos
- Estructura de componentes UI
- Lógica de autenticación
- APIs y middleware

### **Elementos que SÍ se pueden personalizar**
- Toda la información de negocio
- Colores y estilos visuales
- Imágenes y contenido multimedia
- Textos y copys
- Servicios y precios
- Información de contacto

### **Tiempo Estimado**
- **Recopilación de información**: 30-60 minutos
- **Configuración técnica**: 20-30 minutos  
- **Personalización visual**: 15-20 minutos
- **Testing**: 15-30 minutos
- **Despliegue**: 10-15 minutos
- **Total**: 1.5 - 2.5 horas

## 📞 Soporte Post-Despliegue

Para soporte técnico o modificaciones posteriores:
1. Documentar cualquier cambio en este archivo
2. Mantener backup de la configuración del cliente
3. Versionar cambios en git con tags descriptivos

---

**✅ Con esta guía, cualquier desarrollador puede personalizar y desplegar una nueva aplicación para un cliente en menos de 3 horas, garantizando consistencia y calidad en cada despliegue.**