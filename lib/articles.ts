/**
 * Articles metadata — safe to import in client components.
 * For file content loading (uses fs), see lib/articles-server.ts
 */

export type ArticleCategory = 'imamship' | 'civilization' | 'family' | 'fiqh' | 'wisdom-insights' | 'maqasid-tafsir';

/** Supported site locales. */
export type Loc = 'ar' | 'en' | 'es';

/** A localized string. `es` is optional; missing values fall back to English. */
export type LocalizedText = { ar: string; en: string; es?: string };

/** Pick the value for a locale, gracefully falling back to English then Arabic. */
export function localize(text: LocalizedText | undefined, locale: string): string {
  if (!text) return '';
  const v = (text as Record<string, string | undefined>)[locale];
  return v ?? text.en ?? text.ar;
}

export interface ArticleMeta {
  slug: string;
  category: ArticleCategory;
  isoDate: string; // YYYY-MM-DD
  date: LocalizedText;
  readingMinutes: number;
  series?: LocalizedText;
  episode?: number;
  title: LocalizedText;
  subtitle?: LocalizedText;
  excerpt: LocalizedText;
  /** Optional cover image (path under /public, e.g. "/articles/slug/cover.jpg") */
  coverImage?: string;
  /** Optional caption displayed under the cover image */
  coverCaption?: LocalizedText;
  draft?: boolean;
}

