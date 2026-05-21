/**
 * Articles metadata — safe to import in client components.
 * For file content loading (uses fs), see lib/articles-server.ts
 */

export type ArticleCategory = 'imamship' | 'civilization' | 'family' | 'fiqh' | 'wisdom-insights';

export interface ArticleMeta {
  slug: string;
  category: ArticleCategory;
  isoDate: string; // YYYY-MM-DD
  date: { ar: string; en: string };
  readingMinutes: number;
  series?: { ar: string; en: string };
  episode?: number;
  title: { ar: string; en: string };
  subtitle?: { ar: string; en: string };
  excerpt: { ar: string; en: string };
  /** Optional cover image (path under /public, e.g. "/articles/slug/cover.jpg") */
  coverImage?: string;
  /** Optional caption displayed under the cover image */
  coverCaption?: { ar: string; en: string };
  draft?: boolean;
}

export const articlesMeta: ArticleMeta[] = [
  {
    slug: 'house-of-dawah-inherited-image-human-reality',
    category: 'imamship',
    isoDate: '2026-05-20',
    date: { ar: '٢٠ مايو ٢٠٢٦', en: 'May 20, 2026' },
    readingMinutes: 12,
    series: {
      ar: 'قَضايا الإمام',
      en: 'Issues of the Imam',
    },
    episode: 2,
    title: {
      ar: 'بيتُ الدعوة: بين الصورةِ المَوروثة والحقيقةِ البَشريّة',
      en: 'The House of Daʿwah: Between the Inherited Image and the Human Reality',
    },
    subtitle: {
      ar: 'قراءةٌ تأصيليّةٌ في الفجوة بين الصورة المثاليّة لبيت الإمام وبَشريّته الحقيقيّة - من بيت النبوّة إلى بيوت اليوم',
      en: "A Foundational Reading on the Gap Between the Idealized Image of the Imam's Household and Its Human Reality — From the Prophetic Household to Today's Homes",
    },
    excerpt: {
      ar: 'يَقف الصحابيُّ الشابُّ على عَتَبة بيت النبوّة يَحمل صورةَ "البيت الملائكيّ"، فيُفاجَأ بكَسر القَصعة، ومَكيدة المَغافير التي نَزَل بسببها التحريم، واشتداد الأمر إلى الإيلاء شهراً ونزول التخيير من السماء. هذه الحلقة الثانية من «قضايا الإمام» تَستفتح بثلاث لَقَطاتٍ موثَّقة من الصحيحَين، ثم تَفتح المقارنةَ بين أمَّهات المؤمنين المُهَيَّآت بيئيّاً وبين زوجاتِ الأئمّة المعاصرات، وتُفكِّك ثلاثَ "مُصادَرات" يَرزحُ تحتها بيتُ الإمام اليومَ، وتُعيد تعريفَ القُدوة من "بيتٍ بلا توتّر" إلى "بيتٍ يُدير توتّرَه بحكمة".',
      en: "A young companion stands at the threshold of the Prophet's household carrying an image of 'the angelic home,' only to be confronted by the breaking of the dish, the maghāfīr stratagem that occasioned the revelation of Sūrat al-Taḥrīm, and the escalation to a month-long īlāʾ and the descent of the Verses of Choice. This second episode of 'Issues of the Imam' opens with three documented scenes from the two Ṣaḥīḥs, then opens the comparison between the Mothers of the Believers — environmentally prepared — and the wives of contemporary imams; it unpacks three 'confiscations' under which the imam's home labors today, and redefines exemplarity from 'a home without tension' to 'a home that manages its tension with wisdom.'",
    },
  },
  {
    slug: 'children-of-imams-grace-and-trial',
    category: 'imamship',
    isoDate: '2026-05-19',
    date: { ar: '١٩ مايو ٢٠٢٦', en: 'May 19, 2026' },
    readingMinutes: 11,
    series: {
      ar: 'قَضايا الإمام',
      en: 'Issues of the Imam',
    },
    episode: 1,
    title: {
      ar: 'أبناءُ الأئمة بين المِنحة والمِحنة',
      en: 'Children of the Imams: Between Grace and Trial',
    },
    subtitle: {
      ar: 'تأمّلاتٌ في بيتِ الإمام، ومَن نَشَؤوا فيه بين ما يَراه الناسُ وما يَعرفه الأهل',
      en: "Reflections on the Imam's Household, and Those Raised in It Between What People See and What the Family Knows",
    },
    excerpt: {
      ar: 'في بيت الإمام بيئتان: واحدة يراها الناس، وأخرى يعرفها أهله. وأبناؤه هم الجسر بين العالمين، يحملون — وهم بعدُ صغار — ما لا يحمله الكبار، ويعيشون مفارقة "السيّد الفقير" ومحنة الهويّة وإرث الأخطاء... ثمّ يخرجون من هذه المدرسة بثمار لا يقطفها سواهم.',
      en: 'In the imam\'s house there are two worlds: one people see, and one only the family knows. His children are the bridge between two realms — carrying, while still small, what grown men do not, living the paradox of the "impoverished eminence," the trial of identity, and the inheritance of mistakes… yet emerging from this school with fruits no one else can pluck.',
    },
    coverImage: '/articles/children-of-imams-grace-and-trial/flyer-children-of-imams.jpg',
    coverCaption: {
      ar: 'الفلاير الرسمي لمقال «أبناءُ الأئمة بين المِنحة والمِحنة» — قَضايا الإمام، الحلقة الأولى.',
      en: 'Official cover for the article "Children of the Imams: Between Grace and Trial" — Issues of the Imam, Episode 1.',
    },
  },
  {
    slug: 'steadfastness-texts-and-souls',
    category: 'wisdom-insights',
    isoDate: '2026-05-17',
    date: { ar: '١٧ مايو ٢٠٢٦', en: 'May 17, 2026' },
    readingMinutes: 12,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 4,
    title: {
      ar: 'الاستمرارية بين دلالة النصوص وتجاوب النفوس',
      en: 'Steadfastness Between the Indications of the Sacred Texts and the Response of the Human Soul',
    },
    subtitle: {
      ar: 'كلمة في اللقاء الشهري بمسجد الأكاديمية الأمريكية للأئمة (AIA) — تكساس',
      en: 'A Reflection from the Monthly Gathering at the American Imams Academy Masjid (AIA) — Texas',
    },
    excerpt: {
      ar: 'ما بعد رمضان ليس فراغًا، بل امتدادًا. تتضافر النصوص الشرعية على أهمية الاستمرارية، وتتفاوت النفوس في التجاوب معها. هذه الحلقة الرابعة من سلسلة ـحِكَمٌ وبصائرـ تفكّك تضافر النصوص على الاستمرارية، وترسم عشرة أنماط سلوكية للناس بعد مواسم الطاعة، وتقدّم ثماني خطوات عملية لتحويل الفتور إلى استمرارية.',
      en: 'What comes after Ramadan is not emptiness, but extension. The sacred texts converge on the meaning of continuity, while souls differ in how they respond. This fourth episode of the Wisdoms & Insights series unpacks the convergence of the texts on continuity, maps ten behavioral patterns of people after seasons of worship, and offers eight practical steps for turning post-season listlessness into sustained steadfastness.',
    },
  },
  {
    slug: 'best-nation-best-religion',
    category: 'wisdom-insights',
    isoDate: '2026-05-17',
    date: { ar: '١٧ مايو ٢٠٢٦', en: 'May 17, 2026' },
    readingMinutes: 14,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 3,
    title: {
      ar: 'خَيرُ أُمَّةٍ لخَيرِ دِين',
      en: 'The Best Nation for the Best Religion',
    },
    subtitle: {
      ar: 'قراءةٌ في الميزان القرآنيِّ لـ«خَيريَّة» الأُمَّة، ومَوقعنا منها اليومَ',
      en: 'A Reading in the Qur\'anic Scale of the "Bestness" of the Ummah, and Where We Stand Today',
    },
    excerpt: {
      ar: 'يَتلو المسلمون قولَه تعالى: ﴿كُنْتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ﴾ كأنَّها وَسامُ انتماءٍ مَجَّاني. لكنَّ الآيةَ شَرطٌ لا وَصفٌ مَجَّاني، وفيها ثلاثُ مَشروطات. هذه الحلقة الثالثة من «حكم وبصائر» تَفكِّك معنى «الخَيريَّة» في الميزان الإسلاميِّ، وتَكشف عن مَوقع المسلمين في الغرب من هذا الميزان، وتُشخِّص ثلاثَ آفاتٍ تَفصم الأمَّةَ عن خَيريَّتها، وتَرسم أَربعَ طُرقٍ عمليَّةٍ للعودة إلى مَعنى «أُخرجَتْ للنَّاس» في زَماننا.',
      en: 'Muslims recite the verse "You were the best nation produced for mankind" as if it were a gratuitous certificate of belonging. But the verse states a condition, not a free description — it lists three requirements. This third episode of "Wisdoms & Insights" unpacks the meaning of "bestness" in the Islamic scale, reveals where Muslims of the West stand in relation to this measure, diagnoses three afflictions that tear the community from its bestness, and charts four practical paths to recovering the meaning of "produced for mankind" in our time.',
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
    date: { ar: '١٧ مايو ٢٠٢٦', en: 'May 17, 2026' },
    readingMinutes: 15,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 2,
    title: {
      ar: 'عبوديَّتنا بين المقام والمقال',
      en: 'Our Servitude — Between Deed and Word',
    },
    subtitle: {
      ar: 'قراءةٌ تأمُّليَّةٌ في الفجوة بين ما نَقول وما نَكون',
      en: 'A Reflective Reading on the Gap Between What We Say and What We Are',
    },
    excerpt: {
      ar: 'كان البلاغيُّون يَزِنون الفصاحة بـ«لكلِّ مقامٍ مقال»؛ لكنَّ في الدِّين معضلةً أَعمق: أن يَجد لكلِّ مقالٍ يَنطق به مقامًا يُصدِّقه في صدره وحياته. هذه الحلقة الثانية من سلسلة «حكم وبصائر» تَستخرج من الميزان القرآنيِّ ﴿لِمَ تَقُولُونَ مَا لَا تَفْعَلُونَ﴾ ثلاثَ درجاتٍ للعبوديَّة، وثلاثَ نماذجَ من واقع جالياتنا في الغرب، وثلاثَ آفاتٍ تَفصم المقامَ عن المقال، وخَريطةً عمليَّةً من خَمس خُطُواتٍ لردم الفجوة بين ما نَقول وما نَكون.',
      en: 'The classical rhetoricians measured eloquence by "For every situation, a fitting speech." But in religion there is a deeper question: that the believer find for every word he utters a station within him that confirms it. This second episode of the "Wisdoms & Insights" series extracts from the decisive Qur\'anic scale ("Why do you say what you do not do?") three degrees of servitude, three examples from our communities in the West, three afflictions that tear station from speech, and a practical five-step map for bridging the gap between what we say and what we are.',
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
    date: { ar: '١٧ مايو ٢٠٢٦', en: 'May 17, 2026' },
    readingMinutes: 14,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 1,
    title: {
      ar: 'الحِكمةُ ضالَّةُ المؤمنِ',
      en: 'Wisdom is the Lost Property of the Believer',
    },
    subtitle: {
      ar: 'قراءةٌ تأصيليَّةٌ في معنًى مأثور، وفي معضلةٍ حضاريَّةٍ معاصرة',
      en: 'A Foundational Reading of a Cherished Maxim and a Contemporary Civilizational Dilemma',
    },
    excerpt: {
      ar: 'اشتُهر على الألسنة قولٌ مأثورٌ: «الحكمةُ ضالَّةُ المؤمن، أنَّى وَجَدها فهو أحقُّ بها». تُحرِّر هذه القراءةُ التأصيليَّةُ مَنزلةَ هذا المعنى علميًّا، وتَفتح بمقتضاه معادلةً حضاريَّةً عميقة يَعيشها المسلمُ المعاصر، وبخاصَّةٍ في الغرب: كيف يَنفتح على ميراث الإنسانيَّة دون أن يَذوب فيه؟ وكيف يأخذ من غيره دون أن يَفقد ذاتَه؟ مع تَخريجٍ دقيقٍ لكلِّ حديثٍ وأثرٍ، وثلاثة نماذجَ من واقعنا في أمريكا، وخاتمةٌ حضاريَّةٌ تَكشف أنَّ أزمةَ العالم اليومَ ليست أزمةَ معلومات، بل أزمةُ حكمة.',
      en: 'A cherished maxim circulates: "Wisdom is the lost property of the believer; wherever he finds it, he is most worthy of it." This foundational reading clarifies the scholarly status of this meaning and opens, on its basis, a deep civilizational equation that the contemporary Muslim — especially in the West — must navigate: How do we open to humanity\'s heritage without dissolving into it? How do we receive from others without losing ourselves? With careful authentication of every prophetic tradition and saying cited, three vivid examples from our American reality, and a civilizational conclusion: the crisis of today\'s world is not a crisis of information, but a crisis of wisdom.',
    },
    coverImage: '/articles/wisdom-lost-property/tmc-flyer.png',
    coverCaption: {
      ar: 'هذا المقال خُلاصةُ محاضرة المساء التي أُلقيتْ في مسجد TMC بمدينة تامبا، ولاية فلوريدا (الولايات المتَّحدة الأمريكيَّة)، يوم الجمعة 10 أكتوبر 2025م، ضمن زيارة د. أحمد أبو سيف لرعاية أبناء الجالية المسلمة.',
      en: 'This article is a written distillation of the evening lecture delivered at TMC Masjid in Tampa, Florida (USA) on Friday, October 10, 2025, during Dr. Ahmed Abouseif\'s visit to support the Muslim community.',
    },
  },
  {
    slug: 'philosophy-of-displacement',
    category: 'civilization',
    isoDate: '2026-05-23',
    date: { ar: '٢٣ مايو ٢٠٢٦', en: 'May 23, 2026' },
    readingMinutes: 16,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
    },
    episode: 6,
    title: {
      ar: 'فلسفة التهجير في القرآن الكريم',
      en: "The Philosophy of Displacement in the Noble Qur'an",
    },
    subtitle: {
      ar: 'الحلقة السادسة — قِراءَةٌ بِنيَويَّةٌ في خَمسَةِ نَماذِجَ قُرآنيَّةٍ تَكشِفُ ثَوابتَ السُّلطَةِ المُتَجَبِّرَةِ وَفِقهَ النَّجاةِ مِنها',
      en: 'Episode Six — A Structural Reading of Five Qur\'anic Models Revealing the Constants of Tyrannical Power and the Jurisprudence of Deliverance',
    },
    excerpt: {
      ar: 'مِن أَهَمِّ اللَّقَطاتِ الحَضاريَّةِ الَّتي يَستَوقِفُنا فيها القُرآنُ الكَريم، لَقطَةُ التَّهجيرِ القَسريِّ لِلمُصلِحين. هذه الحَلَقَة السَّادِسَة مِن سِلسلَة «القُرآن والحَضارَة» تَستَخرِج مِن خَمسَةِ نَماذِجَ قُرآنيَّة (شُعَيب، لُوط، مُحَمَّد ﷺ، فِرعَون، الإسراء) سَبعَ قَوانينَ ثابِتَة في فَلسَفَة الإِخراج، وَتُشَخِّص البُنيَة النَّفسيَّة لِلسُّلطَة المُتَجَبِّرَة، وَمُؤَشِّرات انفِلاتِ قَبضَتِها، وَثَلاثَ قَوانينَ لِلنَّجاة. تَأصيلٌ يَنقُل المُسلِم في الغُربَة مِن مَوقِع التَّفاعُل العاطِفي إلى مَوقِع التَّأَمُّل الفِقهي.',
      en: 'Among the most significant civilizational scenes at which the Qur\'an pauses us is the scene of the forced displacement of reformers. This sixth episode of the "Qur\'an and Civilization" series extracts from five Qur\'anic models (Shu\'ayb, Lot, Muhammad ﷺ, Pharaoh, al-Isrāʾ) seven fixed laws in the philosophy of expulsion, diagnoses the psychological architecture of tyrannical power, the signs of its grip slipping, and three laws of deliverance. A foundational reading that moves the Muslim in exile from the position of emotional reaction to the position of jurisprudential reflection.',
    },
  },
  {
    slug: 'isra-and-the-civic-state',
    category: 'civilization',
    isoDate: '2026-05-20',
    date: { ar: '٢٠ مايو ٢٠٢٦', en: 'May 20, 2026' },
    readingMinutes: 16,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
    },
    episode: 5,
    title: {
      ar: 'الإِسراءُ قَبل المِعراج — السُّورَةُ الدُّستوريَّةُ وَنَموذَجُ الدَّولَةِ المَدَنيَّة',
      en: 'The Isrāʾ Before the Miʿrāj — The Constitutional Sūra and the Civic State Model',
    },
    subtitle: {
      ar: 'الحلقة الخامسة — حَركَةٌ أُفُقيَّةٌ، وَمَوادُّ تَأسيسيَّةٌ، وَتَحَدِّياتٌ مَفصَليَّة',
      en: 'Episode Five — A Horizontal Movement, Foundational Articles, and Pivotal Challenges',
    },
    excerpt: {
      ar: 'لِماذا سَمَّى القُرآنُ السُّورَةَ بِاسم الحَركَة الأُفُقيَّة (الإِسراء) دون الحَركَة العَموديَّة (المِعراج)؟ لِأَنَّ الحَقَّ يُسَمِّي بِما يَستَطيعُ النَّاسُ أَن يَفعَلوه. الحَلَقَة الخامِسَة مِن سِلسلة «القُرآن والحَضارَة» تَستَخرِج مِن سورَة الإِسراء — وَهي في وَسَط المُصحَف — مَوادَّ دُستوريَّة لِلدَّولَة المَدَنيَّة، وَثَلاثَة نَماذِجَ لِلحَركَة الحَضاريَّة (البُراق، السَّفينَة، العَصا)، وَتُشَخِّص ضَغطَي المُداهَنَة وَالإِخراج، وَتَكشِف مَنطِق التَّعجيز عِندَ المُجتَمَع المُهَيمِن.',
      en: "Why did the Qur'an name the sūra after the horizontal movement (Isrāʾ) rather than the vertical movement (Miʿrāj)? Because the Truth names with what humans can imitate. Episode Five of the 'Qur'an and Civilization' series extracts from Sūrat al-Isrāʾ — at the center of the muṣḥaf — the constitutional articles of the civic state, three models of civilizational movement (the Burāq, the Ark, the Staff), and diagnoses the pressures of compromise and expulsion, exposing the logic of impossible-demands in dominant societies.",
    },
  },
  {
    slug: 'sunan-of-civilization',
    category: 'civilization',
    isoDate: '2026-05-19',
    date: { ar: '١٩ مايو ٢٠٢٦', en: 'May 19, 2026' },
    readingMinutes: 14,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
    },
    episode: 4,
    title: {
      ar: 'سُنَنُ الحَضارَة في القُرآن — سِتَّةُ قَوانينَ تَحكُم صُعودَ الأُمَم وَسُقوطَها',
      en: "The Sunan of Civilization in the Qur'an — Six Laws That Govern the Rise and Fall of Nations",
    },
    subtitle: {
      ar: 'الحلقة الرابعة — وَقفَةٌ جامِعَةٌ بَعد الكَهف ويوسُف وسُليمان',
      en: "Episode Four — A Synthesizing Pause after al-Kahf, Yūsuf, and Sulaymān",
    },
    excerpt: {
      ar: 'بَعد ثَلاث حَلَقات في الكَهف ويوسُف وسُليمان، تَأَتي هذه الحَلَقَة لِتَستَخلِص سِتَّ سُنَنٍ إلهيَّة تَحكُم صُعود الأُمَم وَسُقوطَها: الاستِخلاف، التَّغيير الذَّاتي، الابتِلاء، المُداوَلَة، التَّدافُع، إصلاح الأَرض. كُلُّ سُنَّةٍ مَأخوذَةٌ مِن آيَةٍ مُحكَمَة، وَمُؤَيَّدَةٌ بِما رَأَيناه في السُّوَر الثَّلاث. وَقفَةٌ جامِعَةٌ لا خاتِمَة، تُمَهِّد لِما بَعدها مِن سُوَر.',
      en: "After three episodes on al-Kahf, Yūsuf, and Sulaymān, this episode extracts six divine sunan governing the rise and fall of nations: succession, self-change, trial, alternation, pressing-back, and reform of the earth. Each is drawn from a binding verse and corroborated by what we have seen in the three sūras. A synthesizing pause, not a closing — preparing the ground for further sūras to come.",
    },
  },
  {
    slug: 'hudhud-and-sayl',
    category: 'civilization',
    isoDate: '2026-05-18',
    date: { ar: '١٨ مايو ٢٠٢٦', en: 'May 18, 2026' },
    readingMinutes: 15,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
    },
    episode: 3,
    title: {
      ar: 'جَناحُ الهُدهُد وَسَيلُ العَرِم — سُنَّةُ الصُّعود والسُّقوط في القُرآن',
      en: "The Hoopoe's Wing and the Flood of al-ʿArim — The Law of Rise and Fall in the Qur'an",
    },
    subtitle: {
      ar: 'الحلقة الثالثة — جدلية سورتي النَّمل وسَبَأ بين تَمَدُّد الحَضارة وانكفائها',
      en: "Episode Three — A Dialectical Reading of Sūrat al-Naml and Sūrat Sabaʾ between Expansion and Withdrawal",
    },
    excerpt: {
      ar: 'في الأَرض ذاتِها مِن جَزيرَة العَرَب نَهَضَت حَضارَتان: حَضارَة سُليمان تَتَمَدَّد وَتَستَكشِف، وَحَضارَة سَبَأ تَنكَفِئ ثُمَّ تَتَفَرَّق. الحَلقَة الثَّالِثَة مِن سِلسلة «القُرآن والحَضارَة» تَستَخرِج مِن سورَتَي النَّمل وسَبَأ ثَلاثَة أَركان تَنظيميَّة (تَوزيع الأَدوار، الاستِكشاف، نَقل التِّقنيَة)، وَتَطرَح جَدَليَّة المَسجِد السُّليماني مُقابِل المَسجِد السَّبَئي في الغَرب اليَوم.',
      en: "In the same Arabian land, two civilizations arose: Sulaymān's expanding and exploring, and Sabaʾ's withdrawing and scattering. Episode Three of the 'Qur'an and Civilization' series extracts from Sūrat al-Naml and Sūrat Sabaʾ three organizational pillars (distribution of roles, exploration, technology transfer), and presents the dialectic of the Sulaymanic vs. the Sabaʾi mosque in the West today.",
    },
  },
  {
    slug: 'yusuf-diaspora-civilization',
    category: 'civilization',
    isoDate: '2026-05-17',
    date: { ar: '١٧ مايو ٢٠٢٦', en: 'May 17, 2026' },
    readingMinutes: 13,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
    },
    episode: 2,
    title: {
      ar: 'سورة يوسُف ومَنحَنى الصُّعود الحَضاري',
      en: 'Sūrat Yūsuf and the Curve of Civilizational Ascent',
    },
    subtitle: {
      ar: 'الحلقة الثانية — من قاع البئر إلى عَرش الإمبراطورية، ومن الفَرد إلى الأُمَّة',
      en: "Episode Two — From the Pit's Floor to an Imperial Throne, From the Individual to the Ummah",
    },
    excerpt: {
      ar: 'الكَواكِب الإِحدى عَشرَة سَجَدَت لِيوسُف في رُؤياه قَبل أَن تَنحَني له إخوَتُه في مَجلِسه. مَنحَنى الصُّعود يُولَد في البَصيرَة قَبل أَن يَتَجَلَّى في الحَدَث. الحَلَقَة الثَّانيَة مِن سِلسلة «القُرآن والحَضارَة» تَستَخرِج مِن سورَة يوسُف أَربَعَة أَركان لِلصُّعود (العَفاف، العِلم، الاستِنباط، الهِمَّة)، تُشَخِّص ثَلاث أَزَمات لِلجاليَة المُسلِمَة في الغَرب، وَتَطرَح نَموذَج «الزَّرع في أَرض المَهجَر» الَّذي بَين يوسُف وموسى أَربَعَةُ قُرون.',
      en: "The eleven stars bowed to Yūsuf in his dream long before his brothers bowed before his throne. The curve of ascent is born in vision before it manifests in event. Episode Two of the 'Qur'an and Civilization' series extracts from Sūrat Yūsuf four pillars of ascent (chastity, knowledge, foresight, ambition), diagnoses three crises of the Muslim community in the West, and proposes the model of 'sowing in the land of diaspora' — the four centuries that lay between Yūsuf and Mūsā.",
    },
  },
  {
    slug: 'fatwa-and-collective-voice',
    category: 'imamship',
    isoDate: '2026-05-16',
    date: { ar: '١٦ مايو ٢٠٢٦', en: 'May 16, 2026' },
    readingMinutes: 11,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
    },
    episode: 4,
    title: {
      ar: 'الإمام بين الفتوى الفردية وصوت الجماعة',
      en: 'The Imam Between Individual Fatwa and Collective Voice',
    },
    subtitle: {
      ar: 'الحلقة الرابعة والأخيرة — حين يَفقد الإفتاء بَوصلتَه في عَصر الخوارزميَّات',
      en: 'Episode Four (Final) — When Fatwa Loses Its Compass in the Age of Algorithms',
    },
    excerpt: {
      ar: 'مُسلمٌ واحد يَستفتي أربعة مَصادر — شيخ يوتيوب، إمام محلي، داعية إنستجرام، نموذج ذكاء اصطناعي — فيتلقَّى أربع فتاوى مُتناقضة. هذه أزمة الإفتاء في الغَرب. الحلقة الرابعة والأخيرة تَعرض شُروط الفَتوى الكلاسيكية، تُشَخِّص انهيار المرجعية، وتطرح مَنظومة «صوت الجماعة» بَديلًا، مع تَوظيف بَحث الشيخ لِدار الإفتاء ٢٠٢٥ عن الفَتوى والذكاء الاصطناعي.',
      en: "A single Muslim consults four sources — a YouTube shaykh, a local imam, an Instagram preacher, and an AI model — and receives four contradictory fatwas. This is the crisis of issuing religious rulings in the West. The fourth and final episode of the series presents the classical conditions of fatwa, diagnoses the collapse of religious authority, and proposes a 'collective voice' alternative — drawing on Dr. Ahmed's 2025 paper for Dar al-Iftaa on fatwa in the age of artificial intelligence.",
    },
  },
  {
    slug: 'institutional-mind',
    category: 'imamship',
    isoDate: '2026-05-15',
    date: { ar: '١٥ مايو ٢٠٢٦', en: 'May 15, 2026' },
    readingMinutes: 9,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
    },
    episode: 3,
    title: {
      ar: 'لماذا تحتاج مساجد الغرب إلى عقل مؤسسي؟',
      en: 'Why Western Mosques Need an Institutional Mind',
    },
    subtitle: {
      ar: 'الحلقة الثالثة — خمس عللٍ وخمسة أركان لبناء المسجد الذي يُورِّث',
      en: 'Episode Three — Five Diseases and Five Pillars for the Mosque That Bequeaths',
    },
    excerpt: {
      ar: 'مَسجدٌ بِلا ذاكرةٍ مؤسَّسية هو شَجرة بلا جذور: مُكتمِلٌ ظاهرًا, هَشٌّ في أوَّل ريح. خمس عِلَل تَنهَش مساجد الغَرب, وخمسة أركان عِلاجية تُحَوِّلها من مَكاتب خِدمات إلى مُؤَسَّسات تُورِّث للأجيال. تَأصيلٌ من فقه الأَوقاف, ونُبوءة ابن خَلدون عن الأَجيال الثلاثة.',
      en: 'A mosque without institutional memory is a tree without roots: complete in appearance, fragile at the first gust. Five diseases plague Western mosques, and five remedial pillars transform them from service desks into institutions that bequeath. A foundation drawn from the fiqh of awqāf and Ibn Khaldūn\'s warning about the three generations.',
    },
  },
  {
    slug: 'crafting-the-modern-imam',
    category: 'imamship',
    isoDate: '2026-05-14',
    date: { ar: '١٤ مايو ٢٠٢٦', en: 'May 14, 2026' },
    readingMinutes: 9,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
    },
    episode: 2,
    title: {
      ar: 'صناعة الإمام المعاصر: العلم، والإدارة، والاحتواء النفسي',
      en: 'Crafting the Modern Imam: Knowledge, Management, and Pastoral Containment',
    },
    subtitle: {
      ar: 'الحلقة الثانية — من تأسيس العلم إلى احتواء الأزمات والذات',
      en: 'Episode Two — From Building Knowledge to Containing Crises and the Self',
    },
    excerpt: {
      ar: 'لا تُبنى إمامةُ الغرب على عِلمٍ شرعيٍّ خالص ولا على مهارةٍ خَطابية وَحدها. الإمامُ المعاصر يحتاج إلى ثلاثة أركان متلازمة: علمٍ أزهري مُتَّصلٍ بفقه الأقليات، وإدارةٍ مؤسَّسية بأدواتها العملية، واحتواءٍ نفسي للناس وللذات. هذه الحلقة الثانية تقدِّم نموذج التَّأهيل.',
      en: "Imamship in the West cannot be built on Sharia knowledge alone, nor on rhetorical skill. The contemporary imam needs three interlocking pillars: Azhari knowledge anchored in the fiqh of minorities, institutional management with operational tools, and pastoral containment for others and the self. Episode Two of the series presents the formation model.",
    },
  },
  {
    slug: 'imam-in-the-west',
    category: 'imamship',
    isoDate: '2026-05-13',
    date: { ar: '١٣ مايو ٢٠٢٦', en: 'May 13, 2026' },
    readingMinutes: 9,
    series: {
      ar: 'الإمام في الغرب — مدرسة في صناعة القائد',
      en: 'The Imam in the West — A School in Crafting the Leader',
    },
    episode: 1,
    title: {
      ar: 'الإمام في الغرب: من إمامة الصلاة إلى إمامة المجتمع',
      en: 'The Imam in the West: From Leading the Prayer to Leading the Ummah',
    },
    subtitle: {
      ar: 'الحلقة الأولى — التأصيل الفقهي، الواقع العملي، وثَمن القيادة',
      en: 'Episode One — Jurisprudential Foundation, Operational Reality, and the Cost of Leadership',
    },
    excerpt: {
      ar: 'يومُ الإمام في الغرب يبدأ قبل أن تطلع الشمس بسبع دوائر متشابكة: شعائرية، فُتيائية، أُسرية، تربوية، مؤسَّسية، مُجتمعية، نَفسية. كيف انفصلت إمامة الصلاة عن إمامة المجتمع، ولماذا يفرض الواقع الأمريكي إعادة جمعهما؟',
      en: "The Imam's day in the West begins before sunrise across seven interlocking circles: ritual, fatwa, family, education, institutional, civic, and psycho-spiritual. How did prayer leadership separate from community leadership — and why does American reality demand their reunification?",
    },
  },
  {
    slug: 'quran-civilization',
    category: 'civilization',
    isoDate: '2026-05-12',
    date: { ar: '١٢ مايو ٢٠٢٦', en: 'May 12, 2026' },
    readingMinutes: 8,
    series: {
      ar: 'القرآن والحضارة',
      en: 'The Qur\'an and Civilization',
    },
    episode: 1,
    title: {
      ar: 'القرآن والتأصيل الحضاري',
      en: 'The Qur\'an and the Foundations of Civilization',
    },
    subtitle: {
      ar: 'الحلقة الأولى — حين يصنع الوحي الإنسان… تُولد الحضارة',
      en: 'Episode One — When Revelation Shapes the Human, Civilization is Born',
    },
    excerpt: {
      ar: 'سورة الكهف ليست مجرد سورة تُتلى يوم الجمعة طلبًا للبركة، بل هي بناء متكامل لأركان الحضارة الإنسانية: المورد البشري، المال الرشيد، العلم المتجدد، والقيادة العادلة. قراءة جديدة في معجم الكهف وأنبياء الحضارة.',
      en: 'Sūrat al-Kahf is not merely a chapter recited on Fridays in pursuit of blessing — it is a complete blueprint for the pillars of human civilization: the righteous human, rightly stewarded wealth, continuous knowledge, and just leadership. A fresh reading in the Kahf lexicon and the Qur\'anic prophets of civilization.',
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
  },
  en: {
    imamship: 'Imamship & Leadership',
    civilization: "Qur'an & Civilization",
    family: 'Family & Parenting',
    fiqh: 'Jurisprudence',
    'wisdom-insights': 'Wisdoms & Insights',
  },
};
