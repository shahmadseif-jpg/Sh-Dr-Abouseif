/**
 * Research & publications metadata — safe to import in client components.
 * For full content loading (server-side), see lib/research-server.ts
 */

export type ResearchType =
  | 'book'
  | 'conference-paper'
  | 'journal-paper'
  | 'book-chapter'
  | 'monograph';

export type ResearchCategory =
  | 'fiqh-and-fatwa'
  | 'imamship'
  | 'minorities'
  | 'quranic-studies'
  | 'civilization';

export interface ResearchMeta {
  slug: string;
  type: ResearchType;
  category: ResearchCategory;

  // Year & date
  year: number;
  isoDate: string; // YYYY-MM-DD
  date: { ar: string; en: string; es?: string };

  // Titles & description
  title: { ar: string; en: string; es?: string };
  subtitle?: { ar: string; en: string; es?: string };
  abstract: { ar: string; en: string; es?: string };

  // Venue / Publication info
  venue: { ar: string; en: string; es?: string };
  location?: { ar: string; en: string; es?: string }; // City, Country
  publisher?: { ar: string; en: string; es?: string };

  // Document metadata
  pages?: number;
  language: 'ar' | 'en' | 'bilingual';
  isbn?: string;
  doi?: string;

  // Files & links
  // pdfUrl can be a single path (legacy) or a bilingual { ar, en } map.
  pdfUrl?: string | { ar?: string; en?: string };
  externalUrl?: string; // link to publisher / arxiv / etc.
  coverImage?: string; // for books primarily

  // Keywords
  keywords?: { ar: string[]; en: string[]; es?: string[] };

  // Display options
  featured?: boolean;
  draft?: boolean;
}