export const articlesMeta: ArticleMeta[] = [
  // ===== مقال: معرفة النفوس قبل التعريف بالنصوص (التفسير المقاصدي) =====
  {
    slug: 'knowing-souls-before-texts',
    category: 'maqasid-tafsir',
    isoDate: '2026-06-17',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 8,
    title: {
      ar: "معرفة النفوس قبل التعريف بالنصوص",
      en: "Knowing Souls Before Teaching Texts",
      es: "Conocer las almas antes de enseñar los textos",
    },
    subtitle: {
      ar: "خريطةٌ للنفوس قبل المعترك: كيف عرّف الوحيُ النبيَّ ﷺ بأنماط الناس ليُحسِن تبليغَهم",
      en: "How revelation gave the Prophet ﷺ a map of human souls before the encounter, making the discernment of temperaments the foundation of every caller's success",
      es: "Cómo la Revelación enseñó al Profeta ﷺ a leer los corazones antes de transmitirles los textos de la fe",
    },
    excerpt: {
      ar: "في مستهلّ العهد المدنيّ، عرّف اللهُ نبيَّه ﷺ بأصناف الناس الذين سيخالطهم — مؤمنين وكافرين ومنافقين — فكان أوّلَ ما تلقّاه خريطةٌ للنفوس لا للأرض. مقالٌ مقاصديٌّ يقرّر أنّ فقه الطبائع ليس فضيلةً بل واجبٌ يتوقّف عليه نجاحُ التبليغ، مؤصِّلًا له بآية ﴿وما أرسلنا من رسول إلا بلسان قومه﴾ وشواهدِ السيرة، وكاشفًا أنّ للقرآن في تصنيف النفوس أصلًا سابقًا وأعمقَ ممّا انتهى إليه علمُ النفس الحديث: تصنيفٌ يستهدف الشفاء لا حبسَ الناس في أنماطهم.",
      en: "Before the Prophet ﷺ entered Medina to build a nation, revelation acquainted him with the types of people he would meet — believers, disbelievers, and hypocrites — a map of souls rather than soil. This study shows that the discernment of human temperaments is no mere virtue but an obligation upon which the success of conveyance itself depends, drawing on the Qurʾan, the Prophetic biography, and a striking comparison with modern psychology — a classification that seeks healing rather than confining people to their types.",
      es: "En el umbral del período medinense, Dios entregó a Su Profeta ﷺ un mapa de las almas antes que de la tierra, dándole a conocer al creyente, al incrédulo y al hipócrita antes de encontrarlos. Este artículo demuestra, desde el fundamento coránico y los testimonios de la Sīra, que el conocimiento de los temperamentos no es una virtud opcional sino un deber del que depende el éxito de la predicación, y revela cómo el Corán anticipó —con mayor hondura— lo que hoy llama la psicología la clasificación de las personalidades: clasificar no para encerrar a las personas, sino para abrirles la puerta del cambio.",
    },
    coverImage: '/articles/knowing-souls-before-texts/cover.jpg',
  },
  // ===== مقال: التقوى في القرآن الكريم (حِكَمٌ وبصائر) =====
  {
    slug: 'taqwa-in-the-quran',
    category: 'wisdom-insights',
    isoDate: '2026-06-17',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 10,
    title: {
      ar: "التَّقْوَى في القرآن الكريم: من دَلالةِ اللَّفظِ إلى فلسفةِ التطبيق",
      en: "Taqwā in the Noble Qurʾan: From the Meaning of the Word to the Philosophy of Application",
      es: "La taqwā en el Sagrado Corán: del significado de la palabra a la filosofía de la aplicación",
    },
    subtitle: {
      ar: "دراسةٌ قرآنيّةٌ في ماهيّة التقوى ومواطنِها ووظائفِها وميزانِها",
      en: "A Qurʾanic study of taqwā — its true nature, its proper places, its functions, and its scale as the measure of human worth",
      es: "De la mera repetición de una palabra a la posesión de su verdad: esencia, ámbitos, funciones y balanza de la piedad consciente",
    },
    excerpt: {
      ar: "ما من كلمةٍ أكثرُ دورانًا على الألسنة من «التقوى»، ولا أقلُّ منها تحديدًا في الأذهان. دراسةٌ قرآنيّةٌ تُحرّرها من الضبابيّة، فتقرّر أنّ لها ماهيّةً مضبوطة (طاعةٌ وذِكرٌ وشكر)، ومواطنَ تخصُّصٍ تنطق عندها — كلُّ نقطة انفلاتٍ يغيب فيها الرقيب: المال، والطلاق، والشهادة، والقوّة — ووظائفَ في نظم الآي، ومعيارًا تُوزَن به الكرامة. فالتقوى أخلاقُ القادر وطاقةُ البناء، لا خشوعَ العاجز ولا رعبًا يُقعِد الهِمم.",
      en: "\"Taqwā\" is the most repeated word on the Muslim tongue and the least defined in the mind. This study argues that the Qurʾan never left it hazy: it gave taqwā a precise nature (obedience, remembrance, gratitude), summoned it precisely at life's \"points of unrestraint\" where no outer overseer remains — wealth, divorce, testimony, power — and made it the sole measure of human dignity: the ethic of the powerful and an energy of building, not the meekness of the helpless nor a dread that paralyzes resolve.",
      es: "Un recorrido coránico que rescata la taqwā de la nebulosidad en que ha caído y la restituye como concepto preciso y dinámico: no una huida del mundo ni un mero temor que paraliza, sino la vigilancia interior que se activa en cada «punto de desborde» —el dinero, el divorcio, la lengua, el testimonio, el poder— donde calla todo vigilante externo. A través de cuatro estaciones (esencia, especialización, trama y balanza), el Dr. Ahmed Abouseif muestra que la taqwā es la ética del poderoso y el criterio único de la dignidad humana ante Dios.",
    },
    coverImage: '/articles/taqwa-in-the-quran/cover.jpg',
  },
  // ===== مقال: الصحابة وصناعة الوعي العلمي =====
  {
    slug: 'companions-and-knowledge',
    coverImage: '/articles/companions-and-knowledge.png',
    category: 'wisdom-insights',
    isoDate: '2026-06-10',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 6,
    title: { ar: "الصحابة وصناعة الوعي العلمي", en: "The Companions and the Making of Scholarly Awareness", es: "Los Compañeros y la formación de la conciencia científica" },
    subtitle: { ar: "كيف حمل الجيلُ الأول ميراثَ النبوّة؟", en: "How the first generation bore the inheritance of prophethood", es: "¿Cómo portó la primera generación la herencia de la profecía?" },
    excerpt: { ar: "لم يكن العلمُ عند الصحابة ترفًا عقليًّا، بل أصلَ الدين وروحَ الرسالة. قراءةٌ في منهجٍ جمع بين شرف التلقّي وصدق الفهم وأمانة النقل وعلوّ الهمّة — من أثر ابن مسعود في العلم والعمل، إلى رحلة جابرٍ شهرًا في حديثٍ واحد، وتواضع ابن عباس — حتى صار العلمُ مشروعًا حضاريًّا لصناعة الإنسان.", en: "For the Companions, knowledge was no intellectual luxury but the very root of the religion and the spirit of the message. A reading of a method that joined honorable reception, sincere understanding, faithful transmission, and lofty resolve — from Ibn Masʿūd on knowledge-and-action, to Jābir's month-long journey for a single hadith, to Ibn ʿAbbās's humility — until knowledge became a civilizational project for shaping the human being.", es: "Para los Compañeros, el saber no era un lujo intelectual, sino la raíz misma de la religión y el espíritu del Mensaje. Una lectura de un método que unió la recepción honorable, la comprensión sincera, la transmisión fiel y la alta determinación —desde Ibn Masʿūd sobre el saber y la obra, hasta el viaje de un mes de Ŷābir por un solo hadiz y la humildad de Ibn ʿAbbās— hasta que el saber se convirtió en un proyecto civilizador para formar al ser humano." },
  },
  // ===== تأمّل قرآنيّ (حِكَمٌ وبصائر) =====
  {
    slug: 'pure-sincerity',
    coverImage: '/articles/pure-sincerity.png',
    category: 'wisdom-insights',
    isoDate: '2026-06-10',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 7,
    title: { ar: "تأمُّلٌ في الإخلاصِ الخالص", en: "A Reflection on Pure Sincerity", es: "Una reflexión sobre la sinceridad pura" },
    subtitle: { ar: "العطاءُ لوجه الله وحده والتحرُّرُ من رِقِّ المِنَّة", en: "Giving for God's countenance alone, and freedom from the bondage of obligation", es: "Dar solo por el rostro de Dios, y la liberación de la servidumbre del favor" },
    excerpt: { ar: "في خواتيم سورة الليل، يرسم القرآنُ صورةً للنفس وقد بلغت أنقى ما تبلغه في بذلها: تُعطي ولا تنتظر، وتُحسِن ولا تَمُنّ. ثلاثُ آياتٍ تختزل فلسفةَ العطاء كلَّها — نفيُ المعاوضة، فإخلاصُ القصد، فالبشارةُ بالرضا — قراءةٌ تربويّةٌ تُحرّر القلبَ من رِقِّ المِنّة وذُلِّ انتظار العِوض.", en: "In the closing verses of Sūrat al-Layl, the Qurʾan paints the soul at its purest in giving: it gives and expects nothing, does good and never reminds of it. Three brief verses distill the whole philosophy of giving — the negation of exchange, the purity of intent, then the glad tidings of satisfaction — an educative reading that frees the heart from the bondage of obligation.", es: "En los versículos finales de la sura al-Layl, el Corán retrata al alma en lo más puro de su entrega: da y no espera nada, hace el bien y nunca lo recuerda. Tres breves aleyas destilan toda la filosofía del dar —la negación del intercambio, la pureza de la intención y, luego, la albricia de la satisfacción—: una lectura educativa que libera el corazón de la servidumbre del favor." },
  },
  // ===== تأمّل قرآنيّ (الاستجابة) =====
  {
    slug: 'response-is-life',
    coverImage: '/articles/response-is-life.png',
    category: 'wisdom-insights',
    isoDate: '2026-06-10',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 8,
    title: { ar: "الاستجابة حياة", en: "Response Is Life", es: "La respuesta es vida" },
    subtitle: { ar: "قراءةٌ تأصيليّةٌ تربويّةٌ في نداء ﴿اسْتَجِيبُوا لِلَّهِ وَلِلرَّسُولِ إِذَا دَعَاكُمْ لِمَا يُحْيِيكُمْ﴾", en: "A foundational, educative reading of the call: ‘Respond to God and to the Messenger when He calls you to that which gives you life’", es: "Una lectura fundacional y educativa del llamado: «Responded a Dios y al Mensajero cuando os llama a aquello que os da vida»" },
    excerpt: { ar: "ما من نداءٍ في كتاب الله بـ«يا أيها الذين آمنوا» إلا وهو بابُ شرفٍ ومنزلةُ تكليف. وفي ﴿استجيبوا لله وللرسول إذا دعاكم لما يحييكم﴾ يجتمع الأمرُ بالاستجابة، وبيانُ غايتها العظمى — الحياة — والتحذيرُ من التسويف ﴿واعلموا أن الله يحول بين المرء وقلبه﴾؛ مسارعةٌ كمسارعة الجيل الأول، تَحيا بها أركانُ الإنسان الثلاثة.", en: "Every call in God's Book opening with ‘O you who have believed’ is a door of honor and a station of duty. In ‘Respond to God and to the Messenger when He calls you to that which gives you life’ the command to respond meets its greatest aim — life — and a warning against delay: ‘And know that God comes between a person and his heart.’ A swiftness like the first generation's, by which heart, mind, and body all come alive.", es: "Todo llamado en el Libro de Dios que comienza con «¡Oh, vosotros que habéis creído!» es una puerta de honor y una estación de deber. En «Responded a Dios y al Mensajero cuando os llama a aquello que os da vida» se reúnen el mandato de responder, su fin supremo —la vida— y la advertencia contra el aplazamiento: «Y sabed que Dios se interpone entre la persona y su corazón»; una prontitud como la de la primera generación, por la que cobran vida el corazón, la mente y el cuerpo." },
  },
  // ===== سلسلة «التفسير المقاصدي» =====
  {
    slug: 'surah-al-fatiha',
    coverImage: '/articles/surah-al-fatiha.png',
    category: 'maqasid-tafsir',
    isoDate: '2026-05-19',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 6,
    series: { ar: 'التفسير المقاصدي', en: 'Objective-Based Tafsīr', es: 'Tafsīr orientado a los fines' },
    episode: 11,
    title: { ar: "التفسير المقاصدي في سورة الفاتحة", en: "Objective-Based Tafsīr of Sūrat al-Fātiḥah", es: "El tafsīr orientado a los fines en la sura al-Fātiḥah" },
    subtitle: { ar: "شعارُ السورة التي تُتلى سبعَ عشرةَ مرّةً كلَّ يوم", en: "The Slogan of the Sūrah Recited Seventeen Times Every Day", es: "El lema de la sura que se recita diecisiete veces cada día" },
    excerpt: { ar: "في كلّ يومٍ يَقف المسلمُ بين يدَي ربّه سبعَ عشرةَ مرّةً، فلا تنعقد له ركعةٌ إلّا بالفاتحة. فما الحكمةُ في أن تكون هذه السورةُ بعينها هي اللازمةَ التي لا تَسقط؟ قراءةٌ مقاصديّةٌ تَستجلي ما تُريد «أمُّ القرآن» أن تَصنعه في الإنسان كلَّ يوم — آيةً آية.", en: "Every day the Muslim stands before his Lord seventeen times, and no prayer-unit is valid without the Fātiḥah. Why is this very sūrah the indispensable one that never falls away? An objective-based reading draws out what 'the Mother of the Qur'an' seeks to make of the human being each day — verse by verse.", es: "Cada día el musulmán se yergue ante su Señor diecisiete veces, y ninguna unidad de oración es válida sin la Fātiḥah. ¿Por qué es precisamente esta sura la indispensable que nunca se omite? Una lectura orientada a los fines esclarece lo que «la Madre del Corán» busca hacer del ser humano cada día —aleya por aleya." },
  },
  {
    slug: 'concept-and-term',
    coverImage: '/articles/concept-and-term.png',
    category: 'maqasid-tafsir',
    isoDate: '2026-05-29',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 8,
    series: { ar: 'التفسير المقاصدي', en: 'Objective-Based Tafsīr', es: 'Tafsīr orientado a los fines' },
    episode: 1,
    title: { ar: "التفسير المقاصدي: تحرير المفهوم وضبط المصطلح", en: "Objective-Based Tafsīr: Clarifying the Concept and Defining the Term", es: "Tafsīr orientado a los fines: clarificar el concepto y precisar el término" },
    excerpt: { ar: "ما أكثرَ من يقرأ القرآنَ طلباً للحُكم، وما أقلَّ من يقرؤه طلباً للحِكمة! وما أكثرَ من يسأل: ماذا أمر الله؟ وما أقلَّ من يَزيد: ولماذا أمر؟ وبين السؤالَين مسافةٌ بعيدة؛ مسافةُ ما بين أن تَحمل الآيةَ في حافظتك، وأن تَحمِلَك الآيةُ إلى مرادها.", en: "How many read the Qur'an seeking a ruling, and how few seeking wisdom! Between 'What did God command?' and 'Why did He command it?' lies a great distance. This opening article clarifies the concept of objective-based tafsīr and defines its term — the key to the whole series.", es: "¡Cuántos leen el Corán buscando un dictamen, y qué pocos buscando sabiduría! Entre «¿Qué ordenó Dios?» y «¿Por qué lo ordenó?» hay una gran distancia. Este artículo inaugural clarifica el concepto del tafsīr orientado a los fines y precisa su término —la llave de toda la serie." },
  },
  {
    slug: 'tafsir-and-its-siblings',
    coverImage: '/articles/tafsir-and-its-siblings.png',
    category: 'maqasid-tafsir',
    isoDate: '2026-05-28',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 4,
    series: { ar: 'التفسير المقاصدي', en: 'Objective-Based Tafsīr', es: 'Tafsīr orientado a los fines' },
    episode: 2,
    title: { ar: "التفسير المقاصدي وأخواته: تمييزٌ يرفع اللبس", en: "Objective-Based Tafsīr and Its Siblings: A Distinction That Removes Confusion", es: "El tafsīr orientado a los fines y sus hermanos: una distinción que disipa la confusión" },
    excerpt: { ar: "«مقاصد القرآن» موضوعٌ ومادّة: هي الغايات الكبرى التي نزل القرآن لتحقيقها، كالهداية وإصلاح الاعتقاد وتزكية النفس. أمّا التفسير المقاصدي فمنهجٌ وعملية نظرٍ تستثمر تلك المقاصد في فهم الآيات الجزئية وتنزيلها على الواقع. فبينهما عمومٌ وخصوص: مقا", en: "What distinguishes objective-based tafsīr from the objectives of the Qur'an, thematic tafsīr, the tafsīr of legal verses, and taʾwīl? Four boundaries that preserve the method's identity and protect the reader from confusion.", es: "¿Qué distingue al tafsīr orientado a los fines de los fines del Corán, el tafsīr temático, el tafsīr de los versículos legales y el taʾwīl? Cuatro límites que preservan la identidad del método y protegen al lector de la confusión." },
  },
  {
    slug: 'origin-and-development',
    coverImage: '/articles/origin-and-development.png',
    category: 'maqasid-tafsir',
    isoDate: '2026-05-27',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 5,
    series: { ar: 'التفسير المقاصدي', en: 'Objective-Based Tafsīr', es: 'Tafsīr orientado a los fines' },
    episode: 3,
    title: { ar: "نشأة التفسير المقاصدي وتطوّره عبر القرون", en: "The Origin and Development of Objective-Based Tafsīr Across the Centuries", es: "El origen del tafsīr orientado a los fines y su desarrollo a través de los siglos" },
    excerpt: { ar: "لم يولد التفسير المقاصدي مصطلحاً ناجزاً في يومٍ واحد، بل نَمَت بذورُه مع نزول الوحي، ثم تدرّج حتى صار اتجاهاً ممنهجاً. وفهمُ هذا التطوّر يعصِمنا من وهمين: وهمِ أنه بدعةٌ محدثة، ووهمِ أنه كان علماً مكتمل المعالم منذ البداية.", en: "Objective-based tafsīr was not born finished in a day; its seeds grew with revelation, matured with uṣūl al-fiqh, crystallized in the Qur'anic sciences, and became methodical in the modern era — an authentic extension of the tradition.", es: "El tafsīr orientado a los fines no nació acabado en un día; sus semillas crecieron con la revelación, maduraron con los uṣūl al-fiqh, se cristalizaron en las ciencias del Corán y se metodizaron en la era moderna —una extensión auténtica de la tradición." },
  },
  {
    slug: 'grand-objectives-and-purpose',
           coverImage: '/articles/grand-objectives-and-purpose.png',
    category: 'maqasid-tafsir',
    isoDate: '2026-05-26',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 4,
    series: { ar: 'التفسير المقاصدي', en: 'Objective-Based Tafsīr', es: 'Tafsīr orientado a los fines' },
    episode: 4,
    title: { ar: "مقاصد القرآن الكبرى والغاية من التفسير المقاصدي", en: "The Grand Objectives of the Qur'an and the Goal of Objective-Based Tafsīr", es: "Los grandes fines del Corán y el propósito del tafsīr orientado a los fines" },
    excerpt: { ar: "إذا كان التفسير المقاصدي يقرأ الآية في ضوء غاياتها، فلا بدّ أن نتبيّن أوّلاً المقاصد الكبرى التي أُنزِل القرآن كلُّه لأجلها؛ فهي البوصلة التي تُوجِّه فهم الجزئيات. وقد صرّح القرآن بمقصده الأعظم في غير موضع:", en: "To read a verse in light of its goals, we must first discern the Qur'an's grand objectives — rectifying belief, purifying the soul, justice, civilization, and mercy — and the threefold goal of reading by them.", es: "Para leer un versículo a la luz de sus metas, hemos de discernir primero los grandes fines del Corán —rectificar la creencia, purificar el alma, la justicia, la civilización y la misericordia— y el triple propósito de leer por ellos." },
  },
  {
    slug: 'scholars-and-figures',
    coverImage: '/articles/scholars-and-figures.png',
    category: 'maqasid-tafsir',
    isoDate: '2026-05-25',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 4,
    series: { ar: 'التفسير المقاصدي', en: 'Objective-Based Tafsīr', es: 'Tafsīr orientado a los fines' },
    episode: 5,
    title: { ar: "أعلام التفسير المقاصدي ورجالاته", en: "The Figures and Scholars of Objective-Based Tafsīr", es: "Las figuras y los sabios del tafsīr orientado a los fines" },
    excerpt: { ar: "صاحب «الموافقات»، والمؤصِّل الأكبر لنظرية المقاصد. لم يكتب تفسيراً مقاصديّاً مستقلّاً، لكنّه وضع الأساس النظريّ الذي قام عليه هذا الاتجاه كلُّه؛ إذ رتّب المقاصد إلى ضروريّاتٍ وحاجيّاتٍ وتحسينيّات، وقرّر أنّ الشريعة وُضِعت لمصالح العباد في ا", en: "An edifice that generations cooperated to raise: al-Shāṭibī grounded it, Ibn ʿĀshūr moved it into tafsīr, the Manār school and ʿAllāl al-Fāsī revived it, and the moderns theorized it. A survey of its principal figures.", es: "Un edificio que generaciones cooperaron en levantar: al-Shāṭibī lo fundamentó, Ibn ʿĀshūr lo trasladó al tafsīr, la escuela de al-Manār y ʿAllāl al-Fāsī lo revivieron, y los modernos lo teorizaron. Una reseña de sus figuras principales." },
  },
  {
    slug: 'principles-and-controls',
    coverImage: '/articles/principles-and-controls.png',
    category: 'maqasid-tafsir',
    isoDate: '2026-05-24',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 5,
    series: { ar: 'التفسير المقاصدي', en: 'Objective-Based Tafsīr', es: 'Tafsīr orientado a los fines' },
    episode: 6,
    title: { ar: "أصول التفسير المقاصدي وضوابطه: بين الانفتاح والانضباط", en: "The Principles and Controls of Objective-Based Tafsīr: Between Openness and Discipline", es: "Los principios y los controles del tafsīr orientado a los fines: entre la apertura y la disciplina" },
    excerpt: { ar: "التفسير المقاصدي بابٌ من الخير عظيم، لكنّه — كأيّ منهجٍ — يُساء استعماله إذا فُكَّ من ضوابطه. فقد يتذرّع متذرّعٌ بـ«المقصد» ليُعطّل حكماً صريحاً، أو يُحمِّل الآية ما لا تحتمل. ولذلك كان وضع الضوابط صمّام الأمان الذي يحفظ المنهج من الانزلاق ", en: "A great door of good, but misused if unfastened from its controls. Five controls: regard for the word, recognized objectives, conformity of particular to universal, not opposing the definitive, and distinguishing objective from means.", es: "Una gran puerta de bien, pero mal usada si se desata de sus controles. Cinco controles: la consideración de la palabra, los fines reconocidos, la conformidad de lo particular con lo universal, no oponerse a lo definitivo, y distinguir el fin del medio." },
  },
  {
    slug: 'fruit-of-study',
    coverImage: '/articles/fruit-of-study.png',
    category: 'maqasid-tafsir',
    isoDate: '2026-05-23',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 4,
    series: { ar: 'التفسير المقاصدي', en: 'Objective-Based Tafsīr', es: 'Tafsīr orientado a los fines' },
    episode: 7,
    title: { ar: "ثمرة مدارسة القرآن على أساس المقاصد", en: "The Fruit of Studying the Qur'an upon the Basis of Objectives", es: "El fruto de estudiar el Corán sobre la base de los fines" },
    excerpt: { ar: "بعد التأصيل والتاريخ والمقاصد والأعلام والضوابط، يَحسُن أن نسأل سؤال المنتفِع: ماذا أجني من قراءة القرآن على أساس مقاصده؟ فالعلم الذي لا يُثمر عملاً ناقصٌ، والمنهج إنما يُقاس بثماره. وثمراتُ المدارسة المقاصدية كثيرةٌ، نُجمل أبرزها.", en: "What do I gain from reading the Qur'an by its objectives? Presence of the heart, grasping reality, fortification against rigidity and distortion, unity of conception, investing the verse in life, and deepening love for the Qur'an.", es: "¿Qué gano de leer el Corán por sus fines? La presencia del corazón, comprender la realidad, la fortificación contra la rigidez y la distorsión, la unidad de la concepción, invertir el versículo en la vida, y profundizar el amor por el Corán." },
  },
  {
    slug: 'behavioral-application',
    coverImage: '/articles/behavioral-application.png',
    category: 'maqasid-tafsir',
    isoDate: '2026-05-22',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 5,
    series: { ar: 'التفسير المقاصدي', en: 'Objective-Based Tafsīr', es: 'Tafsīr orientado a los fines' },
    episode: 8,
    title: { ar: "تطبيقٌ سلوكيّ: مقاصد القرآن في بناء سلوك الفرد", en: "A Behavioral Application: The Objectives of the Qur'an in Building the Conduct of the Individual", es: "Una aplicación conductual: los fines del Corán en la construcción de la conducta del individuo" },
    excerpt: { ar: "ننتقل الآن من التأصيل إلى التطبيق الحيّ، ونبدأ بأقرب الميادين إلى الإنسان: سلوكه الفرديّ وأخلاقه. فالقرآن لم ينزل ليُتلى فقط ولا ليُحفظ فحسب، بل ليَبنيَ شخصيّةً متّزنةً صادقةً أمينة. والتفسير المقاصدي في هذا الباب يكشف أنّ آيات الأخلاق ليست", en: "The Qur'an was revealed to build a balanced, truthful, trustworthy personality. The verses of truthfulness, trustworthiness, self-restraint, and excellence — read with their objectives as a daily program of conduct.", es: "El Corán se reveló para construir una personalidad equilibrada, veraz y fiel. Los versículos de la veracidad, la fidelidad, el autodominio y la excelencia —leídos con sus fines como un programa cotidiano de conducta." },
  },
  {
    slug: 'social-application',
    coverImage: '/articles/social-application.png',
    category: 'maqasid-tafsir',
    isoDate: '2026-05-21',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 4,
    series: { ar: 'التفسير المقاصدي', en: 'Objective-Based Tafsīr', es: 'Tafsīr orientado a los fines' },
    episode: 9,
    title: { ar: "تطبيقٌ اجتماعيّ: مقاصد القرآن في إصلاح العلاقات والمجتمع", en: "A Social Application: The Objectives of the Qur'an in Reforming Relationships and Society", es: "Una aplicación social: los fines del Corán en la reforma de las relaciones y la sociedad" },
    excerpt: { ar: "تجمع الآية مقاصد الاجتماع في ثلاثٍ متدرّجة: العدلُ الذي يَضبط الحقوق فلا يُظلَم أحد، وهو الحدّ الأدنى الذي به قِوام المجتمع؛ ثم الإحسانُ الذي يتجاوز الحقّ المجرّد إلى الفضل والعطاء فيُذيب البغضاء ويَصنع المودّة؛ ثم صلةُ الأرحام التي تَبني ا", en: "How does the Qur'an reform relationships and society? The objectives of justice, consultation, reconciliation, and safeguarding society from suspicion, spying, and backbiting — applied to the digital age.", es: "¿Cómo reforma el Corán las relaciones y la sociedad? Los fines de la justicia, la consulta, la reconciliación y la salvaguarda de la sociedad ante la sospecha, el espionaje y la calumnia —aplicados a la era digital." },
  },
  {
    slug: 'psychological-application',
    coverImage: '/articles/psychological-application.png',
    category: 'maqasid-tafsir',
    isoDate: '2026-05-20',
    date: { ar: 'يونيو ٢٠٢٦', en: 'June 2026', es: 'Junio de 2026' },
    readingMinutes: 6,
    series: { ar: 'التفسير المقاصدي', en: 'Objective-Based Tafsīr', es: 'Tafsīr orientado a los fines' },
    episode: 10,
    title: { ar: "تطبيقٌ نفسيّ: مقاصد القرآن في طمأنينة النفس وعلاجها", en: "A Psychological Application: The Objectives of the Qur'an in the Tranquility and Healing of the Soul", es: "Una aplicación psicológica: los fines del Corán en la serenidad del alma y su sanación" },
    excerpt: { ar: "نختم سلسلتنا بأعمق ميادين الإنسان وأخفاها: نفسِه وقلبِه. فالقرآن كما يُصلح السلوك ويَبني المجتمع، يُداوي النفس ويَمنحها الطمأنينة؛ وقد وَصَفه الله بأنه شفاءٌ فقال: ﴿وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ﴾ [", en: "We conclude the series with the soul and the heart: the objectives of tranquility, serenity in hardship, hope, ease after hardship, and patience — the Qur'an as a healing for what is in the chests.", es: "Concluimos la serie con el alma y el corazón: los fines de la serenidad, el sosiego en la adversidad, la esperanza, la facilidad tras la dificultad y la paciencia —el Corán como sanación para lo que hay en los pechos." },
  },
  {
    slug: 'kaaba-or-qibla',
    coverImage: '/articles/kaaba-or-qibla.png',
    category: 'wisdom-insights',
    isoDate: '2026-05-31',
    date: { ar: '٣١ مايو ٢٠٢٦', en: 'May 31, 2026', es: '31 de mayo de 2026' },
    readingMinutes: 13,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 11,
    title: {
      ar: 'كعبةٌ أم قِبلة؟',
      en: 'A Kaaba or a Qiblah?',
      es: '¿Kaaba o alquibla?',
    },
    subtitle: {
      ar: 'عند البيت... أم في البيت؟ — لماذا تَجمَعُ القِبلةُ كلَّ الوُجوه، ولا يَنكشِفُ سِرُّ الكعبةِ إلا لقلبٍ حاضر',
      en: 'At the House... or Within It? — Why the Qiblah Gathers Every Face, While the Secret of the Kaaba Unveils Only to a Present Heart',
      es: 'Junto a la Casa... ¿o dentro de la Casa? — Por qué la alquibla reúne todos los rostros, mientras el secreto de la Kaaba solo se revela a un corazón presente',
    },
    excerpt: {
      ar: 'مَلايينُ يَصِلونَ إلى الكعبة، فكم منهم تَصِلُ الكعبةُ إلى قلبِه؟ هذه الحلقةُ الحاديةَ عشرةَ من «حِكَمٌ وبصائر» تُفرِّقُ بين أن تكونَ عند البيتِ وأن يكونَ البيتُ فيك: فالقِبلةُ يَتوجَّهُ إليها الجميعُ وتَبقى في القلبِ حتّى الموت، أمّا سِرُّ الكعبةِ فلا يَنكشِفُ إلا لقلبٍ حاضرٍ مُعَظِّم. ومن المنافقينَ ﴿قَامُوا كُسَالَىٰ﴾ إلى أثرِ عمرَ عند الحجرِ «إنّك حجرٌ لا تَضُرُّ ولا تَنفَع»، تَستقرُّ على ميزانٍ واحد: ﴿وَلَٰكِن يَنَالُهُ التَّقْوَىٰ مِنكُمْ﴾. فليس كلُّ مَن وَصَلَ قد وَصَل؛ وإنّما يَصِلُ مَن عادَت به الكعبةُ إلى الله.',
      en: "Millions reach the Kaaba — but how many does the Kaaba reach in the heart? This eleventh episode of 'Wisdoms & Insights' distinguishes being at the House from the House being within you: the qiblah is turned toward by all and dwells in the heart until death, while the secret of the Kaaba unveils only to a present, reverent heart. From the hypocrites who 'stand lazily' to ʿUmar at the Black Stone — 'you are but a stone that neither harms nor benefits' — it rests on a single scale: 'but what reaches Him is the piety from you.' Not everyone who arrived has truly arrived; truly arrived is he whom the Kaaba returned to God.",
      es: 'Millones llegan a la Kaaba, pero ¿a cuántos llega la Kaaba al corazón? Este undécimo episodio de «Sabidurías y Perspectivas» distingue entre estar en la Casa y que la Casa esté dentro de ti: hacia la alquibla se vuelven todos y permanece en el corazón hasta la muerte, mientras que el secreto de la Kaaba solo se revela a un corazón presente y reverente. Desde los hipócritas que «se levantan perezosos» hasta el gesto de ʿUmar ante la Piedra —«no eres más que una piedra que ni daña ni beneficia»— todo reposa en una sola balanza: «pero a Él llega la piedad de vosotros». No todo el que llegó ha llegado de verdad; verdaderamente llega aquel a quien la Kaaba devolvió a Dios.',
    },
  },
  {
    slug: 'hearts-before-the-rows',
    coverImage: '/articles/hearts-before-the-rows.png',
    category: 'wisdom-insights',
    isoDate: '2026-05-31',
    date: { ar: '٣١ مايو ٢٠٢٦', en: 'May 31, 2026', es: '31 de mayo de 2026' },
    readingMinutes: 13,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 10,
    title: {
      ar: 'تَسويةُ القُلوبِ قبلَ الصُّفوف',
      en: 'Straightening the Hearts Before the Rows',
      es: 'Enderezar los corazones antes que las filas',
    },
    subtitle: {
      ar: 'حين تَتلاصَقُ الأقدامُ وتَتباعَدُ القلوب — قانونُ الفُرجةِ التي يَدخُلُ منها الشَّيطان، في الصفِّ وفي النَّفس',
      en: 'When Feet Touch and Hearts Drift Apart — The Law of the Gap the Devil Enters, in the Row and in the Soul',
      es: 'Cuando los pies se juntan y los corazones se distancian — la ley de la brecha por la que entra el demonio, en la fila y en el alma',
    },
    excerpt: {
      ar: 'نُسَوّي صُفوفَنا بالأصابع، فهل نُسَوّي قُلوبَنا؟ هذه الحلقةُ العاشرةُ من «حِكَمٌ وبصائر» تَنطلِقُ من قولِه ﷺ «ولا تَختلِفوا فتَختلِفَ قلوبُكم» لتَكشِفَ أنّ الصفَّ المستقيمَ تدريبٌ على تقاربِ النفوس، ثُمّ تَستخرِجُ «قانونَ الخَلَل»: فُرجةٌ صغيرةٌ تُهمَل، فيَنفُذُ منها الشيطان، فتَتّسِع — وعلاجُها الأمرُ النبويُّ نفسُه: «سُدُّوا الخَلَل» قبل أن يَتّسِع. وتَرتقي بالفكرةِ من التربيةِ الفرديّةِ إلى هَمِّ الإصلاح: أمّةٌ لا تَجتمِعُ في مسجدٍ كيف تَحمِلُ رسالة؟',
      en: "We align our rows by finger-widths — but do we align our hearts? This tenth episode of 'Wisdoms & Insights' begins from the Prophet's words 'do not differ, lest your hearts differ' to reveal that the straight row is a training in the nearness of souls, then extracts 'the law of the breach': a small gap left neglected, through which the devil slips and which then widens — its cure the very Prophetic command, 'close the breach' before it widens. It raises the idea from individual cultivation to the reformist concern: a nation that cannot unite in one mosque, how will it carry a message?",
      es: 'Alineamos nuestras filas con los dedos, pero ¿alineamos nuestros corazones? Este décimo episodio de «Sabidurías y Perspectivas» parte de las palabras del Profeta ﷺ «no discrepéis, no sea que vuestros corazones discrepen» para revelar que la fila recta es un entrenamiento en la cercanía de las almas; luego extrae «la ley de la brecha»: un pequeño hueco descuidado por el que se cuela el demonio y que después se ensancha —y su remedio es la misma orden profética: «cerrad la brecha» antes de que se ensanche. Y eleva la idea de la formación individual a la preocupación reformista: una nación que no se une en una sola mezquita, ¿cómo portará un mensaje?',
    },
  },
  {
    slug: 'the-appetite-for-obedience',
    coverImage: '/articles/the-appetite-for-obedience.png',
    category: 'wisdom-insights',
    isoDate: '2026-05-31',
    date: { ar: '٣١ مايو ٢٠٢٦', en: 'May 31, 2026', es: '31 de mayo de 2026' },
    readingMinutes: 13,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 9,
    title: {
      ar: 'شَهوةُ الطَّاعة',
      en: 'The Appetite for Obedience',
      es: 'El apetito de la obediencia',
    },
    subtitle: {
      ar: 'حين تَندفِعُ النَّفسُ إلى العبادةِ كما تَندفِعُ إلى الشَّهوة — كيف رَبَّى النبيُّ ﷺ القلبَ بين الإيقاظِ والتَّهذيب؟',
      en: 'When the Soul Rushes to Worship as It Rushes to Desire — How the Prophet ﷺ Trained the Heart Between Kindling and Tempering',
      es: 'Cuando el alma se lanza a la adoración como se lanza al deseo — ¿cómo educó el Profeta (la paz sea con él) al corazón entre el despertar y el refinamiento?',
    },
    excerpt: {
      ar: 'كما أنّ للمَعصيةِ شَهوة، فقد تكونُ للطَّاعةِ شَهوةٌ أيضاً: اندفاعٌ صادقٌ يَشتعِلُ ثُمّ يَخبو. هذه الحلقةُ التاسعةُ من «حِكَمٌ وبصائر» تَستخرِجُ من قصّةِ النَّفرِ الثَّلاثةِ، وثناءِ النبيِّ ﷺ على عبدِ اللهِ بنِ عمر، وحَلِّه لحبلِ زينبَ، قاعدةً جامعةً: أنّ النبيَّ ﷺ لا يُعالِجُ العبادةَ بل يُعالِجُ صاحبَها؛ يُوقِظُ الفاتِرَ ويُهذِّبُ المُندفِعَ ليَرُدَّ كليهما إلى التَّوازُنِ الذي مِحورُه الدَّوامُ لا الكَثرة. شَهوةٌ تُوقِظ، فمَحبّةٌ تُرَبّي، فعَهدٌ يُثبِّت.',
      en: "Just as disobedience has its appetite, obedience too may have one: a sincere surge that blazes and then fades. This ninth episode of 'Wisdoms & Insights' draws from the story of the three men, the Prophet's praise of ʿAbdullāh ibn ʿUmar, and his untying of Zaynab's rope a unifying principle — that the Prophet ﷺ treats not the worship but the worshipper, kindling the languid and tempering the impulsive to return both to the balance whose axis is constancy, not quantity. An appetite that awakens, a love that nurtures, a covenant that steadies.",
      es: 'Así como la desobediencia tiene su apetito, también la obediencia puede tenerlo: un impulso sincero que se enciende y luego se apaga. Este noveno episodio de «Sabidurías y Perspectivas» extrae de la historia de los tres hombres, del elogio del Profeta ﷺ a ʿAbdullāh ibn ʿUmar y de cuando desató la cuerda de Zaynab, un principio unificador: que el Profeta ﷺ no trata la adoración, sino al adorador; aviva al tibio y modera al impulsivo para devolver a ambos al equilibrio cuyo eje es la constancia, no la cantidad. Un apetito que despierta, un amor que educa, un pacto que afianza.',
    },
  },
  {
    slug: 'purification-before-the-meeting',
    coverImage: '/articles/purification-before-the-meeting.png',
    category: 'wisdom-insights',
    isoDate: '2026-05-30',
    date: { ar: '٣٠ مايو ٢٠٢٦', en: 'May 30, 2026', es: '30 de mayo de 2026' },
    readingMinutes: 10,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 8,
    title: {
      ar: 'ثُمَّ لْيَقْضُوا تَفَثَهُمْ',
      en: 'Then Let Them Complete Their Cleansing',
      es: '«Y que luego eliminen su suciedad»',
    },
    subtitle: {
      ar: 'لِماذا يَسبِقُ التَّفَثُ الطَّوافَ؟ — طَهارةٌ قبلَ القُرب، في الحجِّ وفي الطَّريقِ إلى الله',
      en: 'Why Does the Cleansing Come Before the Circumambulation? — Purification Before Nearness, in the Hajj and on the Road to God',
      es: '¿Por qué la suciedad (tafaṯ) precede a la circunvalación? — Una purificación antes de la cercanía, en la Peregrinación y en el camino hacia Dios',
    },
    excerpt: {
      ar: 'آيةٌ من كلمتين في سورة الحجِّ تَفتحُ رؤيةً كاملةً لمسيرةِ الإنسانِ إلى الله. هذه الحلقةُ الثامنةُ من «حِكَمٌ وبصائر» تَقرأُ ﴿ثُمَّ لْيَقْضُوا تَفَثَهُمْ﴾ في موضعِها من تكاليفِ السُّورة (تَطهيرٌ، فوَفاءٌ، فقُرب)، وتُبيِّنُ لماذا سُمِّيت السُّورةُ بالحجِّ وهي سورةُ رِحلةٍ لا سورةُ مَناسك، ثُمّ تَكشِفُ أنّ أخطرَ التَّفَثِ ما لا يَراه أحد: غُبارُ الحَسَدِ والكِبرِ والقَسوةِ على الرُّوح. خاتمتُها سُؤالٌ يَبقى: ليس المُهمُّ هل وَصَلتَ إلى البَيت، بل بأيِّ قلبٍ تَلقى ربَّ البَيت.',
      en: "A two-word verse in Sūrat al-Ḥajj opens a complete vision of the human journey to God. This eighth episode of 'Wisdoms & Insights' reads ﴾Then let them complete their cleansing﴿ in its place among the sūra's obligations (purification, then fulfillment, then nearness), shows why the sūra is named after the Hajj though it is a sūra of a journey rather than of rites, then reveals that the most dangerous tafath is the one no one sees: the dust of envy, arrogance, and hardness upon the soul. It closes with a question that lingers — what matters is not whether you reached the House, but with what heart you meet the Lord of the House.",
      es: 'Un versículo de dos palabras en la sura de Al-Ḥach abre una visión completa del viaje del ser humano hacia Dios. Este octavo episodio de «Sabidurías y Perspectivas» lee ﴾Y que luego cumplan sus ritos de purificación﴿ en su lugar entre las obligaciones de la sura (purificación, luego cumplimiento, luego cercanía), muestra por qué la sura lleva el nombre del Hach siendo una sura de un viaje y no de ritos, y luego revela que el tafaz más peligroso es el que nadie ve: el polvo de la envidia, la soberbia y la dureza sobre el alma. Cierra con una pregunta que permanece: lo que importa no es si llegaste a la Casa, sino con qué corazón te encuentras con el Señor de la Casa.',
    },
  },
  {
    slug: 'days-of-allah',
    coverImage: '/articles/days-of-allah.png',
    category: 'wisdom-insights',
    isoDate: '2026-05-24',
    date: { ar: '٢٤ مايو ٢٠٢٦', en: 'May 24, 2026', es: '24 de mayo de 2026' },
    readingMinutes: 15,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 7,
    title: {
      ar: 'وذَكِّرهم بأيّامِ الله',
      en: 'Remind Them of the Days of Allah',
      es: '«Y recuérdales los Días de Dios»',
    },
    subtitle: {
      ar: 'ستّةُ دروسٍ من جائحةِ كورونا — قراءةٌ في سُنَن الله حين تَدور الرَّحى على البشريّة',
      en: "Six Lessons from the Pandemic — A Reading of God's Sunan When the Mill Turns Upon Humanity",
      es: 'Seis lecciones de la pandemia de coronavirus — una lectura en las leyes de Dios cuando la rueda gira sobre la humanidad',
    },
    excerpt: {
      ar: 'ما «أيّامُ الله»؟ ليست الأيّامَ الزمنيّةَ السائرةَ في عَدِّ الفَلَك، بل هي الأيّامُ التي تَنكشفُ فيها يَدُ الله على البشريّة. هذه الحلقةُ السابعةُ من «حِكَمٌ وبصائر» تَستخرجُ من جائحةِ كورونا ستّةَ دروسٍ كَونيّةٍ ونفسيّة: غَلَبَةُ الله على أمره، جنودُه التي لا يَعلمها إلا هو، المراحلُ النفسيّةُ الخمس في الأزمات، حالتا العزلةِ والاجتماعِ في البيوت، قانونُ الاتّحاد في الأزمات والانقسامِ في الرَّخاء، والأَمنُ الذي صَنَعَه الإغلاق. خاتمتُها العَودةُ إلى هَدْي النبيّ ﷺ في الصِّحَّة والوقاية، وأنّ الجائحةَ ما كانت إلا تَذكيراً.',
      en: "What are 'the Days of Allah'? They are not the calendrical days that orbit with the celestial bodies, but the days in which the hand of God is unveiled upon humanity. This seventh episode of 'Wisdoms & Insights' extracts from the COVID-19 pandemic six cosmic and psychological lessons: God's predominance over His affair, the armies none knows but He, the five psychological stages of crisis, the two states of solitude and gathering at home, the law of uniting in crisis and dividing in prosperity, and the security the lockdown created. It concludes with a return to the Prophet's guidance on hygiene and prevention, and that the pandemic was nothing but a reminder.",
      es: '¿Qué son «los Días de Dios»? No son los días calendáricos que orbitan con los cuerpos celestes, sino los días en los que la mano de Dios se desvela sobre la humanidad. Este séptimo episodio de «Sabidurías y Perspectivas» extrae de la pandemia del COVID-19 seis lecciones cósmicas y psicológicas: el predominio de Dios sobre Su asunto, las huestes que nadie conoce sino Él, las cinco etapas psicológicas de la crisis, los dos estados de soledad y reunión en el hogar, la ley de unirse en la crisis y dividirse en la prosperidad, y la seguridad que el confinamiento creó. Cierra con un retorno a la guía profética sobre la higiene y la prevención.',
    },
  },
  {
    slug: 'satan-and-man-goal-and-means',
    coverImage: '/articles/satan-and-man-goal-and-means.png',
    category: 'wisdom-insights',
    isoDate: '2018-10-12',
    date: { ar: '١٢ أكتوبر ٢٠١٨', en: 'October 12, 2018', es: '12 de octubre de 2018' },
    readingMinutes: 15,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 6,
    title: {
      ar: 'الشيطان والإنسان: غاية ووسيلة',
      en: 'Satan and Man: Goal and Means',
      es: 'Satán y el ser humano: un fin y un medio',
    },
    subtitle: {
      ar: 'خطبة جمعة في مداخل الشيطان: الطمع، البخل، المقارنات، صحبة السوء',
      en: "A Friday sermon on Satan's entry points: greed, miserliness, comparisons, and bad company",
      es: 'Sermón del viernes sobre las vías de entrada de Satán: la avidez, la avaricia, las comparaciones y la mala compañía',
    },
    excerpt: {
      ar: 'تأمُّلٌ في غاية الشيطان من ابن آدم — ﴿لأغوينَّهم﴾ — والمداخل التي يتسلَّل منها إلى النَّفس: الطمعُ المختلفُ توزيعُه بين الناس، والبخلُ في المال والفكرة والمشاعر، والمقارناتُ التي تتَّخذ مقياسَ الهوى فتُهلِك. خلاصةُ خطبة جمعة في «مركز مِيسكويت الإسلامي» (Mesquite Islamic Center) بولاية تكساس، أُلقيت في 12 أكتوبر 2018م، مع وصايا تطبيقية لحفظ المؤمن من مداخل الشيطان وصحبة السوء.',
      en: "A reflection on Satan's goal with the children of Adam — ﴿I will surely lead them astray﴾ — and the entry points by which he infiltrates the soul: greed (whose distribution varies between people), miserliness (with wealth, ideas, and feelings), and comparisons that take desire as their measure and so destroy. A distillation of a Friday sermon at the Mesquite Islamic Center (M.I.C.), Texas, delivered on October 12, 2018, with practical counsels to safeguard the believer from Satan's entry points and from bad company.",
      es: 'Una reflexión sobre el fin de Satán con los hijos de Adán —﴾Ciertamente los extraviaré﴿— y las vías de entrada por las que se infiltra en el alma: la avidez (cuya distribución varía entre las gentes), la avaricia (con la riqueza, las ideas y los sentimientos), y las comparaciones que toman el deseo por medida y así destruyen. Una destilación de un sermón del viernes en el Centro Islámico de Mesquite (M.I.C.), Texas, pronunciado el 12 de octubre de 2018, con consejos prácticos para salvaguardar al creyente de las vías de entrada de Satán y de la mala compañía.',
    },
  },
  {
    slug: 'nourishing-fatherhood',
    category: 'family',
    isoDate: '2026-05-20',
    date: { ar: '٢٠ مايو ٢٠٢٦', en: 'May 20, 2026', es: '20 de mayo de 2026' },
    readingMinutes: 14,
    series: {
      ar: 'الأسرة والتربية',
      en: 'Family & Parenting',
      es: 'Familia y Educación',
    },
    episode: 1,
    title: {
      ar: 'غَزَلُ الأبِ لابنتِه',
      en: "A Father's Tender Affection for His Daughter",
      es: 'La ternura del padre hacia su hija',
    },
    subtitle: {
      ar: 'حِصْنٌ من الحُبِّ يَقي قلبَها من سهامِ المتربِّصين — بين هَدْي النبوّة، وشهادةِ علم النفس، وفِقْه الحدود',
      en: 'A Shield of Love That Guards Her Heart Against the Predators — Between Prophetic Guidance, Psychological Insight, and the Boundaries of the Sacred Law',
      es: 'Una fortaleza de amor que protege su corazón de las flechas de los acechadores — entre la guía profética, el testimonio de la psicología, y la comprensión de los límites',
    },
    excerpt: {
      ar: 'بنتُ المُسلِم في زمنِ المتربِّصين: كيف يَحْمِيها أبوها بالكلمةِ الحانيةِ قبل أن يَسبِقَه إليها مَن يَكِيدُ بقلبِها الغَضّ؟ هذه الحلقة الأولى من سلسلة «الأسرة والتربية» تُؤَصِّل لِما نُسَمِّيه ـ مع التحفُّظ على اللَّفظ ـ «غَزَلَ الأبِ المُباح»: تَبدأ بِتَحريرِ المُصطَلَح، ثُمَّ تَستَخرِج من هَدْي النبوّة مع فاطمةَ رضي الله عنها أَربَعَ تَعبيراتٍ مُتَتاليةٍ للحُبِّ المُعلَن، وتَستَشهِد بشهاداتِ علماء النَّفس المُسلِمين والمُعاصِرين، وتَرسُم سَبعةَ مَيادينَ تَطبيقيَّةٍ، ثُمَّ تَضَع سَبعةَ ضَوابطَ شَرعيَّةٍ تَحفَظ هذا الغَزَلَ المُباحَ في دائرةِ الأُبوَّةِ الراشدة.',
      en: "The Muslim daughter in an age of predators: how does her father shield her with tender words before someone with ill intent reaches her tender heart first? This first episode of the 'Family & Parenting' series roots what we are calling — with reservation about the term — 'a father's permissible tender affection': it begins by clarifying the term, then extracts from Prophetic guidance with Fātimah (may Allah be pleased with her) four consecutive expressions of openly declared love, draws on the testimonies of Muslim and contemporary psychologists, charts seven fields of practical application, and lays down seven Sharia guidelines that keep this permissible paternal affection within the dignity of mature fatherhood.",
      es: 'La hija musulmana en una era de depredadores: ¿cómo la escuda su padre con palabras tiernas antes de que alguien con mala intención alcance su tierno corazón primero? Este primer episodio de la serie «Familia y Educación» enraíza lo que llamamos —con reserva sobre el término— «la tierna ternura permisible del padre»: aclara el término, extrae de la guía profética con Fātima cuatro expresiones consecutivas de amor declarado abiertamente, se apoya en los testimonios de psicólogos musulmanes y contemporáneos, traza siete campos de aplicación práctica, y establece siete pautas sharaicas que lo mantienen dentro de la dignidad de la paternidad madura.',
    },
  },
  {
    slug: 'where-we-stand',
    category: 'wisdom-insights',
    isoDate: '2026-05-24',
    date: { ar: '٢٤ مايو ٢٠٢٦', en: 'May 24, 2026', es: '24 de mayo de 2026' },
    readingMinutes: 14,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 5,
    title: {
      ar: 'موقعنا من الإعراب',
      en: 'Where We Stand in the Sentence of History',
      es: 'Nuestra posición en el análisis sintáctico',
    },
    subtitle: {
      ar: 'قراءةٌ في موضع المؤمن حين تَدور رحى الحوادث',
      en: "A Reading of the Believer's Position When the Mill of Events Turns",
      es: 'Una lectura de la posición del creyente cuando gira la rueda de los acontecimientos',
    },
    excerpt: {
      ar: 'كلُّ كلمةٍ في الجملة العربيَّة لها موقعٌ من الإعراب: فإذا اختلَّ الموقعُ انكسرَ المعنى. وكذلك المؤمنُ في الحوادث: له موقعٌ ينبغي أن يَعرفه. هذه الحلقةُ الخامسةُ من «حِكَمٌ وبصائر» تَقرأ سورةَ الرُّوم بوصفها مَدرسةً في «موقع البَصيرة» حين تَدور الرَّحى بين قُوًى ليس بينك وبينها إلَّا التاريخ، تُشَخِّص فِتنةَ الشَّماتةِ بمسلمٍ يَختلف عنك مذهبُه، تَرسم موقعَ المسلمِ في الغربِ بين السفارةِ والنَّقد، وتُؤَصِّل لخطابٍ يَتعامل مع الأنماط لا مع الأعيان.',
      en: "Every word in an Arabic sentence has a grammatical station: if the station fails, meaning collapses. So too with the believer in events — he has a station he ought to know. This fifth episode of 'Wisdoms & Insights' reads Sūrat al-Rūm as a school in the 'station of insight' when the mill turns between powers that share with us only history, diagnoses the trial of schadenfreude toward a Muslim of a different school, charts the position of the Muslim in the West between embassy and critique, and grounds a discourse that engages patterns, not personalities.",
      es: 'Cada palabra en una oración árabe tiene una estación gramatical: si la estación falla, el sentido se derrumba. Así también el creyente ante los acontecimientos —tiene una estación que debería conocer. Este quinto episodio de «Sabidurías y Perspectivas» lee la sura de Ar-Rūm como una escuela en la «estación de la perspicacia» cuando la rueda gira entre potencias que solo comparten con nosotros la historia, diagnostica la prueba de la alegría por el mal de un musulmán de otra escuela, traza la posición del musulmán en Occidente entre la embajada y la crítica, y funda un discurso que se compromete con los patrones, no con las personalidades.',
    },
    coverImage: '/articles/where-we-stand/aia-flyer.jpg',
    coverCaption: {
      ar: 'هذا المَقال خُلاصَةُ خُطبَة الجُمعَة بِعُنوان «موقعنا من الإعراب» (Where Do We Stand?) الَّتي أَلقاها د. أحمد أبو سيف في «مَسجد أكاديميَّة الأَئمَّة بأمريكا» (AIA Masjid) بِمَدينَة Sachse، ولاية تكساس (الولايات المتَّحدة الأَمريكيَّة)، يوم الجُمعَة 3 أبريل 2026م المُوافِق 15 شَوّال 1447هـ، ضِمن مَهامِّه في رِعايَة أَبناء الجاليَة المُسلِمَة.',
      en: "This article is a written distillation of the Friday sermon 'Where Do We Stand?' (موقعنا من الإعراب) delivered by Dr. Ahmed Abouseif at the American Imams Academy (AIA) Masjid in Sachse, Texas (USA) on Friday, April 3, 2026 (15 Shawwāl 1447 AH), as part of his pastoral service to the Muslim community.",
    },
  },
  {
    slug: 'engineering-of-hope',
    category: 'wisdom-insights',
    isoDate: '2026-05-24',
    date: { ar: '٢٤ مايو ٢٠٢٦', en: 'May 24, 2026', es: '24 de mayo de 2026' },
    readingMinutes: 7,
    series: {
      ar: 'بشارات القرآن',
      en: "Glad Tidings of the Qur'an",
      es: 'Las Buenas Nuevas del Corán',
    },
    episode: 1,
    title: {
      ar: 'بِشاراتُ القرآن',
      en: "Glad Tidings of the Qur'an",
      es: 'Las albricias del Corán',
    },
    subtitle: {
      ar: 'صِناعةُ الأملِ بهندسةِ ترتيبِ السُّوَر',
      en: 'Engineering Hope through the Architecture of Sūra Order',
      es: 'La fabricación de la esperanza mediante la ingeniería del orden de las suras',
    },
    excerpt: {
      ar: 'ليس ترتيبُ سُورِ القرآنِ نَسَقاً موضوعيّاً فحسب، بل هو نَسَقٌ نفسيٌّ تربويٌّ بَديع: يَجعلُ البِشارةَ تَجيءُ بعدَ التَّخويف، والفجرَ بعدَ الغاشية، والضُّحى بعدَ السُّجى. هذه الحلقةُ الأولى من سلسلة «بشارات القرآن» تَستخرجُ من ثلاثِ مُجاوَراتٍ راسخة (الغاشية/الفجر، الليل/الضحى، الضحى/الشرح) نَمَطَ البِشارة المُتعاقبة مع الإنذار، ثم تَستأنِسُ بمثالَين من نَمَطَين مُجاوِرَين (هود/يوسف، الفيل/قريش)، وتَستخلصُ أربعَ سُنَنٍ غالبةٍ تَحكُمُ بِشاراتِ القرآن، مع لَفتةٍ منهجيّةٍ تَضبُطُ القراءة في تقاليد علم المناسبات.',
      en: "The order of the Qur'an's sūras is not merely a thematic sequence — it is a marvelous psychological and pedagogical one: glad tidings come after warning, dawn after Al-Ghāshiyah, morning brightness after the deepening night. This first episode of the series 'Glad Tidings of the Qur'an' draws from three solid pairings (Al-Ghāshiyah/Al-Fajr, Al-Layl/Al-Ḍuḥā, Al-Ḍuḥā/Al-Sharḥ) the pattern of glad tidings following warning, then supports the reading with two adjacent patterns (Hūd/Yūsuf, Al-Fīl/Quraysh), distills four prevailing patterns that govern the Qur'an's glad tidings, and concludes with a methodological note grounding the reading within the tradition of ʿilm al-munāsabāt.",
      es: 'El orden de las suras del Corán no es meramente una secuencia temática —es una maravillosa secuencia psicológica y pedagógica: las buenas nuevas vienen tras la advertencia, el alba tras Al-Ghāshiya, el resplandor de la mañana tras la noche que se ahonda. Este primer episodio de la serie «Las Buenas Nuevas del Corán» extrae de tres emparejamientos sólidos (Al-Ghāshiya/Al-Faŷr, Al-Layl/Al-Ḍuḥā, Al-Ḍuḥā/Al-Sharḥ) el patrón de las buenas nuevas que siguen a la advertencia, destila cuatro patrones prevalecientes que rigen las buenas nuevas del Corán, y ancla la lectura en la tradición de ʿilm al-munāsabāt.',
    },
  },
  {
    slug: 'island-of-quran',
    coverImage: '/articles/island-of-quran.png',
    category: 'civilization',
    isoDate: '2026-02-06',
    date: { ar: '٦ فبراير ٢٠٢٦', en: 'February 6, 2026', es: '6 de febrero de 2026' },
    readingMinutes: 13,
    series: {
      ar: 'القرآن والحضارة',
      en: "The Qur'an and Civilization",
      es: 'El Corán y la Civilización',
    },
    episode: 7,
    title: {
      ar: 'جَزيرَةُ القُرآن',
      en: "The Island of the Qur'an",
      es: 'La isla del Corán',
    },
    subtitle: {
      ar: 'حين يَنقَسِم العالَمُ إلى جَزيرَتَين: جَزيرَةُ الإذنِ والكَرامَة، وجَزيرَةُ الفَوضى والعَبَث',
      en: 'When the World Splits into Two Islands — One of Permission and Dignity, One of Chaos and Indulgence',
      es: 'Cuando el mundo se divide en dos islas: la isla del permiso y la dignidad, y la isla del caos y la frivolidad',
    },
    excerpt: {
      ar: 'في الكَوكَب جُزُرٌ كثيرة، لكنّها في الجَوهَر صِنفان: جزيرةٌ يَعبُر إليها الإنسانُ بإذنٍ من السماء فيَستردّ كَرامتَه، وجزيرةٌ يَتسلّل إليها خُفيةً ليُخفي عارَه. هذه الحلقة السابعة من «القرآن والحضارة» تَستخرج من باء «بسم الله» قانونَ الإذن في دُخول جزيرة الوَحي، تَقرأ افتتاحَ القرآن بـ«اقرأ» قبل «آمِنْ» قانونًا لحماية الإنسان من الفَشل، تُشَخِّص أنّ أزمة العالم ليست تقنيّةً بل أزمةُ فراغٍ أخلاقي، وتَطرح رمضان ثَورةً على الفَوضى الداخليّة وتدريبًا على السيادة الذاتيّة.',
      en: "On our planet there are countless islands — but in essence only two: an island crossed by permission from the heavens where the human recovers his dignity, and an island sneaked into to hide one's shame. This seventh episode of 'The Qur'an and Civilization' extracts from the bāʾ of 'In the name of God' the law of permission for entering the island of revelation, reads the Qur'an's opening with 'Read' before 'Believe' as a law of human protection from failure, diagnoses that the world's crisis is not technological but a crisis of moral emptiness, and presents Ramadan as a revolution against inner chaos and a training in self-sovereignty.",
      es: 'En nuestro planeta hay incontables islas, pero en esencia solo dos: una isla a la que se cruza por permiso de los cielos, donde el ser humano recobra su dignidad, y otra a la que se cuela para esconder su vergüenza. Este séptimo episodio extrae de la «bāʾ» de «En el nombre de Dios» la ley del permiso para entrar en la isla de la revelación, lee la apertura del Corán con «Lee» antes de «Cree» como ley de protección humana contra el fracaso, y presenta el Ramadán como una revolución contra el caos interior.',
    },
  },
  {
    slug: 'awakened-consciences',
    coverImage: '/articles/awakened-consciences.png',
    category: 'wisdom-insights',
    isoDate: '2026-05-23',
    date: { ar: '٢٣ مايو ٢٠٢٦', en: 'May 23, 2026', es: '23 de mayo de 2026' },
    readingMinutes: 12,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 4,
    title: {
      ar: 'الضَّمائرُ اليقظَة',
      en: 'Awakened Consciences',
      es: 'Las conciencias despiertas',
    },
    subtitle: {
      ar: 'قراءةٌ في حركةِ الإيمان من مشاهد الخليل إلى وعيِ الإنسان المعاصر',
      en: 'A Reading in the Movement of Faith — From the Scenes of the Khalīl to the Awareness of the Modern Soul',
      es: 'Una lectura en el movimiento de la fe, desde las escenas del Amigo (Abraham) hasta la conciencia del ser humano contemporáneo',
    },
    excerpt: {
      ar: 'ما الذي يجعل القلبَ يهفو إلى بيتٍ في صحراء، والنفسَ تتجرَّد من ألقابها لِتقفَ على صعيدٍ واحد؟ إنّه سرُّ الضمير اليقظ. هذه الحلقة الرابعة من «حِكَمٌ وبصائر» تَتَتَبَّع نبضَ الضمير في مَشاهد إبراهيمَ وهاجرَ وإسماعيل، ثم تَقرأ سورةَ القيامة شاهداً على بصيرة الإنسان على نفسه، وتَكشِف عن المنظومة التعبّديّة في الإسلام بوصفها نظاماً لإيقاظ الضمائر، وتُحدّد للضمير المعاصر أربعةَ أدوار في الأبوّة والزوجيّة والعمل والرسالة، وتَختمُ بأنّ من ماتَ ضميرُه فقد ماتَ مع إيقاف التنفيذ لبقيّة جسده.',
      en: 'What makes the heart yearn for a house in the desert, and the soul strip itself of titles to stand on a single ground? It is the secret of the awakened conscience. This fourth episode of "Wisdoms & Insights" traces the pulse of the conscience through the scenes of Ibrāhīm, Hājar, and Ismāʿīl, then reads Sūrat al-Qiyāmah as testimony to the human being\'s sure insight over himself, exposes Islam\'s devotional system as a regimen for awakening the conscience, defines four contemporary roles for it — in fatherhood, marriage, work, and message — and closes on the truth that whoever\'s conscience dies has died, with the body merely on suspended sentence.',
      es: '¿Qué hace que el corazón anhele una casa en el desierto, y que el alma se despoje de los títulos para erguirse sobre un solo suelo? Es el secreto de la conciencia despierta. Este cuarto episodio de «Sabidurías y Perspectivas» rastrea el latido de la conciencia a través de las escenas de Ibrāhīm, Hāyar e Ismāʿīl, luego lee la sura de Al-Qiyāma como testimonio de la clara perspicacia del ser humano sobre sí mismo, expone el sistema devocional del Islam como un régimen para despertar la conciencia, le define cuatro roles contemporáneos —en la paternidad, el matrimonio, el trabajo y el mensaje— y cierra con la verdad de que quien tiene su conciencia muerta ha muerto, con el cuerpo meramente en sentencia suspendida.',
    },
  },
  {
    slug: 'house-of-dawah-inherited-image-human-reality',
    coverImage: '/articles/house-of-dawah-inherited-image-human-reality.png',
    category: 'imamship',
    isoDate: '2026-05-20',
    date: { ar: '٢٠ مايو ٢٠٢٦', en: 'May 20, 2026', es: '20 de mayo de 2026' },
    readingMinutes: 9,
    series: {
      ar: 'قَضايا الإمام',
      en: 'Issues of the Imam',
      es: 'Cuestiones del Imam',
    },
    episode: 2,
    title: {
      ar: 'بيتُ الدعوة: بين الصورةِ المَوروثة والحقيقةِ البَشريّة',
      en: 'The House of Daʿwah: Between the Inherited Image and the Human Reality',
      es: 'La casa del llamado: entre la imagen heredada y la verdad humana',
    },
    subtitle: {
      ar: 'تأمُّلٌ في الفجوة بين الصورة الذهنيّة لبيت الإمام وبَشريّته الحقيقيّة — من بيت النبوّة إلى بيوت اليوم',
      en: "A Reflection on the Gap Between the Mental Image of the Imam's Household and Its True Humanity — From the Prophetic Household to Today's Homes",
      es: 'Una contemplación de la brecha entre la imagen mental de la casa del imam y su humanidad real — de la casa de la profecía a las casas de hoy',
    },
    excerpt: {
      ar: 'في مخيلة الجالية يَسكنُ بيتَ الداعية صورةٌ موروثةٌ مُسطَّحة لا تَحتمل البشريّة. لكنّ القرآن نفسه فَتَح نوافذَ بيت النبوّة على الجوع والغَيرة والإيلاء والإفك، وعالَج كلَّ ضغطٍ بنمطٍ مختلف. هذه الحلقة الثانية من «قضايا الإمام» تُفكِّك ثلاثَ "مُصادَرات" يَرزحُ تحتها بيتُ الإمام المعاصر، وتُفرد فصلاً لنفسيّة زوجته، وتُعيد تعريفَ القُدوة من "بيتٍ بلا توتّر" إلى "بيتٍ يُدير توتّرَه بحكمة".',
      en: "In the imagination of the community, the daʿwah household is inhabited by a flat, inherited image that cannot bear humanity. Yet the Qurʾān itself opened the windows of the Prophetic household onto hunger, jealousy, separation, and slander — treating each pressure with a different mode. This second episode of 'Issues of the Imam' unpacks three 'confiscations' the contemporary imam's home labors under, devotes a section to his wife's inner life, and redefines exemplarity from 'a home without tension' to 'a home that manages its tension with wisdom'.",
      es: 'En la imaginación de las comunidades habita una imagen heredada de la casa del predicador: ejemplares del Corán abiertos, una esposa que calla, una devoción que llena las paredes. Pero el Corán mismo desmontó esta imagen al presentar la casa de la profecía en su realidad —el hambre, los celos, el īlāʾ, la calumnia. Este segundo episodio de «Cuestiones del Imam» desentraña tres «confiscaciones» bajo las que gime la casa del imam contemporáneo, y redefine el modelo: de «una casa sin tensión» a «una casa que administra su tensión con sabiduría».',
    },
  },
  {
    slug: 'children-of-imams-grace-and-trial',
    category: 'imamship',
    isoDate: '2026-05-19',
    date: { ar: '١٩ مايو ٢٠٢٦', en: 'May 19, 2026', es: '19 de mayo de 2026' },
    readingMinutes: 11,
    series: {
      ar: 'قَضايا الإمام',
      en: 'Issues of the Imam',
      es: 'Cuestiones del Imam',
    },
    episode: 1,
    title: {
      ar: 'أبناءُ الأئمة بين المِنحة والمِحنة',
      en: 'Children of the Imams: Between Grace and Trial',
      es: 'Los hijos de los imanes entre la dádiva y la prueba',
    },
    subtitle: {
      ar: 'تأمّلاتٌ في بيتِ الإمام، ومَن نَشَؤوا فيه بين ما يَراه الناسُ وما يَعرفه الأهل',
      en: "Reflections on the Imam's Household, and Those Raised in It Between What People See and What the Family Knows",
      es: 'Contemplaciones en la casa del imam, y los que crecieron en ella entre lo que la gente ve y lo que la familia conoce',
    },
    excerpt: {
      ar: 'في بيت الإمام بيئتان: واحدة يراها الناس، وأخرى يعرفها أهله. وأبناؤه هم الجسر بين العالمين، يحملون — وهم بعدُ صغار — ما لا يحمله الكبار، ويعيشون مفارقة "السيّد الفقير" ومحنة الهويّة وإرث الأخطاء... ثمّ يخرجون من هذه المدرسة بثمار لا يقطفها سواهم.',
      en: 'In the imam\'s house there are two worlds: one people see, and one only the family knows. His children are the bridge between two realms — carrying, while still small, what grown men do not, living the paradox of the "impoverished eminence," the trial of identity, and the inheritance of mistakes… yet emerging from this school with fruits no one else can pluck.',
      es: 'En la casa del imam hay dos mundos: uno que la gente ve, y otro que solo la familia conoce. Sus hijos son el puente entre los dos reinos —que cargan, siendo aún pequeños, lo que los hombres adultos no, que viven la paradoja de la «eminencia empobrecida», la prueba de la identidad, y la herencia de los errores… y, sin embargo, salen de esta escuela con frutos que nadie más puede cosechar. El imamato es una herencia de sentido, no de forma.',
    },
    coverImage: '/articles/children-of-imams-grace-and-trial/children-of-imams-flyer.png',
    coverCaption: {
      ar: 'الفلاير الرسمي لمقال «أبناءُ الأئمة بين المِنحة والمِحنة» — قَضايا الإمام، الحلقة الأولى.',
      en: 'Official cover for the article "Children of the Imams: Between Grace and Trial" — Issues of the Imam, Episode 1.',
    },
  },
  {
    slug: 'steadfastness-texts-and-souls',
    category: 'wisdom-insights',
    isoDate: '2026-05-17',
    date: { ar: '١٧ مايو ٢٠٢٦', en: 'May 17, 2026', es: '17 de mayo de 2026' },
    readingMinutes: 12,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 4,
    title: {
      ar: 'الاستمرارية بين دلالة النصوص وتجاوب النفوس',
      en: 'Steadfastness Between the Indications of the Sacred Texts and the Response of the Human Soul',
      es: 'La continuidad entre la indicación de los textos y la respuesta de las almas',
    },
    subtitle: {
      ar: 'كلمة في اللقاء الشهري بمسجد الأكاديمية الأمريكية للأئمة (AIA) — تكساس',
      en: 'A Reflection from the Monthly Gathering at the American Imams Academy Masjid (AIA) — Texas',
      es: 'Una palabra en el encuentro mensual en la Mezquita de la Academia Americana de los Imanes (AIA) — Texas',
    },
    excerpt: {
      ar: 'ما بعد رمضان ليس فراغًا، بل امتدادًا. تتضافر النصوص الشرعية على أهمية الاستمرارية، وتتفاوت النفوس في التجاوب معها. هذه الحلقة الرابعة من سلسلة ـحِكَمٌ وبصائرـ تفكّك تضافر النصوص على الاستمرارية، وترسم عشرة أنماط سلوكية للناس بعد مواسم الطاعة، وتقدّم ثماني خطوات عملية لتحويل الفتور إلى استمرارية.',
      en: 'What comes after Ramadan is not emptiness, but extension. The sacred texts converge on the meaning of continuity, while souls differ in how they respond. This fourth episode of the Wisdoms & Insights series unpacks the convergence of the texts on continuity, maps ten behavioral patterns of people after seasons of worship, and offers eight practical steps for turning post-season listlessness into sustained steadfastness.',
      es: 'Lo que viene tras el Ramadán no es vacío, sino extensión. Los textos sagrados convergen en el sentido de la continuidad, mientras que las almas difieren en su respuesta. Este cuarto episodio de la serie «Sabidurías y Perspectivas» desentraña la convergencia de los textos sobre la continuidad, cartografía diez patrones de comportamiento de las gentes tras las temporadas de adoración, y ofrece ocho pasos prácticos para tornar la desgana posterior a la temporada en una firmeza sostenida.',
    },
    coverImage: '/articles/steadfastness-texts-and-souls/الاستمرارية بين دلالة النصوص وتجاوب النفوس .jpg',
    coverCaption: {
      ar: 'هذا المقال خلاصة كلمة أُلقيت في اللقاء الشهري بمسجد الأكاديمية الأمريكية للأئمة (AIA Masjid) بمدينة سخسي، ولاية تكساس (الولايات المتحدة الأمريكية)، يوم الجمعة 3 إبريل 2026م، بين المغرب والعشاء، تلاها قيام بعد العشاء.',
      en: 'This article is a written distillation of the talk delivered at the monthly gathering of the American Imams Academy Masjid (AIA) in Sachse, Texas (USA) on Friday, April 3, 2026, between Maghrib and ʻIshāʾ, followed by Qiyām after ʻIshāʾ.',
    },
  },
  {
    slug: 'best-nation-best-religion',
    category: 'wisdom-insights',
    isoDate: '2026-05-17',
    date: { ar: '١٧ مايو ٢٠٢٦', en: 'May 17, 2026', es: '17 de mayo de 2026' },
    readingMinutes: 14,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 3,
    title: {
      ar: 'خَيرُ أُمَّةٍ لخَيرِ دِين',
      en: 'The Best Nation for the Best Religion',
      es: 'La mejor comunidad para la mejor religión',
    },
    subtitle: {
      ar: 'قراءةٌ في الميزان القرآنيِّ لـ«خَيريَّة» الأُمَّة، ومَوقعنا منها اليومَ',
      en: 'A Reading in the Qur\'anic Scale of the "Bestness" of the Ummah, and Where We Stand Today',
      es: 'Una lectura de la aleya con una balanza, no con un lema',
    },
    excerpt: {
      ar: 'يَتلو المسلمون قولَه تعالى: ﴿كُنْتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ﴾ كأنَّها وَسامُ انتماءٍ مَجَّاني. لكنَّ الآيةَ شَرطٌ لا وَصفٌ مَجَّاني، وفيها ثلاثُ مَشروطات. هذه الحلقة الثالثة من «حكم وبصائر» تَفكِّك معنى «الخَيريَّة» في الميزان الإسلاميِّ، وتَكشف عن مَوقع المسلمين في الغرب من هذا الميزان، وتُشخِّص ثلاثَ آفاتٍ تَفصم الأمَّةَ عن خَيريَّتها، وتَرسم أَربعَ طُرقٍ عمليَّةٍ للعودة إلى مَعنى «أُخرجَتْ للنَّاس» في زَماننا.',
      en: 'Muslims recite the verse "You were the best nation produced for mankind" as if it were a gratuitous certificate of belonging. But the verse states a condition, not a free description — it lists three requirements. This third episode of "Wisdoms & Insights" unpacks the meaning of "bestness" in the Islamic scale, reveals where Muslims of the West stand in relation to this measure, diagnoses three afflictions that tear the community from its bestness, and charts four practical paths to recovering the meaning of "produced for mankind" in our time.',
      es: 'Los musulmanes recitan la aleya «Fuisteis la mejor nación suscitada para la humanidad» como si fuera un certificado gratuito de pertenencia. Pero la aleya enuncia una condición, no una descripción libre —enumera tres requisitos. Este tercer episodio de «Sabidurías y Perspectivas» desentraña el sentido de la «mejoría» en la balanza islámica, revela dónde se yerguen los musulmanes de Occidente respecto a esta medida, diagnostica tres dolencias que arrancan a la comunidad de su mejoría, y traza cuatro sendas prácticas para recobrar el sentido de «suscitada para la humanidad» en nuestro tiempo.',
    },
    coverImage: '/articles/best-nation-best-religion/charlotte-flyer.jpg',
    coverCaption: {
      ar: 'هذا المقال خُلاصةُ خُطبة الجمعة التي أُلقيتْ في «مسجد التَّوبة» — مَركز شارلوت الإسلاميِّ (ICC) بولاية كارولينا الشَّماليَّة (الولايات المتَّحدة الأمريكيَّة)، يوم الجمعة 16 أغسطس 2024م، ضِمن زيارة د. أحمد أبو سيف لرعاية أبناء الجالية المسلمة.',
      en: 'This article is a written distillation of the Friday sermon delivered at Masjid al-Tawbah — the Islamic Center of Charlotte (ICC) in North Carolina (USA) on Friday, August 16, 2024, during Dr. Ahmed Abouseif\'s visit to support the Muslim community.',
    },
  },
  {
    slug: 'servitude-deed-and-word',
    category: 'wisdom-insights',
    isoDate: '2026-05-17',
    date: { ar: '١٧ مايو ٢٠٢٦', en: 'May 17, 2026', es: '17 de mayo de 2026' },
    readingMinutes: 15,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 2,
    title: {
      ar: 'عبوديَّتنا بين المقام والمقال',
      en: 'Our Servitude — Between Deed and Word',
      es: 'Nuestra servidumbre entre el estado y el dicho',
    },
    subtitle: {
      ar: 'قراءةٌ تأمُّليَّةٌ في الفجوة بين ما نَقول وما نَكون',
      en: 'A Reflective Reading on the Gap Between What We Say and What We Are',
      es: 'Una lectura contemplativa de la brecha entre lo que decimos y lo que somos',
    },
    excerpt: {
      ar: 'كان البلاغيُّون يَزِنون الفصاحة بـ«لكلِّ مقامٍ مقال»؛ لكنَّ في الدِّين معضلةً أَعمق: أن يَجد لكلِّ مقالٍ يَنطق به مقامًا يُصدِّقه في صدره وحياته. هذه الحلقة الثانية من سلسلة «حكم وبصائر» تَستخرج من الميزان القرآنيِّ ﴿لِمَ تَقُولُونَ مَا لَا تَفْعَلُونَ﴾ ثلاثَ درجاتٍ للعبوديَّة، وثلاثَ نماذجَ من واقع جالياتنا في الغرب، وثلاثَ آفاتٍ تَفصم المقامَ عن المقال، وخَريطةً عمليَّةً من خَمس خُطُواتٍ لردم الفجوة بين ما نَقول وما نَكون.',
      en: 'The classical rhetoricians measured eloquence by "For every situation, a fitting speech." But in religion there is a deeper question: that the believer find for every word he utters a station within him that confirms it. This second episode of the "Wisdoms & Insights" series extracts from the decisive Qur\'anic scale ("Why do you say what you do not do?") three degrees of servitude, three examples from our communities in the West, three afflictions that tear station from speech, and a practical five-step map for bridging the gap between what we say and what we are.',
      es: 'Los retóricos clásicos medían la elocuencia por «para cada situación, un discurso propio». Pero en la religión hay una pregunta más honda: que el creyente halle para cada palabra que pronuncia una estación dentro de él que la confirme. Este segundo episodio de «Sabidurías y Perspectivas» extrae de la balanza coránica decisiva («¿Por qué decís lo que no hacéis?») tres grados de la servidumbre, tres ejemplos de nuestras comunidades en Occidente, tres dolencias que arrancan la estación del discurso, y un mapa práctico de cinco pasos para salvar la brecha entre lo que decimos y lo que somos.',
    },
    coverImage: '/articles/servitude-deed-and-word/qassam-flyer.jpg',
    coverCaption: {
      ar: 'هذا المقال خُلاصةُ محاضرة المساء التي أُلقيتْ في «مسجد القَسَّام» — مَركز الجالية الإسلاميَّة في تامبا، ولاية فلوريدا (الولايات المتَّحدة الأمريكيَّة)، يوم السبت 11 أكتوبر 2025م، ضِمن زيارة د. أحمد أبو سيف لرعاية أبناء الجالية المسلمة.',
      en: 'This article is a written distillation of the evening lecture delivered at Masjid al-Qassam — the Islamic Community of Tampa, Florida (USA) on Saturday, October 11, 2025, during Dr. Ahmed Abouseif\'s visit to support the Muslim community.',
    },
  },
  {
    slug: 'wisdom-lost-property',
    category: 'wisdom-insights',
    isoDate: '2026-05-17',
    date: { ar: '١٧ مايو ٢٠٢٦', en: 'May 17, 2026', es: '17 de mayo de 2026' },
    readingMinutes: 14,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
      es: 'Sabidurías y Perspectivas',
    },
    episode: 1,
    title: {
      ar: 'الحِكمةُ ضالَّةُ المؤمنِ',
      en: 'Wisdom is the Lost Property of the Believer',
      es: 'La sabiduría es el extravío del creyente',
    },
    subtitle: {
      ar: 'قراءةٌ تأصيليَّةٌ في معنًى مأثور، وفي معضلةٍ حضاريَّةٍ معاصرة',
      en: 'A Foundational Reading of a Cherished Maxim and a Contemporary Civilizational Dilemma',
      es: 'Una lectura fundacional de un dicho transmitido, y de un dilema civilizatorio contemporáneo',
    },
    excerpt: {
      ar: 'اشتُهر على الألسنة قولٌ مأثورٌ: «الحكمةُ ضالَّةُ المؤمن، أنَّى وَجَدها فهو أحقُّ بها». تُحرِّر هذه القراءةُ التأصيليَّةُ مَنزلةَ هذا المعنى علميًّا، وتَفتح بمقتضاه معادلةً حضاريَّةً عميقة يَعيشها المسلمُ المعاصر، وبخاصَّةٍ في الغرب: كيف يَنفتح على ميراث الإنسانيَّة دون أن يَذوب فيه؟ وكيف يأخذ من غيره دون أن يَفقد ذاتَه؟ مع تَخريجٍ دقيقٍ لكلِّ حديثٍ وأثرٍ، وثلاثة نماذجَ من واقعنا في أمريكا، وخاتمةٌ حضاريَّةٌ تَكشف أنَّ أزمةَ العالم اليومَ ليست أزمةَ معلومات، بل أزمةُ حكمة.',
      en: 'A cherished maxim circulates: "Wisdom is the lost property of the believer; wherever he finds it, he is most worthy of it." This foundational reading clarifies the scholarly status of this meaning and opens, on its basis, a deep civilizational equation that the contemporary Muslim — especially in the West — must navigate: How do we open to humanity\'s heritage without dissolving into it? How do we receive from others without losing ourselves? With careful authentication of every prophetic tradition and saying cited, three vivid examples from our American reality, and a civilizational conclusion: the crisis of today\'s world is not a crisis of information, but a crisis of wisdom.',
      es: 'Una máxima preciada circula: «La sabiduría es el bien perdido del creyente; dondequiera que lo halle, es el más merecedor de él.» Esta lectura fundacional aclara el rango académico de este sentido y abre, sobre su base, una honda ecuación civilizatoria que el musulmán contemporáneo —especialmente en Occidente— debe navegar: ¿cómo nos abrimos al legado de la humanidad sin disolvernos en él? Con una cuidadosa autentificación de cada hadiz citado, tres ejemplos vívidos de nuestra realidad estadounidense, y una conclusión: la crisis del mundo de hoy no es una crisis de información, sino una crisis de sabiduría.',
    },
    coverImage: '/articles/wisdom-lost-property/tmc-flyer.png',
    coverCaption: {
      ar: 'هذا المقال خُلاصةُ محاضرة المساء التي أُلقيتْ في مسجد TMC بمدينة تامبا، ولاية فلوريدا (الولايات المتَّحدة الأمريكيَّة)، يوم الجمعة 10 أكتوبر 2025م، ضمن زيارة د. أحمد أبو سيف لرعاية أبناء الجالية المسلمة.',
      en: 'This article is a written distillation of the evening lecture delivered at TMC Masjid in Tampa, Florida (USA) on Friday, October 10, 2025, during Dr. Ahmed Abouseif\'s visit to support the Muslim community.',
    },
  },
  {
    slug: 'philosophy-of-displacement',
    coverImage: '/articles/philosophy-of-displacement.png',
    category: 'civilization',
    isoDate: '2026-05-23',
    date: { ar: '٢٣ مايو ٢٠٢٦', en: 'May 23, 2026', es: '23 de mayo de 2026' },
    readingMinutes: 16,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
      es: 'El Corán y la Civilización',
    },
    episode: 6,
    title: {
      ar: 'فلسفة التهجير في القرآن الكريم',
      en: "The Philosophy of Displacement in the Noble Qur'an",
      es: 'La filosofía del desplazamiento en el Noble Corán',
    },
    subtitle: {
      ar: 'الحلقة السادسة — قِراءَةٌ بِنيَويَّةٌ في خَمسَةِ نَماذِجَ قُرآنيَّةٍ تَكشِفُ ثَوابتَ السُّلطَةِ المُتَجَبِّرَةِ وَفِقهَ النَّجاةِ مِنها',
      en: 'Episode Six — A Structural Reading of Five Qur\'anic Models Revealing the Constants of Tyrannical Power and the Jurisprudence of Deliverance',
      es: 'El sexto episodio de la serie «El Corán y la civilización» — una lectura estructural de cinco modelos coránicos que descubren las constantes del poder tiránico y la jurisprudencia de la salvación de él',
    },
    excerpt: {
      ar: 'مِن أَهَمِّ اللَّقَطاتِ الحَضاريَّةِ الَّتي يَستَوقِفُنا فيها القُرآنُ الكَريم، لَقطَةُ التَّهجيرِ القَسريِّ لِلمُصلِحين. هذه الحَلَقَة السَّادِسَة مِن سِلسلَة «القُرآن والحَضارَة» تَستَخرِج مِن خَمسَةِ نَماذِجَ قُرآنيَّة (شُعَيب، لُوط، مُحَمَّد ﷺ، فِرعَون، الإسراء) سَبعَ قَوانينَ ثابِتَة في فَلسَفَة الإِخراج، وَتُشَخِّص البُنيَة النَّفسيَّة لِلسُّلطَة المُتَجَبِّرَة، وَمُؤَشِّرات انفِلاتِ قَبضَتِها، وَثَلاثَ قَوانينَ لِلنَّجاة. تَأصيلٌ يَنقُل المُسلِم في الغُربَة مِن مَوقِع التَّفاعُل العاطِفي إلى مَوقِع التَّأَمُّل الفِقهي.',
      en: 'Among the most significant civilizational scenes at which the Qur\'an pauses us is the scene of the forced displacement of reformers. This sixth episode of the "Qur\'an and Civilization" series extracts from five Qur\'anic models (Shu\'ayb, Lot, Muhammad ﷺ, Pharaoh, al-Isrāʾ) seven fixed laws in the philosophy of expulsion, diagnoses the psychological architecture of tyrannical power, the signs of its grip slipping, and three laws of deliverance. A foundational reading that moves the Muslim in exile from the position of emotional reaction to the position of jurisprudential reflection.',
      es: 'Sexto episodio. De cinco modelos coránicos (Shuʿayb, Lot, Muhammad ﷺ, Faraón, Al-Isrāʾ) se extraen siete leyes fijas en la filosofía del destierro, se diagnostica la arquitectura psicológica del poder tiránico, los signos de que su control se escapa, y tres leyes de salvación. Una lectura fundacional que mueve al musulmán en el exilio de la posición de la reacción emocional a la de la reflexión jurisprudencial.',
    },
  },
  {
    slug: 'isra-and-the-civic-state',
    coverImage: '/articles/isra-and-the-civic-state.png',
    category: 'civilization',
    isoDate: '2026-05-20',
    date: { ar: '٢٠ مايو ٢٠٢٦', en: 'May 20, 2026', es: '20 de mayo de 2026' },
    readingMinutes: 16,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
      es: 'El Corán y la Civilización',
    },
    episode: 5,
    title: {
      ar: 'الإِسراءُ قَبل المِعراج — السُّورَةُ الدُّستوريَّةُ وَنَموذَجُ الدَّولَةِ المَدَنيَّة',
      en: 'The Isrāʾ Before the Miʿrāj — The Constitutional Sūra and the Civic State Model',
      es: 'El Viaje Nocturno antes de la Ascensión — la sura constitucional y el modelo del Estado civil',
    },
    subtitle: {
      ar: 'الحلقة الخامسة — حَركَةٌ أُفُقيَّةٌ، وَمَوادُّ تَأسيسيَّةٌ، وَتَحَدِّياتٌ مَفصَليَّة',
      en: 'Episode Five — A Horizontal Movement, Foundational Articles, and Pivotal Challenges',
      es: 'El quinto episodio de la serie «El Corán y la civilización» — un movimiento horizontal, artículos fundacionales, y desafíos decisivos',
    },
    excerpt: {
      ar: 'لِماذا سَمَّى القُرآنُ السُّورَةَ بِاسم الحَركَة الأُفُقيَّة (الإِسراء) دون الحَركَة العَموديَّة (المِعراج)؟ لِأَنَّ الحَقَّ يُسَمِّي بِما يَستَطيعُ النَّاسُ أَن يَفعَلوه. الحَلَقَة الخامِسَة مِن سِلسلة «القُرآن والحَضارَة» تَستَخرِج مِن سورَة الإِسراء — وَهي في وَسَط المُصحَف — مَوادَّ دُستوريَّة لِلدَّولَة المَدَنيَّة، وَثَلاثَة نَماذِجَ لِلحَركَة الحَضاريَّة (البُراق، السَّفينَة، العَصا)، وَتُشَخِّص ضَغطَي المُداهَنَة وَالإِخراج، وَتَكشِف مَنطِق التَّعجيز عِندَ المُجتَمَع المُهَيمِن.',
      en: "Why did the Qur'an name the sūra after the horizontal movement (Isrāʾ) rather than the vertical movement (Miʿrāj)? Because the Truth names with what humans can imitate. Episode Five of the 'Qur'an and Civilization' series extracts from Sūrat al-Isrāʾ — at the center of the muṣḥaf — the constitutional articles of the civic state, three models of civilizational movement (the Burāq, the Ark, the Staff), and diagnoses the pressures of compromise and expulsion, exposing the logic of impossible-demands in dominant societies.",
      es: 'Quinto episodio. ¿Por qué nombró el Corán la sura por el movimiento horizontal (Isrāʾ) y no por la ascensión (Miʿrāch)? Porque el Altísimo nombra con lo que los humanos pueden imitar. La sura de Al-Isrāʾ presenta los artículos de una constitución cívica, el honrar a los hijos de Adán, tres modelos de movimiento, y diagnostica las presiones de la componenda y la expulsión, desentrañando la lógica de las exigencias imposibles en las sociedades dominantes.',
    },
  },
  {
    slug: 'sunan-of-civilization',
    coverImage: '/articles/sunan-of-civilization.png',
    category: 'civilization',
    isoDate: '2026-05-19',
    date: { ar: '١٩ مايو ٢٠٢٦', en: 'May 19, 2026', es: '19 de mayo de 2026' },
    readingMinutes: 14,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
      es: 'El Corán y la Civilización',
    },
    episode: 4,
    title: {
      ar: 'سُنَنُ الحَضارَة في القُرآن — سِتَّةُ قَوانينَ تَحكُم صُعودَ الأُمَم وَسُقوطَها',
      en: "The Sunan of Civilization in the Qur'an — Six Laws That Govern the Rise and Fall of Nations",
      es: 'Las leyes de la civilización en el Corán — seis leyes que rigen el ascenso de las naciones y su caída',
    },
    subtitle: {
      ar: 'الحلقة الرابعة — وَقفَةٌ جامِعَةٌ بَعد الكَهف ويوسُف وسُليمان',
      en: "Episode Four — A Synthesizing Pause after al-Kahf, Yūsuf, and Sulaymān",
      es: 'El cuarto episodio de la serie «El Corán y la civilización» — una pausa de síntesis tras la Caverna, José y Salomón',
    },
    excerpt: {
      ar: 'بَعد ثَلاث حَلَقات في الكَهف ويوسُف وسُليمان، تَأَتي هذه الحَلَقَة لِتَستَخلِص سِتَّ سُنَنٍ إلهيَّة تَحكُم صُعود الأُمَم وَسُقوطَها: الاستِخلاف، التَّغيير الذَّاتي، الابتِلاء، المُداوَلَة، التَّدافُع، إصلاح الأَرض. كُلُّ سُنَّةٍ مَأخوذَةٌ مِن آيَةٍ مُحكَمَة، وَمُؤَيَّدَةٌ بِما رَأَيناه في السُّوَر الثَّلاث. وَقفَةٌ جامِعَةٌ لا خاتِمَة، تُمَهِّد لِما بَعدها مِن سُوَر.',
      en: "After three episodes on al-Kahf, Yūsuf, and Sulaymān, this episode extracts six divine sunan governing the rise and fall of nations: succession, self-change, trial, alternation, pressing-back, and reform of the earth. Each is drawn from a binding verse and corroborated by what we have seen in the three sūras. A synthesizing pause, not a closing — preparing the ground for further sūras to come.",
      es: 'Cuarto episodio: una pausa de síntesis. Tras Al-Kahf, Yūsuf y Sulaymān, se destilan seis leyes divinas (sunan) que rigen el auge y la caída de las naciones —sucesión, cambio de sí mismo, prueba, alternancia, contención y reforma— y se muestra cómo se entretejen, y cómo se aplican al individuo como a la umma. Las sunan no muestran favoritismo: quien las comprende cabalga la ola, y quien las ignora es triturado por ellas.',
    },
  },
  {
    slug: 'hudhud-and-sayl',
    coverImage: '/articles/hudhud-and-sayl.png',
    category: 'civilization',
    isoDate: '2026-05-18',
    date: { ar: '١٨ مايو ٢٠٢٦', en: 'May 18, 2026', es: '18 de mayo de 2026' },
    readingMinutes: 15,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
      es: 'El Corán y la Civilización',
    },
    episode: 3,
    title: {
      ar: 'جَناحُ الهُدهُد وَسَيلُ العَرِم — سُنَّةُ الصُّعود والسُّقوط في القُرآن',
      en: "The Hoopoe's Wing and the Flood of al-ʿArim — The Law of Rise and Fall in the Qur'an",
      es: 'El ala de la abubilla y la riada de al-ʿArim — la ley del ascenso y la caída en el Corán',
    },
    subtitle: {
      ar: 'الحلقة الثالثة — جدلية سورتي النَّمل وسَبَأ بين تَمَدُّد الحَضارة وانكفائها',
      en: "Episode Three — A Dialectical Reading of Sūrat al-Naml and Sūrat Sabaʾ between Expansion and Withdrawal",
      es: 'El tercer episodio de la serie «El Corán y la civilización» — la dialéctica de las suras de las Hormigas y de Saba entre la expansión de la civilización y su repliegue',
    },
    excerpt: {
      ar: 'في الأَرض ذاتِها مِن جَزيرَة العَرَب نَهَضَت حَضارَتان: حَضارَة سُليمان تَتَمَدَّد وَتَستَكشِف، وَحَضارَة سَبَأ تَنكَفِئ ثُمَّ تَتَفَرَّق. الحَلقَة الثَّالِثَة مِن سِلسلة «القُرآن والحَضارَة» تَستَخرِج مِن سورَتَي النَّمل وسَبَأ ثَلاثَة أَركان تَنظيميَّة (تَوزيع الأَدوار، الاستِكشاف، نَقل التِّقنيَة)، وَتَطرَح جَدَليَّة المَسجِد السُّليماني مُقابِل المَسجِد السَّبَئي في الغَرب اليَوم.',
      en: "In the same Arabian land, two civilizations arose: Sulaymān's expanding and exploring, and Sabaʾ's withdrawing and scattering. Episode Three of the 'Qur'an and Civilization' series extracts from Sūrat al-Naml and Sūrat Sabaʾ three organizational pillars (distribution of roles, exploration, technology transfer), and presents the dialectic of the Sulaymanic vs. the Sabaʾi mosque in the West today.",
      es: 'Tercer episodio. En la misma tierra arábiga se alzaron dos civilizaciones: la de Sulaymān —que se expande, explora y transfiere el saber— y la de Sabaʾ —que dio gracias, luego se apartó, y se volvió «relatos dispersos». De la sura de An-Naml y la de Sabaʾ se extraen tres pilares de la expansión y la ley del repliegue, con una pregunta para el musulmán en Occidente: ¿eres una Abubilla que parte, o aguardas la riada?',
    },
  },
  {
    slug: 'yusuf-diaspora-civilization',
    coverImage: '/articles/yusuf-diaspora-civilization.png',
    category: 'civilization',
    isoDate: '2026-05-17',
    date: { ar: '١٧ مايو ٢٠٢٦', en: 'May 17, 2026', es: '17 de mayo de 2026' },
    readingMinutes: 13,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
      es: 'El Corán y la Civilización',
    },
    episode: 2,
    title: {
      ar: 'سورة يوسُف ومَنحَنى الصُّعود الحَضاري',
      en: 'Sūrat Yūsuf and the Curve of Civilizational Ascent',
      es: 'La sura de José y la curva del ascenso civilizatorio',
    },
    subtitle: {
      ar: 'الحلقة الثانية — من قاع البئر إلى عَرش الإمبراطورية، ومن الفَرد إلى الأُمَّة',
      en: "Episode Two — From the Pit's Floor to an Imperial Throne, From the Individual to the Ummah",
      es: 'El segundo episodio de la serie «El Corán y la civilización» — del fondo del pozo al trono del imperio, y del individuo a la comunidad',
    },
    excerpt: {
      ar: 'الكَواكِب الإِحدى عَشرَة سَجَدَت لِيوسُف في رُؤياه قَبل أَن تَنحَني له إخوَتُه في مَجلِسه. مَنحَنى الصُّعود يُولَد في البَصيرَة قَبل أَن يَتَجَلَّى في الحَدَث. الحَلَقَة الثَّانيَة مِن سِلسلة «القُرآن والحَضارَة» تَستَخرِج مِن سورَة يوسُف أَربَعَة أَركان لِلصُّعود (العَفاف، العِلم، الاستِنباط، الهِمَّة)، تُشَخِّص ثَلاث أَزَمات لِلجاليَة المُسلِمَة في الغَرب، وَتَطرَح نَموذَج «الزَّرع في أَرض المَهجَر» الَّذي بَين يوسُف وموسى أَربَعَةُ قُرون.',
      en: "The eleven stars bowed to Yūsuf in his dream long before his brothers bowed before his throne. The curve of ascent is born in vision before it manifests in event. Episode Two of the 'Qur'an and Civilization' series extracts from Sūrat Yūsuf four pillars of ascent (chastity, knowledge, foresight, ambition), diagnoses three crises of the Muslim community in the West, and proposes the model of 'sowing in the land of diaspora' — the four centuries that lay between Yūsuf and Mūsā.",
      es: 'Segundo episodio de la serie. Del fondo del pozo al trono: cómo traza la sura de Yūsuf el arco del ascenso por cuatro pilares —castidad, saber, previsión y ambición— y cómo se aplica a las tres crisis de la comunidad musulmana en Occidente. Yūsuf sembró y Mūsā cosechó, cuatro siglos después, en la misma tierra de la diáspora: un mensaje a todo musulmán que se pregunta si es un viajero o un portador de un mensaje.',
    },
  },
  {
    slug: 'fatwa-and-collective-voice',
    coverImage: '/articles/fatwa-and-collective-voice.png',
    category: 'imamship',
    isoDate: '2026-05-16',
    date: { ar: '١٦ مايو ٢٠٢٦', en: 'May 16, 2026', es: '16 de mayo de 2026' },
    readingMinutes: 11,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
      es: 'El Imam en Occidente — Una Escuela para Forjar al Líder',
    },
    episode: 4,
    title: {
      ar: 'الإمام بين الفتوى الفردية وصوت الجماعة',
      en: 'The Imam Between Individual Fatwa and Collective Voice',
      es: 'El imam entre el dictamen individual y la voz de la comunidad',
    },
    subtitle: {
      ar: 'الحلقة الرابعة والأخيرة — حين يَفقد الإفتاء بَوصلتَه في عَصر الخوارزميَّات',
      en: 'Episode Four (Final) — When Fatwa Loses Its Compass in the Age of Algorithms',
      es: 'Cuarto episodio (y último) — cuando el dictamen pierde su brújula en la era de los algoritmos',
    },
    excerpt: {
      ar: 'مُسلمٌ واحد يَستفتي أربعة مَصادر — شيخ يوتيوب، إمام محلي، داعية إنستجرام، نموذج ذكاء اصطناعي — فيتلقَّى أربع فتاوى مُتناقضة. هذه أزمة الإفتاء في الغَرب. الحلقة الرابعة والأخيرة تَعرض شُروط الفَتوى الكلاسيكية، تُشَخِّص انهيار المرجعية، وتطرح مَنظومة «صوت الجماعة» بَديلًا، مع تَوظيف بَحث الشيخ لِدار الإفتاء ٢٠٢٥ عن الفَتوى والذكاء الاصطناعي.',
      en: "A single Muslim consults four sources — a YouTube shaykh, a local imam, an Instagram preacher, and an AI model — and receives four contradictory fatwas. This is the crisis of issuing religious rulings in the West. The fourth and final episode of the series presents the classical conditions of fatwa, diagnoses the collapse of religious authority, and proposes a 'collective voice' alternative — drawing on Dr. Ahmed's 2025 paper for Dar al-Iftaa on fatwa in the age of artificial intelligence.",
      es: 'Cuarto episodio (final). Un solo musulmán consulta cuatro fuentes —un shaij de YouTube, un imam local, un predicador de Instagram, y un modelo de IA— y recibe cuatro dictámenes contradictorios. Esta es la crisis del dictamen en Occidente. El episodio presenta las condiciones clásicas del dictamen, diagnostica el colapso de la autoridad religiosa, y propone la alternativa de la «voz colectiva», apoyándose en la ponencia del Dr. Ahmed de 2025 para Dar al-Iftāʾ sobre el dictamen en la era de la inteligencia artificial.',
    },
  },
  {
    slug: 'institutional-mind',
    coverImage: '/articles/institutional-mind.png',
    category: 'imamship',
    isoDate: '2026-05-15',
    date: { ar: '١٥ مايو ٢٠٢٦', en: 'May 15, 2026', es: '15 de mayo de 2026' },
    readingMinutes: 9,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
      es: 'El Imam en Occidente — Una Escuela para Forjar al Líder',
    },
    episode: 3,
    title: {
      ar: 'لماذا تحتاج مساجد الغرب إلى عقل مؤسسي؟',
      en: 'Why Western Mosques Need an Institutional Mind',
      es: '¿Por qué necesitan las mezquitas de Occidente una mente institucional?',
    },
    subtitle: {
      ar: 'الحلقة الثالثة — خمس عللٍ وخمسة أركان لبناء المسجد الذي يُورِّث',
      en: 'Episode Three — Five Diseases and Five Pillars for the Mosque That Bequeaths',
      es: 'Tercer episodio — cinco dolencias y cinco pilares para construir la mezquita que lega',
    },
    excerpt: {
      ar: 'مَسجدٌ بِلا ذاكرةٍ مؤسَّسية هو شَجرة بلا جذور: مُكتمِلٌ ظاهرًا، هَشٌّ في أوَّل ريح. خمس عِلَل تَنهَش مساجد الغَرب، وخمسة أركان عِلاجية تُحَوِّلها من مَكاتب خِدمات إلى مُؤَسَّسات تُورِّث للأجيال. تَأصيلٌ من فقه الأَوقاف، ونُبوءة ابن خَلدون عن الأَجيال الثلاثة.',
      en: 'A mosque without institutional memory is a tree without roots: complete in appearance, fragile at the first gust. Five diseases plague Western mosques, and five remedial pillars transform them from service desks into institutions that bequeath. A foundation drawn from the fiqh of awqāf and Ibn Khaldūn\'s warning about the three generations.',
      es: 'Tercer episodio. Una mezquita sin memoria institucional es un árbol sin raíces: completa en apariencia, frágil al primer soplo. Cinco enfermedades aquejan a las mezquitas occidentales —individualismo, política interna, falta de planificación, caos financiero, tensión junta-imam— y cinco pilares las transforman de ventanillas de servicio en instituciones que legan. Un fundamento extraído de la jurisprudencia de los awqāf y de la advertencia de Ibn Jaldún sobre las tres generaciones.',
    },
  },
  {
    slug: 'crafting-the-modern-imam',
    coverImage: '/articles/crafting-the-modern-imam.png',
    category: 'imamship',
    isoDate: '2026-05-14',
    date: { ar: '١٤ مايو ٢٠٢٦', en: 'May 14, 2026', es: '14 de mayo de 2026' },
    readingMinutes: 9,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
      es: 'El Imam en Occidente — Una Escuela para Forjar al Líder',
    },
    episode: 2,
    title: {
      ar: 'صناعة الإمام المعاصر: العلم، والإدارة، والاحتواء النفسي',
      en: 'Crafting the Modern Imam: Knowledge, Management, and Pastoral Containment',
      es: 'La fabricación del imam contemporáneo: la ciencia, la administración y la contención psicológica',
    },
    subtitle: {
      ar: 'الحلقة الثانية — من تأسيس العلم إلى احتواء الأزمات والذات',
      en: 'Episode Two — From Building Knowledge to Containing Crises and the Self',
      es: 'Segundo episodio — del establecimiento de la ciencia a la contención de las crisis y del propio ser',
    },
    excerpt: {
      ar: 'لا تُبنى إمامةُ الغرب على عِلمٍ شرعيٍّ خالص ولا على مهارةٍ خَطابية وَحدها. الإمامُ المعاصر يحتاج إلى ثلاثة أركان متلازمة: علمٍ أزهري مُتَّصلٍ بفقه الأقليات، وإدارةٍ مؤسَّسية بأدواتها العملية، واحتواءٍ نفسي للناس وللذات. هذه الحلقة الثانية تقدِّم نموذج التَّأهيل.',
      en: "Imamship in the West cannot be built on Sharia knowledge alone, nor on rhetorical skill. The contemporary imam needs three interlocking pillars: Azhari knowledge anchored in the fiqh of minorities, institutional management with operational tools, and pastoral containment for others and the self. Episode Two of the series presents the formation model.",
      es: 'Segundo episodio. El imamato en Occidente no se edifica sobre el saber sharaico solo, ni sobre la habilidad retórica sola. El imam contemporáneo requiere tres dominios entrelazados: un saber azharí anclado en la jurisprudencia de las minorías, una gestión institucional con herramientas operativas, y una contención pastoral para los demás y para sí mismo. Una escuela que produce hombres, no una oficina que emite certificados.',
    },
  },
  {
    slug: 'imam-in-the-west',
    coverImage: '/articles/imam-in-the-west.png',
    category: 'imamship',
    isoDate: '2026-05-13',
    date: { ar: '١٣ مايو ٢٠٢٦', en: 'May 13, 2026', es: '13 de mayo de 2026' },
    readingMinutes: 9,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
      es: 'El Imam en Occidente — Una Escuela para Forjar al Líder',
    },
    episode: 1,
    title: {
      ar: 'الإمام في الغرب: من إمامة الصلاة إلى إمامة المجتمع',
      en: 'The Imam in the West: From Leading the Prayer to Leading the Community',
      es: 'El imam en Occidente: de la imamía de la oración a la imamía de la comunidad',
    },
    subtitle: {
      ar: 'الحلقة الأولى — التأصيل الفقهي، الواقع العملي، وثَمن القيادة',
      en: 'Episode One — Jurisprudential Foundation, Operational Reality, and the Cost of Leadership',
      es: 'Primer episodio — el fundamento jurídico, la realidad práctica y el precio del liderazgo',
    },
    excerpt: {
      ar: 'يومُ الإمام في الغرب يبدأ قبل أن تطلع الشمس بسبع دوائر متشابكة: شعائرية، فُتيائية، أُسرية، تربوية، مؤسَّسية، مُجتمعية، نَفسية. كيف انفصلت إمامة الصلاة عن إمامة المجتمع، ولماذا يفرض الواقع الأمريكي إعادة جمعهما؟',
      en: "The Imam's day in the West begins before sunrise across seven interlocking circles: ritual, fatwa, family, education, institutional, civic, and psycho-spiritual. How did prayer leadership separate from community leadership — and why does American reality demand their reunification?",
      es: 'Primer episodio de «El imam en Occidente». Un día en la vida del imam en Occidente: siete círculos entrelazados —ritual, dictamen, familia, educación, institución, civismo, y acompañamiento psicológico— que recaen sobre un solo hombre en una sociedad carente de instituciones especializadas. La realidad ha reunificado en él los dos imamatos —la oración y la comunidad— y exige un sistema de formación integral, azharí en el fundamento y estadounidense en el campo.',
    },
  },
  {
    slug: 'quran-civilization',
    coverImage: '/articles/quran-civilization.png',
    category: 'civilization',
    isoDate: '2026-05-12',
    date: { ar: '١٢ مايو ٢٠٢٦', en: 'May 12, 2026', es: '12 de mayo de 2026' },
    readingMinutes: 8,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
      es: 'El Corán y la Civilización',
    },
    episode: 1,
    title: {
      ar: 'القرآن والتأصيل الحضاري',
      en: 'The Qur\'an and the Foundations of Civilization',
      es: 'El Corán y el fundamento civilizatorio',
    },
    subtitle: {
      ar: 'الحلقة الأولى — حين يصنع الوحي الإنسان… تُولد الحضارة',
      en: 'Episode One — When Revelation Shapes the Human, Civilization is Born',
      es: 'Primer episodio — cuando la Revelación fabrica al ser humano… nace la civilización',
    },
    excerpt: {
      ar: 'سورة الكهف ليست مجرد سورة تُتلى يوم الجمعة طلبًا للبركة، بل هي بناء متكامل لأركان الحضارة الإنسانية: المورد البشري، المال الرشيد، العلم المتجدد، والقيادة العادلة. قراءة جديدة في معجم الكهف وأنبياء الحضارة.',
      en: 'Sūrat al-Kahf is not merely a chapter recited on Fridays in pursuit of blessing — it is a complete blueprint for the pillars of human civilization: the righteous human, rightly stewarded wealth, continuous knowledge, and just leadership. A fresh reading in the Kahf lexicon and the Qur\'anic prophets of civilization.',
      es: 'Lectura del primer episodio de «El Corán y la Civilización»: la sura de Al-Kahf como presentación de cuatro pilares —el ser humano justo, la riqueza bien administrada, el saber continuo y el liderazgo justo— y su extensión en los profetas de la civilización. La civilización, en la mirada coránica, no es altura de edificios, sino la recta forja del ser humano: cuando este se ausenta, las torres siguen en pie, pero la civilización ya ha caído.',
    },
  },
];

