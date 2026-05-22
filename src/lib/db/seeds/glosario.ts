/**
 * Seeds iniciales del glosario jurídico — 35 términos legales argentinos.
 * Ejecutar con: npm run db:seed
 */

export interface GlosarioSeed {
  termino: string;
  letra: string;
  slug: string;
  definicionCorta: string;
  definicionLarga: string;
  areaLegal: string;
  sinonimos?: string[];
  terminosRelacionados?: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const GLOSARIO_SEEDS: GlosarioSeed[] = [
  {
    termino: "Acción Civil",
    letra: "A",
    slug: slugify("Acción Civil"),
    definicionCorta:
      "Pretensión judicial para reclamar el reconocimiento o restablecimiento de un derecho civil.",
    definicionLarga:
      "La acción civil es el medio procesal por el cual una persona (actor o demandante) inicia un proceso ante los tribunales para reclamar el reconocimiento de un derecho, la reparación de un daño o el cumplimiento de una obligación de carácter civil o comercial. En Argentina se rige principalmente por el Código Civil y Comercial de la Nación (Ley 26.994) y los códigos procesales de cada provincia.",
    areaLegal: "civil_familia",
    terminosRelacionados: ["demanda", "actor", "demandado"],
  },
  {
    termino: "Alimentos",
    letra: "A",
    slug: slugify("Alimentos"),
    definicionCorta:
      "Prestación económica que una persona debe a otra en virtud de un vínculo familiar para cubrir sus necesidades básicas.",
    definicionLarga:
      "En derecho de familia, los alimentos comprenden todo lo necesario para el sustento, habitación, vestuario, asistencia médica, educación y esparcimiento del beneficiario. El Código Civil y Comercial establece la obligación alimentaria entre cónyuges, convivientes, y en la línea ascendente y descendente. El monto se fija judicialmente según las necesidades del beneficiario y los recursos del obligado. El incumplimiento puede acarrear sanciones, incluida la prisión.",
    areaLegal: "civil_familia",
    sinonimos: ["cuota alimentaria", "pensión alimenticia"],
    terminosRelacionados: ["divorcio", "cuidado personal", "filiación"],
  },
  {
    termino: "Amparo",
    letra: "A",
    slug: slugify("Amparo"),
    definicionCorta:
      "Acción judicial de carácter urgente para proteger derechos constitucionales amenazados o vulnerados.",
    definicionLarga:
      "El amparo es una acción judicial expedita y rápida que procede cuando no existe otro remedio judicial más idóneo, contra actos u omisiones de autoridades públicas o de particulares que lesionen, restrinjan, alteren o amenacen derechos o garantías reconocidos por la Constitución Nacional, un tratado o una ley. Está regulado por la Ley 16.986 a nivel federal y por leyes procesales provinciales.",
    areaLegal: "penal",
    sinonimos: ["acción de amparo"],
    terminosRelacionados: ["habeas corpus", "habeas data"],
  },
  {
    termino: "Antigüedad laboral",
    letra: "A",
    slug: slugify("Antigüedad laboral"),
    definicionCorta:
      "Tiempo de servicio prestado por un trabajador a un empleador, determinante para calcular indemnizaciones.",
    definicionLarga:
      "La antigüedad en el empleo es el tiempo transcurrido desde el inicio de la relación laboral hasta su extinción. En la Ley de Contrato de Trabajo (LCT, Ley 20.744) es el factor fundamental para calcular la indemnización por despido sin causa (Art. 245), la indemnización sustitutiva de preaviso (Art. 232), y el SAC proporcional. Se computa en años, considerándose fracción mayor a 3 meses como año completo.",
    areaLegal: "laboral",
    terminosRelacionados: ["indemnización por despido", "preaviso", "LCT"],
  },
  {
    termino: "Audiencia",
    letra: "A",
    slug: slugify("Audiencia"),
    definicionCorta:
      "Acto procesal mediante el cual el juez escucha a las partes y/o testigos en presencia del tribunal.",
    definicionLarga:
      "La audiencia es un acto procesal formal donde el juez o tribunal recibe a las partes, sus abogados y testigos para escuchar sus argumentos y declaraciones. En el proceso civil puede ser de conciliación, prueba o alegatos. En el proceso penal puede ser de imputación, prisión preventiva, juicio oral, entre otras. La oralidad e inmediación son principios que la rigen en los sistemas procesales modernos.",
    areaLegal: "general",
    terminosRelacionados: ["proceso judicial", "prueba", "sentencia"],
  },
  {
    termino: "Carta Documento",
    letra: "C",
    slug: slugify("Carta Documento"),
    definicionCorta:
      "Comunicación fehaciente enviada por correo que otorga fecha cierta y prueba de recepción.",
    definicionLarga:
      "La carta documento es un servicio del Correo Argentino que permite enviar comunicaciones con valor legal, ya que otorga fecha cierta al envío y prueba de recepción. Es ampliamente utilizada en el derecho laboral para notificar despidos, intimaciones al empleador, reclamos de derechos, y en el derecho civil para interpelar al deudor, rescindir contratos y ejercer derechos. Su envío interrumpe plazos de prescripción.",
    areaLegal: "general",
    sinonimos: ["CD"],
    terminosRelacionados: ["telegrama laboral", "intimación", "despido"],
  },
  {
    termino: "Cuidado Personal",
    letra: "C",
    slug: slugify("Cuidado Personal"),
    definicionCorta:
      "Régimen que determina con quién conviven los hijos menores de edad tras la separación de sus progenitores.",
    definicionLarga:
      "El cuidado personal, denominado anteriormente 'tenencia', regula la convivencia cotidiana de los hijos con sus progenitores. El Código Civil y Comercial (Arts. 648-661) establece el cuidado personal compartido como regla y el unilateral como excepción. El juez puede disponer el cuidado compartido alternado (el niño vive períodos equivalentes con cada progenitor) o indistinto (ambos participan activamente pero el niño reside con uno). El interés superior del niño es el principio rector.",
    areaLegal: "civil_familia",
    sinonimos: ["tenencia", "guarda"],
    terminosRelacionados: ["alimentos", "divorcio", "régimen comunicacional"],
  },
  {
    termino: "Demanda",
    letra: "D",
    slug: slugify("Demanda"),
    definicionCorta:
      "Escrito mediante el cual el actor inicia un proceso judicial exponiendo sus pretensiones.",
    definicionLarga:
      "La demanda es el acto procesal inicial del proceso civil mediante el cual el actor (demandante) expone ante el juez competente los hechos en que funda su pretensión, el derecho aplicable y lo que reclama. Debe cumplir requisitos formales establecidos en los códigos procesales provinciales (nombre, domicilio, hechos, derecho, prueba, petición). La presentación de la demanda interrumpe la prescripción de la acción.",
    areaLegal: "civil_familia",
    terminosRelacionados: ["actor", "demandado", "proceso judicial", "juicio"],
  },
  {
    termino: "Despido con Causa",
    letra: "D",
    slug: slugify("Despido con Causa"),
    definicionCorta:
      "Extinción del contrato de trabajo por incumplimiento grave del trabajador que justifica el despido.",
    definicionLarga:
      "El despido con justa causa ocurre cuando el empleador extingue la relación laboral invocando un incumplimiento grave del trabajador (Art. 242 LCT). Las causales deben ser ciertas, suficientemente graves y guardar proporcionalidad con la sanción. El Art. 243 LCT exige que el empleador comunique el despido por escrito indicando la causa precisa. Si el trabajador impugna la causa y ésta no se prueba, el despido se convierte en despido sin causa con derecho a indemnización.",
    areaLegal: "laboral",
    sinonimos: ["despido justificado", "despido por justa causa"],
    terminosRelacionados: ["despido sin causa", "LCT", "indemnización por despido"],
  },
  {
    termino: "Despido sin Causa",
    letra: "D",
    slug: slugify("Despido sin Causa"),
    definicionCorta:
      "Extinción unilateral del contrato de trabajo por voluntad del empleador sin invocar incumplimiento del trabajador.",
    definicionLarga:
      "El despido sin causa (o despido incausado) es el acto por el cual el empleador extingue el contrato de trabajo sin invocar culpa del trabajador. Genera la obligación de pagar: indemnización por antigüedad (Art. 245 LCT = 1 mes de mejor remuneración normal y habitual por año de antigüedad), indemnización sustitutiva de preaviso (Art. 232 LCT), e integración del mes de despido si corresponde. Es el tipo de despido más frecuente en Argentina.",
    areaLegal: "laboral",
    sinonimos: ["despido incausado", "despido injustificado"],
    terminosRelacionados: ["despido con causa", "indemnización por despido", "preaviso", "LCT"],
  },
  {
    termino: "Divorcio",
    letra: "D",
    slug: slugify("Divorcio"),
    definicionCorta:
      "Disolución del vínculo matrimonial por resolución judicial a pedido de uno o ambos cónyuges.",
    definicionLarga:
      "Desde la reforma del Código Civil y Comercial (2015), el divorcio en Argentina es incausado: puede pedirlo cualquiera de los cónyuges o ambos de común acuerdo, sin necesidad de expresar ni probar causa alguna. El proceso puede incluir la regulación del cuidado personal de los hijos, alimentos, régimen comunicacional y división de bienes (liquidación de la sociedad conyugal o comunidad de ganancias). El divorcio vincular disuelve definitivamente el matrimonio.",
    areaLegal: "civil_familia",
    sinonimos: ["divorcio vincular"],
    terminosRelacionados: ["matrimonio", "cuidado personal", "alimentos", "sucesión"],
  },
  {
    termino: "Embargo",
    letra: "E",
    slug: slugify("Embargo"),
    definicionCorta:
      "Medida cautelar que afecta bienes del deudor para garantizar el cumplimiento de una obligación.",
    definicionLarga:
      "El embargo es una medida cautelar o ejecutiva que consiste en la afectación jurídica de bienes del deudor al pago de la deuda reclamada. Puede trabarse sobre dinero en cuentas bancarias (embargo de cuenta), bienes inmuebles (anotado en el Registro de la Propiedad), vehículos (anotado en el Registro Automotor) o sueldos (embargo de haberes, con límites legales). Requiere orden judicial y puede solicitarse como medida preventiva antes de iniciar el juicio.",
    areaLegal: "civil_familia",
    sinonimos: ["embargo preventivo", "embargo ejecutivo"],
    terminosRelacionados: ["inhibición general de bienes", "ejecución", "medida cautelar"],
  },
  {
    termino: "Filiación",
    letra: "F",
    slug: slugify("Filiación"),
    definicionCorta:
      "Vínculo jurídico que une a una persona con sus progenitores, con sus efectos legales.",
    definicionLarga:
      "La filiación es el vínculo jurídico que une a una persona con sus progenitores y de ahí deriva sus derechos y obligaciones. El Código Civil y Comercial (Arts. 558-593) reconoce tres fuentes: la naturaleza, las técnicas de reproducción humana asistida, y la adopción. La filiación puede ser matrimonial o extramatrimonial. El reconocimiento voluntario y la acción de reclamación o impugnación de filiación son los mecanismos para establecerla o cuestionarla.",
    areaLegal: "civil_familia",
    terminosRelacionados: ["adopción", "alimentos", "sucesión", "cuidado personal"],
  },
  {
    termino: "Habeas Corpus",
    letra: "H",
    slug: slugify("Habeas Corpus"),
    definicionCorta:
      "Acción judicial para proteger la libertad física ante detenciones ilegales o arbitrarias.",
    definicionLarga:
      "El hábeas corpus (del latín 'que tengas el cuerpo') es una garantía constitucional (Art. 43 CN) que protege la libertad ambulatoria de las personas contra detenciones ilegales o arbitrarias. Puede ser: reparador (para lograr la liberación del detenido ilegalmente), preventivo (frente a amenaza de arresto ilegal), correctivo (para cesar tratos ilegítimos en detenidos legalmente), y restringido (para cesar perturbaciones a la libertad que no impliquen detención). Se tramita ante cualquier juez con competencia en lo penal.",
    areaLegal: "penal",
    sinonimos: ["hábeas corpus"],
    terminosRelacionados: ["amparo", "privación ilegal de la libertad"],
  },
  {
    termino: "Honorarios",
    letra: "H",
    slug: slugify("Honorarios"),
    definicionCorta:
      "Retribución que percibe el abogado por los servicios profesionales prestados.",
    definicionLarga:
      "Los honorarios profesionales del abogado se regulan en cada provincia por aranceles específicos. En Mendoza rige la Ley 4687 (Arancel de Honorarios de Abogados y Procuradores). Los honorarios pueden pactarse libremente o calcularse sobre el monto del juicio conforme al arancel. En juicios con sentencia, el juez regula los honorarios a cargo de la parte condenada en costas. El pacto de cuota litis (porcentaje del resultado) está permitido con ciertos límites.",
    areaLegal: "general",
    terminosRelacionados: ["costas", "pacto de cuota litis"],
  },
  {
    termino: "Indemnización por Despido",
    letra: "I",
    slug: slugify("Indemnización por Despido"),
    definicionCorta:
      "Compensación económica que debe abonar el empleador al trabajador despedido sin causa.",
    definicionLarga:
      "La indemnización por despido sin causa (Art. 245 LCT) equivale a un mes de la mejor remuneración mensual, normal y habitual percibida durante el último año de prestación de servicios, multiplicada por los años de antigüedad (fracciones mayores a 3 meses se computan como año). Este importe no puede ser inferior a 2 meses de sueldo. A esto se suma la indemnización sustitutiva de preaviso (Art. 232), la integración del mes de despido y el SAC proporcional.",
    areaLegal: "laboral",
    terminosRelacionados: ["despido sin causa", "preaviso", "antigüedad laboral", "LCT"],
  },
  {
    termino: "Juicio Laboral",
    letra: "J",
    slug: slugify("Juicio Laboral"),
    definicionCorta:
      "Proceso judicial ante la justicia del trabajo para resolver conflictos entre trabajadores y empleadores.",
    definicionLarga:
      "El juicio laboral es el proceso judicial que se tramita ante los tribunales especializados en materia laboral (Cámara del Trabajo en Mendoza). Se caracteriza por el principio protectorio del trabajador, la gratuidad para el obrero, la inversión de la carga probatoria en ciertos casos y plazos abreviados. Puede incluir reclamos por indemnización por despido, diferencias salariales, accidentes de trabajo, y otros incumplimientos del empleador.",
    areaLegal: "laboral",
    terminosRelacionados: ["despido", "LCT", "ART", "accidente laboral"],
  },
  {
    termino: "LCT",
    letra: "L",
    slug: slugify("LCT"),
    definicionCorta:
      "Ley de Contrato de Trabajo (Ley 20.744) — norma central del derecho laboral individual en Argentina.",
    definicionLarga:
      "La Ley de Contrato de Trabajo N° 20.744 y sus modificatorias es la norma fundamental que regula las relaciones individuales de trabajo en Argentina. Establece los derechos y obligaciones de empleadores y trabajadores: jornada laboral, vacaciones, licencias, salarios, causas y efectos del despido, indemnizaciones, entre otros. No se aplica a empleados públicos ni domésticos, que tienen regímenes especiales. Su Art. 245 regula la indemnización por despido sin causa.",
    areaLegal: "laboral",
    sinonimos: ["Ley de Contrato de Trabajo", "Ley 20.744"],
    terminosRelacionados: ["despido", "indemnización por despido", "preaviso", "jornada laboral"],
  },
  {
    termino: "Medida Cautelar",
    letra: "M",
    slug: slugify("Medida Cautelar"),
    definicionCorta:
      "Providencia judicial preventiva para asegurar el resultado de un proceso o evitar un daño inminente.",
    definicionLarga:
      "Las medidas cautelares son resoluciones judiciales provisorias dictadas para asegurar la eficacia de la sentencia definitiva o prevenir un daño irreparable durante la tramitación del proceso. Las principales son: embargo preventivo, inhibición general de bienes, anotación de litis, prohibición de innovar y de contratar, y el depósito judicial. Requieren la acreditación del derecho invocado (fumus boni iuris), el peligro en la demora y, en general, una contracautela.",
    areaLegal: "general",
    terminosRelacionados: ["embargo", "inhibición general de bienes", "proceso judicial"],
  },
  {
    termino: "Multa Art. 80 LCT",
    letra: "M",
    slug: slugify("Multa Art. 80 LCT"),
    definicionCorta:
      "Sanción al empleador por no entregar al trabajador los certificados laborales y de servicios.",
    definicionLarga:
      "El Art. 80 de la LCT obliga al empleador a entregar al trabajador un certificado de trabajo al finalizar la relación laboral. Si el empleador no cumple dentro de los 30 días desde la extinción del contrato, el trabajador puede intimar fehacientemente su entrega, y si no se cumplen en los siguientes 2 días hábiles, tiene derecho a una indemnización equivalente a 3 veces la mejor remuneración mensual, normal y habitual. Esta multa es adicional a la indemnización por despido.",
    areaLegal: "laboral",
    sinonimos: ["indemnización Art. 80"],
    terminosRelacionados: ["LCT", "certificado de trabajo", "despido sin causa"],
  },
  {
    termino: "Negligencia",
    letra: "N",
    slug: slugify("Negligencia"),
    definicionCorta:
      "Factor de atribución de responsabilidad civil por omisión de la diligencia debida.",
    definicionLarga:
      "La negligencia es una forma de culpa que consiste en la omisión de los cuidados o precauciones que debía tomar quien actúa, sin que exista intención de dañar. Es uno de los factores subjetivos de atribución de responsabilidad civil (Art. 1724 CCC). Junto con la imprudencia (hacer con falta de cuidado lo que no debía hacerse) y la impericia (falta de aptitud técnica en el ejercicio de un arte o profesión), integran el concepto de culpa. Su determinación es central en juicios de daños y perjuicios.",
    areaLegal: "civil_familia",
    terminosRelacionados: ["responsabilidad civil", "daños y perjuicios", "dolo"],
  },
  {
    termino: "Poder General",
    letra: "P",
    slug: slugify("Poder General"),
    definicionCorta:
      "Instrumento notarial que autoriza a una persona a actuar en nombre de otra en todos los actos jurídicos.",
    definicionLarga:
      "El poder general es un instrumento público otorgado ante escribano público que faculta al apoderado (mandatario) para representar al poderdante en todo tipo de actos y negocios jurídicos. Se diferencia del poder especial, que autoriza sólo para actos determinados. El poder general incluye típicamente facultades para administrar bienes, realizar actos de disposición, comparecer ante tribunales, celebrar contratos, entre otros. Su vigencia puede ser limitada en el tiempo o indefinida.",
    areaLegal: "civil_familia",
    sinonimos: ["poder notarial", "mandato"],
    terminosRelacionados: ["poder especial", "mandatario", "apoderado"],
  },
  {
    termino: "Prescripción",
    letra: "P",
    slug: slugify("Prescripción"),
    definicionCorta:
      "Extinción de derechos o liberación de obligaciones por el transcurso del tiempo.",
    definicionLarga:
      "La prescripción liberatoria es la extinción de la acción (no del derecho) para reclamar judicialmente por el transcurso del tiempo sin ejercerla. El Código Civil y Comercial establece plazos variables según la materia: 5 años (regla general), 3 años (daños, honorarios), 2 años (accidentes de trabajo, laboral general), 1 año (vicios redhibitorios), entre otros. La prescripción puede interrumpirse (queda sin efecto y comienza a correr de nuevo) por demanda judicial, reconocimiento de deuda o solicitud de mediación.",
    areaLegal: "general",
    terminosRelacionados: ["caducidad", "plazo", "prescripción adquisitiva"],
  },
  {
    termino: "Preaviso",
    letra: "P",
    slug: slugify("Preaviso"),
    definicionCorta:
      "Notificación anticipada de extinción del contrato de trabajo que debe darse en plazos fijados por la LCT.",
    definicionLarga:
      "El preaviso (Art. 231-233 LCT) es la notificación que debe dar cualquiera de las partes con anticipación a la extinción del contrato de trabajo. Los plazos son: 15 días durante el período de prueba, 1 mes para antigüedad hasta 5 años, y 2 meses para antigüedad mayor. Si el empleador no otorga el preaviso, debe abonar la indemnización sustitutiva equivalente a los salarios del período (Art. 232 LCT). Durante el preaviso el trabajador tiene derecho a 2 horas diarias para buscar empleo.",
    areaLegal: "laboral",
    terminosRelacionados: [
      "despido sin causa",
      "indemnización por despido",
      "antigüedad laboral",
      "LCT",
    ],
  },
  {
    termino: "Proceso Penal",
    letra: "P",
    slug: slugify("Proceso Penal"),
    definicionCorta: "Conjunto de actos judiciales para investigar un delito y juzgar al imputado.",
    definicionLarga:
      "El proceso penal en Argentina se rige por el Código Procesal Penal Federal (CPPF) y los códigos provinciales. Las etapas principales son: investigación preliminar (fiscal), audiencia de imputación (donde se le comunican los cargos al imputado), prisión preventiva (si corresponde), etapa intermedia y juicio oral y público. El imputado tiene garantías constitucionales: derecho a defensa, a no declarar contra sí mismo, a la presunción de inocencia, y a un juicio justo.",
    areaLegal: "penal",
    terminosRelacionados: ["imputado", "fiscal", "defensor", "juicio oral", "prisión preventiva"],
  },
  {
    termino: "Régimen Comunicacional",
    letra: "R",
    slug: slugify("Régimen Comunicacional"),
    definicionCorta:
      "Regulación judicial del tiempo de contacto entre el progenitor no conviviente y sus hijos.",
    definicionLarga:
      "El régimen de comunicación (antes llamado 'régimen de visitas') regula los tiempos en que el progenitor que no tiene el cuidado personal cotidiano comparte con sus hijos. El Código Civil y Comercial (Art. 652) establece que los progenitores deben acordarlo de mutuo acuerdo o, en su defecto, el juez lo fijará según las circunstancias. Incluye visitas, vacaciones, comunicación telefónica o virtual. Su incumplimiento puede acarrear sanciones y modificación del cuidado personal.",
    areaLegal: "civil_familia",
    sinonimos: ["régimen de visitas"],
    terminosRelacionados: ["cuidado personal", "divorcio", "alimentos"],
  },
  {
    termino: "Sucesión",
    letra: "S",
    slug: slugify("Sucesión"),
    definicionCorta:
      "Proceso por el cual se transmiten los bienes, derechos y obligaciones de una persona fallecida a sus herederos.",
    definicionLarga:
      "La sucesión o herencia es la transmisión del patrimonio de una persona fallecida (causante) a sus sucesores (herederos). El Código Civil y Comercial regula dos tipos: la sucesión intestada (sin testamento, según el orden hereditario legal: descendientes, ascendientes, cónyuge, colaterales) y la testamentaria (con testamento válido). El proceso sucesorio judicial (declaratoria de herederos, inventario, partición) es gestionado por un abogado y culmina con la adjudicación de los bienes.",
    areaLegal: "civil_familia",
    sinonimos: ["herencia", "sucesión hereditaria"],
    terminosRelacionados: ["testamento", "heredero", "partición", "copropiedad"],
  },
  {
    termino: "Telegrama Laboral",
    letra: "T",
    slug: slugify("Telegrama Laboral"),
    definicionCorta:
      "Comunicación fehaciente gratuita para el trabajador para notificar actos laborales al empleador.",
    definicionLarga:
      "El telegrama laboral es un servicio gratuito del Correo Oficial para el trabajador (Ley 23.789) que permite enviar comunicaciones con valor legal al empleador. Es una de las formas más utilizadas para notificar despidos indirectos, intimar por derechos, rechazar despidos con causa injustificados, o solicitar registración del vínculo laboral. El incumplimiento del empleador ante una intimación por telegrama puede generar presunciones en su contra y multas adicionales.",
    areaLegal: "laboral",
    sinonimos: ["telegrama obrero"],
    terminosRelacionados: ["carta documento", "despido", "LCT"],
  },
  {
    termino: "Testamento",
    letra: "T",
    slug: slugify("Testamento"),
    definicionCorta:
      "Acto jurídico unilateral por el cual una persona dispone de sus bienes para después de su muerte.",
    definicionLarga:
      "El testamento es un acto jurídico unilateral, personalísimo, libre y revocable por el cual una persona (testador) dispone de sus bienes, derechos y obligaciones para después de su muerte. El Código Civil y Comercial reconoce tres formas: ológrafo (escrito, fechado y firmado de puño y letra del testador), por acto público (ante escribano y testigos) y cerrado (en sobre cerrado ante escribano). El testamento no puede violar la legítima hereditaria de los herederos forzosos.",
    areaLegal: "civil_familia",
    terminosRelacionados: ["sucesión", "heredero", "legítima"],
  },
  {
    termino: "Usucapión",
    letra: "U",
    slug: slugify("Usucapión"),
    definicionCorta:
      "Adquisición del dominio de un bien por posesión continua, pública y pacífica durante el plazo legal.",
    definicionLarga:
      "La usucapión o prescripción adquisitiva es el modo de adquirir el dominio de un bien (generalmente inmueble) por la posesión continua, pública, pacífica y no interrumpida durante el plazo que establece la ley. El Código Civil y Comercial establece 20 años para la usucapión larga (sin justo título ni buena fe) y 10 años para la corta (con justo título y buena fe). Es un proceso judicial donde el poseedor debe acreditar el cumplimiento de todos los requisitos.",
    areaLegal: "civil_familia",
    sinonimos: ["prescripción adquisitiva"],
    terminosRelacionados: ["dominio", "posesión", "inmueble"],
  },
];
