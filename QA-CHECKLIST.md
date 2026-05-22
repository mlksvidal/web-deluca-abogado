# QA Checklist — Estudio Jurídico Dr. Pablo De Luca

Smoke E2E manual a ejecutar antes de cada deploy a producción.
Testar contra `npm run build && npm start` (NO dev server).

---

## Flujo de reserva

- [ ] 1. Acceder a `/reservar` — página carga correctamente, no hay errores en consola
- [ ] 2. Seleccionar área legal → disponibilidad de slots visible
- [ ] 3. Seleccionar un slot disponible → formulario de datos aparece
- [ ] 4. Completar formulario con datos válidos (nombre, email, teléfono, descripción, checkbox consentimiento)
- [ ] 5. Submit → confirmación visual (sin recargar la página)
- [ ] 6. Email de confirmación llega al email de prueba (o se loguea en console en dev)
- [ ] 7. Email de notificación llega al Dr. (o se loguea)
- [ ] 8. Evento aparece en Google Calendar del Dr.
- [ ] 9. Intentar reservar el mismo slot → error "slot ocupado"
- [ ] 10. Flujo completo en mobile (iPhone/Android) — formulario usable, touch targets adecuados

## Admin panel

- [ ] 11. Acceder a `/admin` sin credenciales → 401 Basic Auth
- [ ] 12. Acceder a `/admin` con credenciales correctas → panel visible
- [ ] 13. Cancelar un turno desde admin → estado cambia a "cancelado"
- [ ] 14. Email de cancelación llega al cliente
- [ ] 15. Evento eliminado de Google Calendar

## Calculadoras

- [ ] 16. Calculadora despido: ingresar datos reales (ej. 3 años, $600.000 bruto, despido sin causa) → resultado razonable con desglose
- [ ] 17. Calculadora cuota alimentaria: ingresar ingresos y porcentaje → resultado correcto
- [ ] 18. Calculadora ART: ingresar datos de siniestro → resultado con IBM y fórmula
- [ ] 19. Disclaimer legal visible en todas las calculadoras
- [ ] 20. Resultado no se guarda ni envía (confirmado con Network tab)

## Verificador de despido

- [ ] 21. Caso ilegal claro (despido verbal, sin preaviso, menos de 1 año) → "Despido ilegal" con motivos
- [ ] 22. Caso legal → resultado con explicación
- [ ] 23. CTA "Consultar con el Dr." visible en todos los resultados

## Descarga de PDFs

- [ ] 24. Ir a `/recursos` → listado de PDFs visible con filtro por área
- [ ] 25. Hacer clic en descargar → formulario de lead aparece
- [ ] 26. Completar lead (nombre, email, teléfono, área interés) → descarga inicia
- [ ] 27. Lead queda registrado en admin
- [ ] 28. PDF se descarga con `Content-Disposition: attachment` (no abre en tab)

## Blog

- [ ] 29. Ir a `/blog` → listado de posts publicados visible
- [ ] 30. Hacer clic en un post → página de detalle carga con markdown renderizado
- [ ] 31. Filtrar por área legal → solo posts de esa área
- [ ] 32. Paginación funciona si hay más de 6 posts

## Glosario

- [ ] 33. Ir a `/glosario` → A-Z funciona, términos listados
- [ ] 34. Buscar un término → resultado aparece (Fuse.js search)
- [ ] 35. Hacer clic en un término → página detalle con definición larga
- [ ] 36. Términos relacionados linkeados correctamente

## Timeline divorcio

- [ ] 37. Ir a `/proceso/divorcio` → timeline visible con 8 hitos
- [ ] 38. Scroll animation activa correctamente (si prefers-reduced-motion: no-preference)
- [ ] 39. Con `prefers-reduced-motion: reduce` → contenido visible sin animación

## Triaje WhatsApp

- [ ] 40. FAB de WhatsApp visible en todas las páginas
- [ ] 41. Wizard de triaje: recorrer 3 pasos → link final abre WhatsApp con mensaje correcto
- [ ] 42. FAB de emergencia visible y funcional

## SEO y estructura

- [ ] 43. Sello matrícula visible en footer y página /estudio
- [ ] 44. `/sitemap.xml` accesible y lista todas las rutas (estáticas + blog + glosario)
- [ ] 45. `/robots.txt` excluye `/admin/` y `/api/`
- [ ] 46. Schema.org valida en https://validator.schema.org/ (al menos homepage y un post)
- [ ] 47. Rich Results Test pasa para LegalService + FAQPage (si aplica)

## Seguridad y headers

- [ ] 48. `curl -I https://TU_DEPLOY/` muestra todos los security headers
- [ ] 49. `X-Frame-Options: DENY` presente
- [ ] 50. `Content-Security-Policy` presente y no hay errores CSP en consola del browser
- [ ] 51. `/admin` retorna `X-Robots-Tag: noindex, nofollow`
- [ ] 52. `/admin` retorna `Cache-Control: private, no-store`
- [ ] 53. `/_next/static/` retorna `Cache-Control: public, max-age=31536000, immutable`
- [ ] 54. `/pdfs/*.pdf` descarga con `Content-Disposition: attachment`

## Error pages y loading

- [ ] 55. 404: acceder a `/ruta-inexistente` → página 404 custom con brand
- [ ] 56. Loading: simular conexión lenta en DevTools → skeleton visible en blog/glosario/reservar
- [ ] 57. `/admin` acceder directamente → loading.tsx visible brevemente

## Email transaccional

- [ ] 58. Email de confirmación de turno tiene SPF/DKIM pass (verificar headers del email)
- [ ] 59. Email de cancelación correcto con datos del turno
- [ ] 60. Email al Dr. con datos del cliente (sin `descripcion` en logs del servidor)

---

## Gates de certificación (Fase 4)

- [ ] `npm run check` (lint + type-check + test + build) retorna 0 errores
- [ ] `npm test` 140/140 tests passing
- [ ] `npm run lint` 0 errores (warnings permitidos)
- [ ] Lighthouse Performance > 85 en producción
- [ ] Lighthouse Accessibility > 95
- [ ] LCP < 2.5s en 3G simulado
- [ ] CLS < 0.1
- [ ] securityheaders.com: grado B+ o superior
- [ ] No hay `console.log` de datos sensibles en producción

---

_Última actualización: 2026-05-21 — Batch 11 certificación_