export function getArticleMeta(slug: string): ArticleMeta | undefined {
  return articlesMeta.find((a) => a.slug === slug);
}

export function getAllArticles(): ArticleMeta[] {
  return [...articlesMeta]
    .filter((a) => !a.draft)
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
}

export const categoryLabels = {
  ar: {
    imamship: 'الإمامة والقيادة',
    civilization: 'القرآن والحضارة',
    family: 'الأسرة والتربية',
    fiqh: 'فقه وفكر',
    'wisdom-insights': 'حِكَمٌ وبصائر',
    'maqasid-tafsir': 'التفسير المقاصدي',
  },
  en: {
    imamship: 'Imamship & Leadership',
    civilization: "Qur'an & Civilization",
    family: 'Family & Parenting',
    fiqh: 'Jurisprudence',
    'wisdom-insights': 'Wisdoms & Insights',
    'maqasid-tafsir': 'Objective-Based Tafsīr',
  },
  es: {
    imamship: 'Imamato y Liderazgo',
    civilization: 'El Corán y la Civilización',
    family: 'Familia y Educación',
    fiqh: 'Jurisprudencia y Pensamiento',
    'wisdom-insights': 'Sabidurías y Perspectivas',
    'maqasid-tafsir': 'Tafsīr orientado a los fines',
  },
};
