/**
 * Seeds iniciales del blog — 3 artículos draft para revisión del Dr.
 * Ejecutar con: npm run db:seed
 */

export interface BlogSeed {
  slug: string;
  title: string;
  excerpt: string;
  contentMd: string;
  contentHtml: string; // placeholder — se genera con remark en el seed runner
  areaLegal: "civil_familia" | "laboral" | "penal" | "comercial" | "general";
  author: string;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export const BLOG_SEEDS: BlogSeed[] = [
  {
    slug: "que-hacer-si-te-despidieron-sin-causa",
    title: "¿Te despidieron sin causa? Esto es lo que tenés que hacer",
    excerpt:
      "Si tu empleador te notificó un despido sin expresar motivo, tenés derechos concretos y plazos que no podés perder. Te explicamos paso a paso qué hacer en las primeras 48 horas.",
    areaLegal: "laboral",
    author: "Dr. Pablo De Luca",
    published: false,
    seoTitle: "¿Qué hacer si te despidieron sin causa? | Dr. Pablo De Luca, Abogado",
    seoDescription:
      "Guía práctica: pasos inmediatos tras un despido sin causa en Argentina. Indemnizaciones, plazos y derechos según la LCT. San Rafael, Mendoza.",
    contentHtml: "", // generado por seed runner
    contentMd: `
## ¿Te despidieron sin causa? Esto es lo que tenés que hacer

El despido sin causa es uno de los motivos de consulta más frecuentes en nuestro estudio. La situación genera mucha angustia, pero hay pasos concretos que podés dar para proteger tus derechos.

> **Nota**: Este artículo es informativo. Cada situación laboral es única y requiere análisis profesional. [Consultá tu caso personalizado](/reservar?area=laboral).

### Las primeras 48 horas son clave

Cuando recibís la notificación del despido, el reloj empieza a correr. Estas son las acciones inmediatas:

**1. No firmes nada sin leerlo**

Si tu empleador te presenta un telegrama de despido o cualquier documento, no lo firmés sin entender qué dice. Podés acusar recibo sin aceptar el contenido.

**2. Enviá un telegrama laboral (es gratuito)**

Desde cualquier sucursal del Correo Oficial podés enviar un telegrama laboral sin costo si sos trabajador en relación de dependencia. Usalo para:
- Dejar constancia de la fecha en que te notificaron
- Rechazar el despido si te dieron una causa que considerás injusta
- Intimar al empleador a entregarte los certificados de trabajo

**3. Reuní tu documentación laboral**

Juntá todo lo que tengas: recibos de sueldo de los últimos 12 meses, constancias de aportes (AFIP), notificaciones escritas, mensajes de WhatsApp o email que sean relevantes.

### ¿A cuánto tenés derecho?

En un despido sin causa, la LCT establece:

- **Indemnización por antigüedad (Art. 245)**: 1 mes de tu mejor sueldo normal y habitual por año de antigüedad (fracción mayor a 3 meses = año completo)
- **Preaviso (Art. 232)**: 1 mes si tenés menos de 5 años de antigüedad, 2 meses si tenés más
- **SAC proporcional**: la parte proporcional del aguinaldo del período trabajado

Si tu empleador no te entregó los certificados laborales en tiempo y forma, podés reclamar una multa adicional equivalente a 3 sueldos (Art. 80 LCT).

### ¿Qué pasa si el sueldo estaba en negro?

Si parte de tu remuneración no estaba declarada, podés intimar al empleador a que regularice la situación antes de que el despido esté consumado. Esto puede generar obligaciones adicionales de su parte.

### El plazo de prescripción es de 2 años

Tenés 2 años desde la fecha del despido para iniciar acciones legales. No esperés hasta el último momento, porque reunir pruebas y preparar el caso lleva tiempo.

### ¿Cuándo conviene ir a juicio?

No todos los casos van a juicio. Muchas veces se resuelven por acuerdo homologado ante el SECLO (Servicio de Conciliación Laboral Obligatoria). El juicio es una última instancia, pero a veces es la única forma de cobrar lo que te corresponde.

---

*¿Querés saber cuánto te corresponde? Usá nuestra [calculadora de indemnización por despido](/calculadora/indemnizacion-despido). Recordá que es una estimación orientativa — para tu caso específico, [reservá una consulta](/reservar?area=laboral).*
`,
  },
  {
    slug: "divorcio-incausado-como-funciona",
    title: "Divorcio en Argentina: cómo funciona desde 2015",
    excerpt:
      "Desde la reforma del Código Civil y Comercial, el divorcio es incausado: no necesitás probar nada ni esperar años. Te contamos cómo es el proceso real.",
    areaLegal: "civil_familia",
    author: "Dr. Pablo De Luca",
    published: false,
    seoTitle: "Cómo funciona el divorcio en Argentina (2025) | Guía práctica",
    seoDescription:
      "Todo sobre el divorcio incausado en Argentina: requisitos, plazos, cuidado de los hijos y bienes. Estudio De Luca, San Rafael, Mendoza.",
    contentHtml: "",
    contentMd: `
## Divorcio en Argentina: cómo funciona desde 2015

Desde que entró en vigencia el Código Civil y Comercial de la Nación, el divorcio en Argentina cambió radicalmente. Hoy es más accesible, más rápido y mucho menos conflictivo.

> **Nota**: Este artículo es informativo y de orientación general. Para analizar tu situación específica, [consultá con nosotros](/reservar?area=civil_familia).

### El divorcio incausado: no necesitás dar explicaciones

Antes de 2015, divorciarse requería probar causales concretas (abandono, adulterio, injurias graves) o esperar 3 años de separación de hecho. Todo eso cambió.

**Hoy, cualquiera de los dos cónyuges puede pedir el divorcio en cualquier momento y sin expresar causa.** El juez no puede rechazar el pedido ni exigir que se justifique la decisión.

### ¿Cómo es el proceso?

El proceso tiene dos grandes caminos:

#### Divorcio de mutuo acuerdo

Cuando ambos están de acuerdo, presentan conjuntamente:
- La petición de divorcio
- Un **convenio regulador** que define qué pasa con los hijos (cuidado, visitas, alimentos) y con los bienes

El juez homologa el convenio y dicta el divorcio. En la práctica, puede resolverse en pocas semanas si el convenio está bien redactado.

#### Divorcio unilateral

Cuando solo uno quiere divorciarse, presenta la petición y el propuesta de convenio regulador. El otro cónyuge puede acordar, modificar o impugnar el convenio, pero **no puede oponerse al divorcio en sí**.

Esto es importante: aunque el otro se niegue, el divorcio procede igualmente.

### El convenio regulador: la parte más importante

El convenio es el documento que define las reglas de la nueva situación familiar. Incluye:

**Sobre los hijos (si los hay):**
- Cuidado personal: ¿con quién viven? ¿es compartido?
- Régimen comunicacional: días y horarios con el otro progenitor
- Alimentos: monto, forma de pago, actualizaciones

**Sobre los bienes:**
- Qué se hace con la vivienda familiar
- Cómo se divide el resto del patrimonio
- Deudas y su distribución

Un convenio bien redactado evita conflictos futuros. Uno mal redactado los genera.

### ¿Cuánto tarda un divorcio?

Depende mucho de la complejidad del caso y la colaboración de las partes:
- **Mutuo acuerdo sin conflictos**: 1 a 3 meses
- **Con desacuerdos en el convenio**: 3 a 12 meses
- **Divorcios muy conflictivos con disputa de bienes y hijos**: puede extenderse más

### ¿Qué pasa con los hijos?

El divorcio no extingue ningún derecho ni obligación respecto de los hijos. El cuidado personal, los alimentos y el régimen comunicacional se regulan por separado, siempre con el interés superior del niño como principio rector.

Hoy la ley presume el cuidado compartido: salvo razones justificadas, ambos progenitores siguen siendo responsables por igual.

---

*¿Estás pensando en divorciarte o en medio de un proceso? [Reservá una consulta inicial sin cargo](/reservar?area=civil_familia) y te explicamos qué podés esperar en tu situación específica.*
`,
  },
  {
    slug: "accidente-laboral-derechos-trabajador",
    title: "Accidente laboral: qué derechos tenés y cómo hacerlos valer",
    excerpt:
      "Si sufriste un accidente de trabajo o enfermedad profesional, tenés derechos garantizados por la Ley 24.557 (ART). Conocé cómo funciona el sistema y cuándo conviene ir a juicio.",
    areaLegal: "laboral",
    author: "Dr. Pablo De Luca",
    published: false,
    seoTitle: "Accidente laboral: tus derechos y cómo reclamar | Dr. Pablo De Luca",
    seoDescription:
      "Guía sobre accidentes de trabajo en Argentina: ART, incapacidades, plazos para reclamar y cuándo conviene ir a juicio. Mendoza.",
    contentHtml: "",
    contentMd: `
## Accidente laboral: qué derechos tenés y cómo hacerlos valer

Un accidente de trabajo puede cambiar la vida de una persona en segundos. El sistema legal argentino garantiza derechos concretos, pero muchos trabajadores no saben cómo ejercerlos.

> **Nota**: Este artículo es orientativo. Los montos y derechos dependen de cada situación particular. [Consultá tu caso](/reservar?area=laboral).

### ¿Qué es un accidente de trabajo?

La Ley 24.557 (Ley de Riesgos del Trabajo) define el accidente laboral como el evento súbito y violento que ocurre por el hecho o en ocasión del trabajo, incluyendo también los accidentes in itinere (en el trayecto entre el domicilio y el trabajo).

### Primeros pasos después de un accidente

**1. Denunciá el accidente a tu empleador inmediatamente**

Tiene que quedar constancia escrita. Si no la generan ellos, enviá un telegrama laboral o carta documento.

**2. La ART debe atenderte**

El empleador está obligado a contratar una ART (Aseguradora de Riesgos del Trabajo). Ante un accidente, la ART debe brindarte:
- Atención médica completa
- Rehabilitación
- Prestaciones dinerarias durante la incapacidad temporaria

**3. No firmés el alta médica prematuramente**

Uno de los errores más frecuentes es firmar el alta médica antes de estar realmente curado. Una vez firmada, es muy difícil reabrir el caso.

### Las prestaciones del sistema de ART

El sistema prevé dos tipos de prestaciones:

**Incapacidad Laboral Temporaria (ILT)**: mientras no podés trabajar durante la recuperación. Cobrarás el equivalente a tu salario.

**Incapacidad Laboral Permanente (ILP)**: si quedás con secuelas definitivas. El porcentaje de incapacidad lo determina una comisión médica.

### ¿Cuándo conviene ir a juicio civil?

La gran pregunta. La reforma de la Ley 26.773 (2012) permite reclamar ante la justicia civil como alternativa al sistema de ART, buscando una indemnización integral del daño.

Conviene evaluar el juicio civil cuando:
- La oferta de la ART es claramente insuficiente
- El daño sufrido es significativo (incapacidad permanente importante)
- Hay dolo o negligencia grave del empleador

El juicio civil puede dar montos mayores, pero también implica mayor tiempo y riesgo.

### Los plazos para reclamar

La prescripción en materia de accidentes laborales es de 2 años. No esperes demasiado para consultar.

---

*Si sufriste un accidente laboral o enfermedad profesional, [contactanos](/reservar?area=laboral). La primera consulta es sin cargo.*
`,
  },
];