export const researchMeta: ResearchMeta[] = [
  // بحث محكَّم مُقدَّم إلى مؤتمر AMJA العاشر (٢٠١٣م)
  {
    slug: 'women-and-dawah-west',
    type: 'conference-paper',
    category: 'minorities',
    year: 2013,
    isoDate: '2013-03-01',
    date: { ar: 'مارس ٢٠١٣م', en: 'March 2013', es: 'Marzo de 2013' },
    title: {
      ar: 'المرأة والدعوة في المجتمع الغربي',
      en: 'Women and Daʿwah in Western Society',
      es: 'La mujer y la daʿwah en la sociedad occidental',
    },
    subtitle: {
      ar: 'في أهليّة المرأة وحقِّها في الدعوة، ونوازلِ حضورها الإعلاميّ والعامّ في الغرب',
      en: "On women's legal capacity and right to daʿwah, and the contemporary questions of her media and public presence in the West",
      es: 'Sobre la capacidad jurídica de la mujer y su derecho a la daʿwah, y las cuestiones contemporáneas de su presencia mediática y pública en Occidente',
    },
    abstract: {
      ar: 'بحثٌ يؤصِّل لأهليّة المرأة الكاملة في الإسلام — السياسيّة والتكليفيّة وفي الشهادة والإجارة — ثمّ يُنزِّل ذلك التأصيل على نوازلِ دعوتها في المجتمع الغربيّ: محاضرتِها في المجامع المختلطة، وظهورِها الإعلاميّ، وتقديمِها للبرامج، ومنعِ الزوج لها من النشاط الدعويّ، ووعظِها الرجالَ في المساجد والمؤتمرات. ويقرِّر — بين طرفَي الإفراط والتفريط — موقفًا وسطًا منضبطًا بالضوابط الشرعيّة، يجعل المرأةَ جزءًا فاعلًا في المجتمع دون انفلاتٍ ولا انكفاء.',
      en: "A study grounding women's full legal capacity (ahliyyah) in Islam — political, in religious obligation, in testimony, and in granting protection — and then applying that grounding to the contemporary questions of her daʿwah in Western society: lecturing in mixed assemblies, media appearance, hosting programs, a husband's prevention of her daʿwah activity, and admonishing men in mosques and conferences. Between the two extremes of excess and neglect, it argues for a disciplined middle position, bound by the controls of the Sharia, that makes the woman an active part of society without licentiousness or withdrawal.",
      es: 'Un estudio que fundamenta la plena capacidad jurídica (ahliyyah) de la mujer en el islam —política, en la obligación religiosa, en el testimonio y en la concesión de protección— y luego aplica ese fundamento a las cuestiones contemporáneas de su daʿwah en la sociedad occidental: dar conferencias en asambleas mixtas, la aparición mediática, presentar programas, el impedimento del esposo a su actividad de daʿwah, y predicar a los hombres en mezquitas y conferencias. Entre los dos extremos del exceso y la negligencia, defiende una posición media disciplinada, sujeta a los controles de la Sharía, que hace de la mujer una parte activa de la sociedad sin libertinaje ni reclusión.',
    },
    venue: {
      ar: 'المؤتمر السنوي العاشر لمجمع فقهاء الشريعة بأمريكا (AMJA)',
      en: '10th Annual Conference — Assembly of Muslim Jurists of America (AMJA)',
      es: '10.ª Conferencia Anual — Asamblea de Juristas Musulmanes de América (AMJA)',
    },
    location: { ar: 'الولايات المتحدة الأمريكية', en: 'United States', es: 'Estados Unidos' },
    pages: 47,
    language: 'ar',
    externalUrl: 'https://www.amjaonline.org/wp-content/uploads/2019/02/2013-8-dawah-women.pdf',
    keywords: {
      ar: ['المرأة', 'الدعوة', 'فقه الأقليات', 'المجتمع الغربي', 'أهلية المرأة', 'الاختلاط', 'الإعلام'],
      en: ['women', 'daʿwah', 'fiqh of minorities', 'Western society', "women's legal capacity", 'media', 'AMJA'],
      es: ['mujer', 'daʿwah', 'fiqh de las minorías', 'sociedad occidental', 'capacidad jurídica de la mujer', 'medios', 'AMJA'],
    },
  },
  // دراسة فقهية أصولية مقاصدية — على هامش موسم الحج ١٤٤٧هـ
  {
    slug: 'farewell-tawaf',
    type: 'monograph',
    category: 'fiqh-and-fatwa',
    year: 2026,
    isoDate: '2026-06-06',
    date: { ar: 'موسم الحجّ ١٤٤٧هـ', en: 'Hajj Season 1447 AH (2026)', es: 'Temporada del Hach 1447 H (2026)' },
    title: {
      ar: 'طوافُ الوداع بين الإلزام والرِّفق',
      en: 'The Farewell Ṭawāf Between Obligation and Gentleness',
      es: 'El Ṭawāf de Despedida entre la obligación y la indulgencia',
    },
    subtitle: {
      ar: 'تحريرٌ في الأدلّة وطرائق الاستدلال ومناطات الخلاف والترجيح المقاصديّ',
      en: 'A critical examination of the evidences, the modes of inference, the loci of disagreement, and objective-based weighing',
      es: 'Un examen crítico de las pruebas, los métodos de inferencia, los puntos de divergencia y la ponderación según los fines superiores',
    },
    abstract: {
      ar: 'دراسةٌ فقهيّةٌ أصوليّةٌ مقاصديّةٌ مقارِنةٌ في حكم طواف الوداع، تُحرِّر محلَّ النزاع وتُبيِّن أنّ مدارَ الخلاف ليس ثبوتَ النصّ بل دلالةَ الأمر، وتكييفَ رخصة الحائض، وتكييفَ العبادة بين الاستقلال والارتباط، والقياسَ على واجبات الحجّ في الجبر بالدم. وتنتهي — بعد عرض أقوال الفقهاء الثلاثة (الوجوب مع الجبر بالدم، والسنّيّة بلا شيء على التارك، والوجوب بلا دمٍ عند الظاهريّة) ومناقشةِ الأدلّة على طريقة ابن رشد في ردّ الفروع إلى أصولها — إلى فكِّ التلازم بين أصل الطلب والجبرِ بالدم: فيُسلَّم بظاهر الأمر في تأكُّد الطلب، ويُمنَع الجبرُ بالدم لخروج الوداع عن مسمّى النُّسُك المجبور؛ والراجح نفيُ الدم عن تاركه، مع بقاء قول الجمهور معتبَراً متينَ المأخذ. عرضُ نظرٍ بين قولين سائغين، لا تخطئةَ لإمامٍ ولا غضَّ من حجّة.',
      en: 'A comparative study in fiqh, legal theory (uṣūl), and the higher objectives (maqāṣid) concerning the ruling on the Farewell Ṭawāf. It clarifies the precise point of dispute and shows that the axis of disagreement is not the authenticity of the text but the import of the command, the characterization of the menstruating woman’s dispensation, the characterization of the act as either independent or bound to the Hajj, and the analogy with the obligatory rites of Hajj in requiring a blood-offering (dam). After presenting the three juristic positions (obligation with blood-expiation; a confirmed sunna with nothing due upon the one who omits it; and obligation without blood per the Ẓāhirīs) and examining the evidences along Ibn Rushd’s method of returning branches to their roots, the study concludes by decoupling the basis of the demand from the blood-offering: the apparent import of the command — its emphatic character — is conceded, while the blood-offering is denied because the Farewell Ṭawāf falls outside the category of the expiable rite. The preponderant view is that no blood is due upon the one who omits it, while the majority’s position remains weighty and well-grounded. This is a weighing of views between two valid positions, not a charge of error against any imam nor a belittling of any argument.',
      es: 'Un estudio comparado de fiqh, teoría jurídica (uṣūl) y fines superiores (maqāṣid) sobre el estatuto del Ṭawāf de Despedida. Precisa el punto exacto de la controversia y muestra que el eje del desacuerdo no es la autenticidad del texto, sino el alcance del mandato, la caracterización de la dispensa de la mujer menstruante, la caracterización del acto como independiente o ligado al Hach, y la analogía con los ritos obligatorios del Hach en cuanto a exigir una ofrenda de sangre (dam). Tras exponer las tres posiciones de los juristas (obligación con expiación de sangre; sunna confirmada sin nada sobre quien lo omite; y obligación sin sangre según los Ẓāhiríes) y examinar las pruebas conforme al método de Ibn Rušd de devolver las ramas a sus raíces, el estudio concluye desligando el fundamento de la exigencia de la ofrenda de sangre: se concede el sentido aparente del mandato —su carácter enfático—, pero se niega la ofrenda de sangre porque el Ṭawāf de Despedida queda fuera de la categoría del rito expiable. La opinión preponderante es que no se debe sangre alguna por quien lo omite, sin que ello reste solidez ni fundamento a la posición de la mayoría. Es una ponderación entre dos posturas válidas, no una imputación de error a ningún imam ni un menosprecio de argumento alguno.',
    },
    venue: {
      ar: 'دراسةٌ فقهيّةٌ أصوليّةٌ مقاصديّةٌ مقارِنة — النسخة النهائيّة الجامعة على هامش موسم الحجّ ١٤٤٧هـ',
      en: 'A comparative uṣūlī–maqāṣid study in fiqh — final consolidated version, on the margins of the Hajj season 1447 AH',
      es: 'Estudio comparado de fiqh uṣūlī–maqāṣid — versión final consolidada, al margen de la temporada del Hach 1447 H',
    },
    language: 'ar',
    keywords: {
      ar: ['طواف الوداع', 'الحجّ', 'دلالة الأمر', 'الجبر بالدم', 'النُّسُك', 'مناطات الخلاف', 'الترجيح المقاصدي', 'الفقه المقارن'],
      en: ['Farewell Ṭawāf', 'Hajj', 'import of the command', 'blood-offering (dam)', 'rite (nusuk)', 'loci of disagreement', 'maqāṣid-based weighing', 'comparative fiqh'],
      es: ['Ṭawāf de Despedida', 'Hach', 'alcance del mandato', 'ofrenda de sangre (dam)', 'rito (nusuk)', 'puntos de divergencia', 'ponderación maqāṣid', 'fiqh comparado'],
    },
    featured: true,
  },

  // ورقة المؤتمر الدولي الأول — مركز المعرفة (ماليزيا) 2026
  {
    slug: 'tafsir-renewal-and-ai',
    type: 'conference-paper',
    category: 'quranic-studies',
    year: 2026,
    isoDate: '2026-06-24',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    title: {
      ar: 'التفسير القرآنيّ بين تجدّد الواقع وتجدّد الأدوات: الذكاء الاصطناعيّ نموذجاً',
      en: 'Qur’anic Exegesis Between the Renewal of Reality and the Renewal of Tools: Artificial Intelligence as a Case Study',
      es: 'La exégesis coránica entre la renovación de la realidad y la renovación de las herramientas: la inteligencia artificial como caso de estudio',
    },
    subtitle: {
      ar: 'قراءةٌ أصوليّةٌ في موقع الذكاء الاصطناعيّ من تطوّر علم التفسير',
      en: 'An uṣūlī reading of the place of artificial intelligence in the development of the science of tafsīr',
      es: 'Una lectura uṣūlī del lugar de la inteligencia artificial en el desarrollo de la ciencia del tafsīr',
    },
    abstract: {
      ar: 'تُعالِجُ هذه الورقةُ سؤالاً معرفيّاً يتجاوزُ الاستعمالَ التقنيَّ المباشرَ للذكاء الاصطناعيّ في التفسير إلى ما هو أعمق: هل التفسيرُ القرآنيُّ علمٌ قابلٌ للتجدّد استجابةً لتجدّد الواقع وتجدّد أدوات المعرفة، وأين يقعُ الذكاءُ الاصطناعيُّ من هذا المسار؟ وتقترحُ الورقةُ منهجاً لقراءة تاريخ التفسير بوصفه سلسلةً من استيعاب أدوات المعرفة المتعاقبة (الرواية، اللغة، المنطق، المقاصد، الدراسات الأدبيّة)، ثمّ تُنزِّلُ عليه سؤالَ الذكاء الاصطناعيّ قياساً واختباراً. وتخلُص — عبر تحليلٍ مفهوميٍّ وحالةٍ توضيحيّةٍ مطبّقةٍ على نموذجٍ لغويٍّ مُسمّى — إلى أنّ الذكاء الاصطناعيّ أداةٌ معرفيّةٌ معزِّزةٌ في وظيفته، يحمل احتمالَ تحوّلٍ بنيويٍّ مرهونٍ بشروطٍ محدّدة، وأنّ موقعَه الصحيح هو «المفسِّر المعزَّز لا المفسِّر البديل». وتُسهِم الورقةُ بمعيارٍ أصوليٍّ للتمييز بين الخطأ الإحصائيّ والزيف الإسناديّ في مخرجات النماذج.',
      en: 'This paper addresses an epistemological question that moves beyond the direct technical use of artificial intelligence in tafsīr to something deeper: is Qur’anic exegesis a science capable of renewal in response to the renewal of reality and of the tools of knowledge — and where does artificial intelligence fall within this trajectory? The paper proposes a method for reading the history of tafsīr as a series of successive assimilations of the tools of knowledge (narration, language, logic, the higher objectives [maqāṣid], and literary studies), then applies the question of AI to it by analogy and testing. Through a conceptual analysis and an applied illustrative case study on a named language model, it concludes that artificial intelligence is a knowledge tool that augments the exegete’s function, carrying the possibility of a structural shift contingent upon specific conditions, and that its correct position is that of "the augmented exegete, not the substitute exegete." The paper contributes an uṣūlī (foundational) criterion for distinguishing between statistical error and isnād (chain-of-transmission) forgery in the outputs of these models.',
      es: 'Esta ponencia aborda una pregunta epistemológica que va más allá del uso técnico directo de la inteligencia artificial en el tafsīr hacia algo más hondo: ¿es la exégesis coránica una ciencia capaz de renovarse en respuesta a la renovación de la realidad y de las herramientas del conocimiento, y dónde se sitúa la inteligencia artificial en esta trayectoria? La ponencia propone un método para leer la historia del tafsīr como una serie de asimilaciones sucesivas de las herramientas del conocimiento (la narración, la lengua, la lógica, los fines superiores [maqāṣid] y los estudios literarios), y luego le aplica la pregunta de la inteligencia artificial por analogía y comprobación. Mediante un análisis conceptual y un caso ilustrativo aplicado a un modelo de lenguaje nombrado, concluye que la inteligencia artificial es una herramienta de conocimiento que potencia la función del exégeta, que porta la posibilidad de un cambio estructural condicionado a requisitos específicos, y que su lugar correcto es el de «el exégeta aumentado, no el exégeta sustituto». La ponencia aporta un criterio uṣūlī (fundacional) para distinguir entre el error estadístico y la falsificación del isnād (cadena de transmisión) en los resultados de estos modelos.',
    },
    venue: {
      ar: 'المؤتمر العلميّ الدوليّ الأوّل — مركز المعرفة للبحوث والتعليم (ماليزيا)',
      en: 'First International Academic Conference — Knowledge Center for Research and Education (Malaysia)',
      es: 'Primera Conferencia Académica Internacional — Centro del Conocimiento para la Investigación y la Educación (Malasia)',
    },
    location: {
      ar: 'ماليزيا',
      en: 'Malaysia',
      es: 'Malasia',
    },
    publisher: {
      ar: 'بالتعاون مع كلّيّة الشريعة والدراسات الإسلاميّة بجامعة قطر وأكاديميّة الأئمّة بأمريكا — محور «الدراسات الإسلاميّة والعربيّة في عصر الذكاء الاصطناعيّ: التحدّيات والآفاق»',
      en: 'In collaboration with the College of Sharia and Islamic Studies, Qatar University, and the American Imams Academy — Theme: "Islamic and Arabic Studies in the Age of Artificial Intelligence: Challenges and Horizons"',
      es: 'En colaboración con la Facultad de Sharía y Estudios Islámicos de la Universidad de Qatar y la Academia Americana de Imames — Eje: «Los estudios islámicos y árabes en la era de la inteligencia artificial: desafíos y horizontes»',
    },
    pages: 23,
    language: 'ar',
    pdfUrl: '/research/tafsir-renewal-and-ai/paper.pdf',
    keywords: {
      ar: ['التفسير القرآني', 'تجدّد الأدوات', 'الذكاء الاصطناعي', 'النماذج اللغوية الكبيرة', 'إنتاج المعرفة', 'الزيف الإسنادي', 'المفسّر المعزَّز'],
      en: ['Qur’anic exegesis', 'renewal of tools', 'artificial intelligence', 'large language models', 'knowledge production', 'isnād forgery', 'the augmented exegete'],
      es: ['exégesis coránica', 'renovación de las herramientas', 'inteligencia artificial', 'grandes modelos de lenguaje', 'producción del conocimiento', 'falsificación del isnād', 'el exégeta aumentado'],
    },
    featured: true,
  },

  // البحث الجديد ـ 2026
  {
    slug: 'fatwa-digital-transformation',
    type: 'book',
    category: 'fiqh-and-fatwa',
    year: 2026,
    isoDate: '2026-05-17',
    date: { ar: 'مايو ٢٠٢٦', en: 'May 2026', es: 'Mayo de 2026' },
    title: {
      ar: 'الفتوى في زمن التَّحوّل الرَّقميّ',
      en: 'Fatwa in the Age of Digital Transformation',
      es: 'La fatwa en la era de la transformación digital',
    },
    subtitle: {
      ar: 'من أَهليّة المُفتي إلى مَنظومة الإفتاء',
      en: 'From the Eligibility of the Mufti to the Fatwa Ecosystem',
      es: 'De la idoneidad del muftí al ecosistema del dictamen',
    },
    abstract: {
      ar: 'بحثٌ يُطوِّر ويُوسِّع بحثاً محكَّماً قُدِّم لمؤتمر الأَئمّة الخامس عشر لمَجمع فقهاء الشَّريعة بأمريكا (AMJA) عام 2018، ليُجيب على أَسئلة عَصرنا الجَديدة: كيف نَتعامل مع الإفتاء في عَصر الفيديو القَصير والذَّكاء الاصطناعيّ التَّوليديّ؟ يَتكوَّن البحث من عَشرة فصول في ثَلاثة أَقسام (التَّأصيل، التَّحوّل، المقترحات)، يَطرح فيها المؤلّف خَمسة مَفاهيم أَصيلة لم تَكن مَعهودة: تَعريف «الفوضى الرَّقميّة»، «المؤهّلات المركّبة للمُفتي المعاصر»، «المرتبة السابعة المعاصرة (المُجتهد الجَماعيّ المؤسّسيّ)»، «فقه المآلات الرَّقميّة»، ومدوّنة استخدام الذَّكاء الاصطناعيّ للمُفتي. ويَختم البحث بـ«خارطة طريق» بعَشر مَبادرات عمليّة قابلة للتَّنفيذ مرتَّبة على ثلاثة مدَيات: عاجل، متوسط، بعيد.',
      en: 'An academic research work that develops and expands a peer-reviewed paper originally presented at the 15th Annual Imams\' Conference of the Assembly of Muslim Jurists of America (AMJA) in 2018, to address our era\'s new questions: How do we approach fatwa in the age of short-form video and generative AI? Organized in ten chapters across three sections (Foundations, Transformation, Proposals), the work introduces five original concepts not previously articulated: a definition of "digital chaos in fatwa," the "Compound Qualifications of the Contemporary Mufti," the "Seventh Contemporary Rank: The Collective Institutional Mujtahid," the "Jurisprudence of Digital Consequences," and a proposed Code of Conduct for the Mufti\'s use of AI. The work concludes with a practical roadmap of ten initiatives organized across three timelines: urgent, medium-term, and long-term.',
      es: 'Una investigación académica que desarrolla y amplía una ponencia arbitrada presentada originalmente en la Decimoquinta Conferencia Anual de Imames de la Asamblea de Juristas Musulmanes de América (AMJA) en 2018, para responder a las nuevas preguntas de nuestra era: ¿cómo abordamos el dictamen (fatwa) en la era del vídeo de formato corto y la inteligencia artificial generativa? Organizada en diez capítulos a lo largo de tres secciones (Fundamentos, Transformación, Propuestas), la obra introduce cinco conceptos originales no articulados antes: una definición del «caos digital en el dictamen», las «cualificaciones compuestas del muftí contemporáneo», el «séptimo rango contemporáneo: el muytahid colectivo e institucional», la «jurisprudencia de las consecuencias digitales», y un código de conducta propuesto para el uso de la inteligencia artificial por el muftí. La obra concluye con una hoja de ruta práctica de diez iniciativas ejecutables organizadas en tres horizontes: urgente, medio y lejano.',
    },
    venue: {
      ar: 'تَطوير لبَحث محكَّم — مَجمع فقهاء الشَّريعة بأمريكا (AMJA)',
      en: 'Expansion of a peer-reviewed paper — Assembly of Muslim Jurists of America (AMJA)',
      es: 'Ampliación de una ponencia arbitrada — Asamblea de Juristas Musulmanes de América (AMJA)',
    },
    publisher: {
      ar: 'مَشروع نَشر متعدّد الطَّبقات',
      en: 'Multi-layer Publication Project',
      es: 'Proyecto de publicación multicapa',
    },
    pages: 283,
    language: 'bilingual',
    pdfUrl: {
      ar: '/research/fatwa-digital-transformation/book.pdf',
      en: '/research/fatwa-digital-transformation/book-en.pdf',
    },
    keywords: {
      ar: ['فتوى', 'فوضى الإفتاء', 'الذكاء الاصطناعي', 'فقه الأقليات', 'المنظومة الإفتائية', 'AMJA'],
      en: ['fatwa', 'religious authority', 'artificial intelligence', 'minorities fiqh', 'AMJA', 'institutional ijtihad'],
      es: ['fatwa', 'caos del dictamen', 'inteligencia artificial', 'jurisprudencia de las minorías', 'ecosistema del dictamen', 'AMJA'],
    },
    featured: true,
  },

  // بحث المؤتمر العالمي العاشر — القاهرة 2025
  {
    slug: 'fatwa-us-ai-2025',
    type: 'conference-paper',
    category: 'fiqh-and-fatwa',
    year: 2025,
    isoDate: '2025-08-12',
    date: { ar: 'أغسطس ٢٠٢٥', en: 'August 2025', es: 'Agosto de 2025' },
    title: {
      ar: 'واقِع الفَتوى في الوِلايات المُتَّحدة الأَمريكيّة في عَصر الذَّكاء الاصطناعيّ',
      en: 'The Reality of Fatwa in the United States in the Age of Artificial Intelligence',
      es: 'La realidad de la fatwa en los Estados Unidos en la era de la inteligencia artificial',
    },
    subtitle: {
      ar: 'إِشكاليّات وحُلول',
      en: 'Challenges and Solutions',
      es: 'Desafíos y soluciones',
    },
    abstract: {
      ar: 'بَحثٌ محكَّم قُدِّم في المؤتمر العالميّ العاشر للأَمانة العامّة لدُور وهَيئات الإفتاء في العالم — القاهرة، أغسطس 2025، تَحت عُنوان «صِناعة المُفتي الرَّشيد في عَصر الذَّكاء الاصطناعيّ». يَرسم البَحث خارطةً دَقيقة لواقِع الفَتوى الرَّقميّة في الوِلايات المُتَّحدة الأَمريكيّة، مُتتبِّعاً الإِشكاليّات التِّقنيّة واللُّغويّة والثَّقافيّة التي يُواجِهها السّائل والمُفتي على السَّواء، ومُقترِحاً إِطاراً مَنهجيّاً إِصلاحيّاً يَضمَن مُطابقة المُخرَجات الفِقهيّة لمَقاصِد الشَّريعة وسَلامة الخُصوصيّة الثَّقافيّة. يَعتَمد البَحث المَنهَج الاستِقرائيّ التَّحليليّ، ويَستَنِد إلى اثنتي عَشرة مُقابلة شِبه مُهَيكَلة مَع أَئمّة ومُفتين في الواقِع الأَمريكيّ، ويَعرِض في ثَلاثة فُصول: واقِع الفَتوى في أَمريكا، التَّحدّيات المَنهجيّة والشَّرعيّة للفَتوى الرَّقميّة، ومَعالم بِناء مَنظومةٍ إِفتائيّةٍ رَقميّةٍ راشِدة في السِّياق الأَمريكيّ.',
      en: 'A peer-reviewed paper presented at the 10th World Conference of the General Secretariat for Houses and Bodies of Iftaa Worldwide (Cairo, August 2025), held under the theme "Forming the Wise Mufti in the Age of Artificial Intelligence." The paper maps the reality of digital fatwa in the United States, tracing the technical, linguistic, and cultural challenges facing both the questioner (mustafti) and the mufti, and proposes a reformist methodological framework that secures alignment between juristic outputs, the higher objectives of Sharia, and the cultural specificity of American Muslims. Employing an inductive-analytical method grounded in twelve semi-structured interviews with imams and muftis active in the U.S. context, the paper unfolds across three chapters: the reality of fatwa in America; the methodological and Shariah-based challenges of digital fatwa; and the contours of a wise digital fatwa ecosystem for the American setting.',
      es: 'Una ponencia arbitrada presentada en la Décima Conferencia Mundial de la Secretaría General de las Casas y Organismos de Iftāʾ del Mundo (El Cairo, agosto de 2025), celebrada bajo el lema «La formación del muftí sabio en la era de la inteligencia artificial». La ponencia traza un mapa preciso de la realidad de la fatwa digital en los Estados Unidos, rastreando los desafíos técnicos, lingüísticos y culturales que encaran tanto el preguntante (mustaftī) como el muftí, y propone un marco metodológico reformista que asegure la concordancia entre los resultados jurídicos, los fines superiores de la sharía y la especificidad cultural de los musulmanes estadounidenses. Empleando un método inductivo-analítico fundamentado en doce entrevistas semiestructuradas con imames y muftíes activos en el contexto estadounidense, la ponencia se despliega en tres capítulos: la realidad de la fatwa en América; los desafíos metodológicos y sharaicos de la fatwa digital; y los contornos de un ecosistema de fatwa digital sabio para el entorno estadounidense.',
    },
    venue: {
      ar: 'المؤتمر العالميّ العاشر — الأَمانة العامّة لدُور وهَيئات الإفتاء في العالم',
      en: '10th World Conference — General Secretariat for Houses and Bodies of Iftaa Worldwide',
      es: 'Décima Conferencia Mundial — Secretaría General de las Casas y Organismos de Iftāʾ del Mundo',
    },
    location: {
      ar: 'القاهرة — جُمهوريّة مِصر العربيّة',
      en: 'Cairo — Arab Republic of Egypt',
      es: 'El Cairo — República Árabe de Egipto',
    },
    publisher: {
      ar: 'الأَمانة العامّة لدُور وهَيئات الإفتاء في العالم (تابِعة لدار الإفتاء المصريّة) — أَبحاث المؤتمر، المُجلَّد الخامس، المحور الرّابع: الذَّكاء الاصطناعيّ وتَطوير العَمل المؤسَّسيّ الإفتائيّ — ص ٢٣٠٢–٢٣٤٣',
      en: 'General Secretariat for Houses and Bodies of Iftaa Worldwide (affiliated with the Egyptian Dar al-Iftaa) — Conference Proceedings, Volume 5, Track 4: AI and the Development of Institutional Fatwa Work — pp. 2302–2343',
      es: 'Secretaría General de las Casas y Organismos de Iftāʾ del Mundo (adscrita a Dar al-Iftāʾ de Egipto) — Actas de la conferencia, Volumen 5, Eje 4: La inteligencia artificial y el desarrollo del trabajo institucional del dictamen — pp. 2302–2343',
    },
    pages: 42,
    language: 'ar',
    isbn: '978-977-6998-61-2',
    pdfUrl: '/research/fatwa-us-ai-2025/paper.pdf',
    keywords: {
      ar: ['الفتوى الرقمية', 'الذكاء الاصطناعي', 'الولايات المتحدة', 'فقه الأقليات', 'صناعة المفتي', 'المنظومة الإفتائية', 'دار الإفتاء المصرية'],
      en: ['digital fatwa', 'artificial intelligence', 'United States', 'minorities fiqh', 'mufti formation', 'fatwa ecosystem', 'Egyptian Dar al-Iftaa'],
      es: ['fatwa digital', 'inteligencia artificial', 'Estados Unidos', 'jurisprudencia de las minorías', 'formación del muftí', 'ecosistema del dictamen', 'Dar al-Iftāʾ de Egipto'],
    },
    featured: true,
  },

  // البحث الأصلي 2018
  {
    slug: 'fatwa-mufti-eligibility-2018',
    type: 'conference-paper',
    category: 'fiqh-and-fatwa',
    year: 2018,
    isoDate: '2018-02-25',
    date: { ar: 'فبراير ٢٠١٨', en: 'February 2018', es: 'Febrero de 2018' },
    title: {
      ar: 'الفتوى بين أَهليّة المُفتي وفوضى الإفتاء',
      en: 'Fatwa Between the Mufti\'s Eligibility and the Chaos of Fatwa-Issuance',
      es: 'La fatwa entre la idoneidad del muftí y el caos de la emisión de dictámenes',
    },
    abstract: {
      ar: 'بَحثٌ محكَّم قُدِّم في مؤتمر الأَئمّة الخامس عشر لمَجمع فقهاء الشَّريعة بأمريكا (AMJA) في هيوستن، فبراير 2018. يَطرح البحث تَعريفاً دَقيقاً للفتوى والمُفتي والمستفتي والأَهليّة والفَوضى، ثمّ يُعرّج على شُروط المُفتي في ثلاثة أَقسام (تَكليفيّة، عِلميّة، شَخصيّة)، ويُقدّم تَفصيلاً للصفات الشَّخصيّة الثَّمان للمُفتي. كما يُحلّل ظاهرة فَوضى الإفتاء في زَمنها (الفضائيّات والوسائط الناشئة)، ويَختم بستّ مقترحاتٍ لإصلاح المشهد الإفتائيّ.',
      en: 'A peer-reviewed paper presented at the 15th Annual Imams\' Conference of the Assembly of Muslim Jurists of America (AMJA) in Houston, February 2018. The paper offers precise definitions of fatwa, mufti, mustafti (questioner), eligibility, and chaos. It then examines the conditions of the mufti across three categories (legal capacity, scholarly, and personal), with detailed elaboration of eight personal qualities. The paper diagnoses the chaos of fatwa in its era (satellite channels and emerging media) and concludes with six proposals for reforming the fatwa landscape.',
      es: 'Una ponencia arbitrada presentada en la Decimoquinta Conferencia Anual de Imames de la Asamblea de Juristas Musulmanes de América (AMJA) en Houston, febrero de 2018. La ponencia ofrece definiciones precisas de la fatwa, el muftí, el mustaftī (preguntante), la idoneidad y el caos. Luego examina las condiciones del muftí en tres categorías (de capacidad legal, académicas y personales), con una elaboración detallada de ocho cualidades personales. La ponencia diagnostica el caos del dictamen en su época (los canales satelitales y los medios emergentes) y concluye con seis propuestas para reformar el panorama del dictamen.',
    },
    venue: {
      ar: 'مؤتمر الأَئمّة الخامس عشر — مَجمع فقهاء الشَّريعة بأمريكا (AMJA)',
      en: '15th Annual Imams\' Conference — Assembly of Muslim Jurists of America (AMJA)',
      es: 'Decimoquinta Conferencia Anual de Imames — Asamblea de Juristas Musulmanes de América (AMJA)',
    },
    location: {
      ar: 'هيوستن، تكساس — الولايات المتّحدة الأمريكيّة',
      en: 'Houston, Texas — United States',
      es: 'Houston, Texas — Estados Unidos',
    },
    pages: 34,
    language: 'ar',
    pdfUrl: '/research/fatwa-mufti-eligibility-2018/paper.pdf',
    keywords: {
      ar: ['فتوى', 'أهلية المفتي', 'فوضى الإفتاء', 'AMJA', 'فقه الأقليات'],
      en: ['fatwa', 'mufti eligibility', 'fatwa chaos', 'AMJA', 'minority fiqh'],
      es: ['fatwa', 'idoneidad del muftí', 'caos del dictamen', 'AMJA', 'jurisprudencia de las minorías'],
    },
    featured: true,
  },
];

