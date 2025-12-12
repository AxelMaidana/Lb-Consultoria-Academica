# Checklist de Verificación PWA

Para asegurar que la aplicación es instalable y funciona correctamente como PWA:

## 1. Requisitos Básicos
- [ ] **HTTPS**: La app debe servirse sobre HTTPS (en local `localhost` funciona, pero en producción es obligatorio).
- [ ] **Manifest**: El archivo `manifest.webmanifest` (o generado dinámicamente) debe estar presente.
- [ ] **Service Worker**: El SW debe estar registrado y activo.

## 2. Verificación en Chrome DevTools
1. Abrir DevTools (F12) > pestaña **Application**.
2. Sección **Manifest**:
   - [ ] Verificar que no haya errores ni advertencias.
   - [ ] Verificar `Name`, `Short name`, `Start URL`, `Theme color`, `Background color`.
   - [ ] Verificar que los iconos (192px y 512px) se carguen correctamente.
3. Sección **Service Workers**:
   - [ ] Verificar que el Status sea "Activated and is running".
   - [ ] Probar "Offline" checkbox y recargar la página. Debería mostrar la página (si está cacheada) o la fallback 404 custom.

## 3. Lighthouse Audit
1. Pestaña **Lighthouse** en DevTools.
2. Seleccionar categoría **Progressive Web App**.
3. Correr análisis.
   - [ ] Debe pasar todos los checks de "Installable".
   - [ ] Debe pasar "PWA Optimized".

## 4. Prueba en Dispositivo Móvil (Android/Chrome)
1. Desplegar la app (ej. Vercel).
2. Abrir en Chrome Android.
3. [ ] Debe aparecer el prompt "Agregar a la pantalla principal" (o en el menú de 3 puntos).
4. [ ] Al instalar, debe aparecer el icono en el launcher.
5. [ ] Al abrir, debe verse en pantalla completa (standalone) sin barra de URL.
6. [ ] El color de la barra de estado debe coincidir con el `theme-color`.

## 5. iOS (Safari)
1. Abrir en Safari.
2. Botón "Compartir" > "Agregar al inicio".
3. [ ] Debe tener el icono y nombre correctos.