export function getResearchItem(slug: string): ResearchMeta | undefined {
  return researchMeta.find((r) => r.slug === slug);
}

export function getAllResearch(): ResearchMeta[] {
  return [...researchMeta]
    .filter((r) => !r.draft)
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
}

export function getFeaturedResearch(): ResearchMeta[] {
  return getAllResearch().filter((r) => r.featured);
}

export function getResearchByType(type: ResearchType): ResearchMeta[] {
  return getAllResearch().filter((r) => r.type === type);
}

/**
 * Resolve the PDF URL appropriate to the requested locale.
 * - If pdfUrl is a string, returns it unchanged.
 * - If pdfUrl is an { ar, en } map, returns the requested locale; falls back to the other if missing.
 */
export function getPdfUrl(item: ResearchMeta, locale: string): string | undefined {
  const p = item.pdfUrl;
  if (!p) return undefined;
  if (typeof p === 'string') return p;
  return (p as Record<string, string | undefined>)[locale] || p.ar || p.en;
}

export const researchTypeLabels = {
  ar: {
    book: 'بحث',
    'conference-paper': 'بحث محكَّم في مؤتمر',
    'journal-paper': 'بحث محكَّم في دوريّة',
    'book-chapter': 'فصل في كتاب',
    monograph: 'دراسة',
  },
  en: {
    book: 'Academic Research',
    'conference-paper': 'Peer-Reviewed Conference Paper',
    'journal-paper': 'Peer-Reviewed Journal Article',
    'book-chapter': 'Book Chapter',
    monograph: 'Monograph',
  },
  es: {
    book: 'Investigación académica',
    'conference-paper': 'Ponencia arbitrada de conferencia',
    'journal-paper': 'Artículo arbitrado de revista',
    'book-chapter': 'Capítulo de libro',
    monograph: 'Monografía',
  },
};

export const researchCategoryLabels = {
  ar: {
    'fiqh-and-fatwa': 'الفقه والإفتاء',
    imamship: 'الإمامة والقيادة',
    minorities: 'فقه الأقلّيّات',
    'quranic-studies': 'الدّراسات القرآنيّة',
    civilization: 'القرآن والحَضارة',
  },
  en: {
    'fiqh-and-fatwa': 'Fiqh & Fatwa',
    imamship: 'Imamship & Leadership',
    minorities: 'Minorities Fiqh',
    'quranic-studies': 'Quranic Studies',
    civilization: 'Quran & Civilization',
  },
  es: {
    'fiqh-and-fatwa': 'Jurisprudencia y dictamen',
    imamship: 'Imamato y Liderazgo',
    minorities: 'Jurisprudencia de las minorías',
    'quranic-studies': 'Estudios coránicos',
    civilization: 'El Corán y la Civilización',
  },
};
