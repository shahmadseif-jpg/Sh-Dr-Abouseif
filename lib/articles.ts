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
    slug: 'kaaba-or-qibla',
    category: 'wisdom-insights',
    isoDate: '2026-05-31',
    date: { ar: '٣١ مايو ٢٠٢٦', en: 'May 31, 2026' },
    readingMinutes: 13,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 11,
    title: {
      ar: 'كعبةٌ أم قِبلة؟',
      en: 'A Kaaba or a Qiblah?',
    },
    subtitle: {
      ar: 'عند البيت... أم في البيت؟ — لماذا تَجمَعُ القِبلةُ كلَّ الوُجوه، ولا يَنكشِفُ سِرُّ الكعبةِ إلا لقلبٍ حاضر',
      en: 'At the House... or Within It? — Why the Qiblah Gathers Every Face, While the Secret of the Kaaba Unveils Only to a Present Heart',
    },
    excerpt: {
      ar: 'مَلايينُ يَصِلونَ إلى الكعبة، فكم منهم تَصِلُ الكعبةُ إلى قلبِه؟ هذه الحلقةُ الحاديةَ عشرةَ من «حِكَمٌ وبصائر» تُفرِّقُ بين أن تكونَ عند البيتِ وأن يكونَ البيتُ فيك: فالقِبلةُ يَتوجَّهُ إليها الجميعُ وتَبقى في القلبِ حتّى الموت، أمّا سِرُّ الكعبةِ فلا يَنكشِفُ إلا لقلبٍ حاضرٍ مُعَظِّم. ومن المنافقينَ ﴿قَامُوا كُسَالَىٰ﴾ إلى أثرِ عمرَ عند الحجرِ «إنّك حجرٌ لا تَضُرُّ ولا تَنفَع»، تَستقرُّ على ميزانٍ واحد: ﴿وَلَٰكِن يَنَالُهُ التَّقْوَىٰ مِنكُمْ﴾. فليس كلُّ مَن وَصَلَ قد وَصَل؛ وإنّما يَصِلُ مَن عادَت به الكعبةُ إلى الله.',
      en: "Millions reach the Kaaba — but how many does the Kaaba reach in the heart? This eleventh episode of 'Wisdoms & Insights' distinguishes being at the House from the House being within you: the qiblah is turned toward by all and dwells in the heart until death, while the secret of the Kaaba unveils only to a present, reverent heart. From the hypocrites who 'stand lazily' to ʿUmar at the Black Stone — 'you are but a stone that neither harms nor benefits' — it rests on a single scale: 'but what reaches Him is the piety from you.' Not everyone who arrived has truly arrived; truly arrived is he whom the Kaaba returned to God.",
    },
  },
  {
    slug: 'hearts-before-the-rows',
    category: 'wisdom-insights',
    isoDate: '2026-05-31',
    date: { ar: '٣١ مايو ٢٠٢٦', en: 'May 31, 2026' },
    readingMinutes: 13,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 10,
    title: {
      ar: 'تَسويةُ القُلوبِ قبلَ الصُّفوف',
      en: 'Straightening the Hearts Before the Rows',
    },
    subtitle: {
      ar: 'حين تَتلاصَقُ الأقدامُ وتَتباعَدُ القلوب — قانونُ الفُرجةِ التي يَدخُلُ منها الشَّيطان، في الصفِّ وفي النَّفس',
      en: 'When Feet Touch and Hearts Drift Apart — The Law of the Gap the Devil Enters, in the Row and in the Soul',
    },
    excerpt: {
      ar: 'نُسَوّي صُفوفَنا بالأصابع، فهل نُسَوّي قُلوبَنا؟ هذه الحلقةُ العاشرةُ من «حِكَمٌ وبصائر» تَنطلِقُ من قولِه ﷺ «ولا تَختلِفوا فتَختلِفَ قلوبُكم» لتَكشِفَ أنّ الصفَّ المستقيمَ تدريبٌ على تقاربِ النفوس، ثُمّ تَستخرِجُ «قانونَ الخَلَل»: فُرجةٌ صغيرةٌ تُهمَل، فيَنفُذُ منها الشيطان، فتَتّسِع — وعلاجُها الأمرُ النبويُّ نفسُه: «سُدُّوا الخَلَل» قبل أن يَتّسِع. وتَرتقي بالفكرةِ من التربيةِ الفرديّةِ إلى هَمِّ الإصلاح: أمّةٌ لا تَجتمِعُ في مسجدٍ كيف تَحمِلُ رسالة؟',
      en: "We align our rows by finger-widths — but do we align our hearts? This tenth episode of 'Wisdoms & Insights' begins from the Prophet's words 'do not differ, lest your hearts differ' to reveal that the straight row is a training in the nearness of souls, then extracts 'the law of the breach': a small gap left neglected, through which the devil slips and which then widens — its cure the very Prophetic command, 'close the breach' before it widens. It raises the idea from individual cultivation to the reformist concern: a nation that cannot unite in one mosque, how will it carry a message?",
    },
  },
  {
    slug: 'the-appetite-for-obedience',
    category: 'wisdom-insights',
    isoDate: '2026-05-31',
    date: { ar: '٣١ مايو ٢٠٢٦', en: 'May 31, 2026' },
    readingMinutes: 13,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 9,
    title: {
      ar: 'شَهوةُ الطَّاعة',
      en: 'The Appetite for Obedience',
    },
    subtitle: {
      ar: 'حين تَندفِعُ النَّفسُ إلى العبادةِ كما تَندفِعُ إلى الشَّهوة — كيف رَبَّى النبيُّ ﷺ القلبَ بين الإيقاظِ والتَّهذيب؟',
      en: 'When the Soul Rushes to Worship as It Rushes to Desire — How the Prophet ﷺ Trained the Heart Between Kindling and Tempering',
    },
    excerpt: {
      ar: 'كما أنّ للمَعصيةِ شَهوة، فقد تكونُ للطَّاعةِ شَهوةٌ أيضاً: اندفاعٌ صادقٌ يَشتعِلُ ثُمّ يَخبو. هذه الحلقةُ التاسعةُ من «حِكَمٌ وبصائر» تَستخرِجُ من قصّةِ النَّفرِ الثَّلاثةِ، وثناءِ النبيِّ ﷺ على عبدِ اللهِ بنِ عمر، وحَلِّه لحبلِ زينبَ، قاعدةً جامعةً: أنّ النبيَّ ﷺ لا يُعالِجُ العبادةَ بل يُعالِجُ صاحبَها؛ يُوقِظُ الفاتِرَ ويُهذِّبُ المُندفِعَ ليَرُدَّ كليهما إلى التَّوازُنِ الذي مِحورُه الدَّوامُ لا الكَثرة. شَهوةٌ تُوقِظ، فمَحبّةٌ تُرَبّي، فعَهدٌ يُثبِّت.',
      en: "Just as disobedience has its appetite, obedience too may have one: a sincere surge that blazes and then fades. This ninth episode of 'Wisdoms & Insights' draws from the story of the three men, the Prophet's praise of ʿAbdullāh ibn ʿUmar, and his untying of Zaynab's rope a unifying principle — that the Prophet ﷺ treats not the worship but the worshipper, kindling the languid and tempering the impulsive to return both to the balance whose axis is constancy, not quantity. An appetite that awakens, a love that nurtures, a covenant that steadies.",
    },
  },
  {
    slug: 'purification-before-the-meeting',
    category: 'wisdom-insights',
    isoDate: '2026-05-30',
    date: { ar: '٣٠ مايو ٢٠٢٦', en: 'May 30, 2026' },
    readingMinutes: 10,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 8,
    title: {
      ar: 'ثُمَّ لْيَقْضُوا تَفَثَهُمْ',
      en: 'Then Let Them Complete Their Cleansing',
    },
    subtitle: {
      ar: 'لِماذا يَسبِقُ التَّفَثُ الطَّوافَ؟ — طَهارةٌ قبلَ القُرب، في الحجِّ وفي الطَّريقِ إلى الله',
      en: 'Why Does the Cleansing Come Before the Circumambulation? — Purification Before Nearness, in the Hajj and on the Road to God',
    },
    excerpt: {
      ar: 'آيةٌ من كلمتين في سورة الحجِّ تَفتحُ رؤيةً كاملةً لمسيرةِ الإنسانِ إلى الله. هذه الحلقةُ الثامنةُ من «حِكَمٌ وبصائر» تَقرأُ ﴿ثُمَّ لْيَقْضُوا تَفَثَهُمْ﴾ في موضعِها من تكاليفِ السُّورة (تَطهيرٌ، فوَفاءٌ، فقُرب)، وتُبيِّنُ لماذا سُمِّيت السُّورةُ بالحجِّ وهي سورةُ رِحلةٍ لا سورةُ مَناسك، ثُمّ تَكشِفُ أنّ أخطرَ التَّفَثِ ما لا يَراه أحد: غُبارُ الحَسَدِ والكِبرِ والقَسوةِ على الرُّوح. خاتمتُها سُؤالٌ يَبقى: ليس المُهمُّ هل وَصَلتَ إلى البَيت، بل بأيِّ قلبٍ تَلقى ربَّ البَيت.',
      en: "A two-word verse in Sūrat al-Ḥajj opens a complete vision of the human journey to God. This eighth episode of 'Wisdoms & Insights' reads ﴾Then let them complete their cleansing﴿ in its place among the sūra's obligations (purification, then fulfillment, then nearness), shows why the sūra is named after the Hajj though it is a sūra of a journey rather than of rites, then reveals that the most dangerous tafath is the one no one sees: the dust of envy, arrogance, and hardness upon the soul. It closes with a question that lingers — what matters is not whether you reached the House, but with what heart you meet the Lord of the House.",
    },
  },
  {
    slug: 'days-of-allah',
    category: 'wisdom-insights',
    isoDate: '2026-05-24',
    date: { ar: '٢٤ مايو ٢٠٢٦', en: 'May 24, 2026' },
    readingMinutes: 15,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 7,
    title: {
      ar: 'وذَكِّرهم بأيّامِ الله',
      en: 'Remind Them of the Days of Allah',
    },
    subtitle: {
      ar: 'ستّةُ دروسٍ من جائحةِ كورونا — قراءةٌ في سُنَن الله حين تَدور الرَّحى على البشريّة',
      en: "Six Lessons from the Pandemic — A Reading of God's Sunan When the Mill Turns Upon Humanity",
    },
    excerpt: {
      ar: 'ما «أيّامُ الله»؟ ليست الأيّامَ الزمنيّةَ السائرةَ في عَدِّ الفَلَك، بل هي الأيّامُ التي تَنكشفُ فيها يَدُ الله على البشريّة. هذه الحلقةُ السابعةُ من «حِكَمٌ وبصائر» تَستخرجُ من جائحةِ كورونا ستّةَ دروسٍ كَونيّةٍ ونفسيّة: غَلَبَةُ الله على أمره، جنودُه التي لا يَعلمها إلا هو، المراحلُ النفسيّةُ الخمس في الأزمات، حالتا العزلةِ والاجتماعِ في البيوت، قانونُ الاتّحاد في الأزمات والانقسامِ في الرَّخاء، والأَمنُ الذي صَنَعَه الإغلاق. خاتمتُها العَودةُ إلى هَدْي النبيّ ﷺ في الصِّحَّة والوقاية، وأنّ الجائحةَ ما كانت إلا تَذكيراً.',
      en: "What are 'the Days of Allah'? They are not the calendrical days that orbit with the celestial bodies, but the days in which the hand of God is unveiled upon humanity. This seventh episode of 'Wisdoms & Insights' extracts from the COVID-19 pandemic six cosmic and psychological lessons: God's predominance over His affair, the armies none knows but He, the five psychological stages of crisis, the two states of solitude and gathering at home, the law of uniting in crisis and dividing in prosperity, and the security the lockdown created. It concludes with a return to the Prophet's guidance on hygiene and prevention, and that the pandemic was nothing but a reminder.",
    },
  },
  {
    slug: 'satan-and-man-goal-and-means',
    category: 'wisdom-insights',
    isoDate: '2018-10-12',
    date: { ar: '١٢ أكتوبر ٢٠١٨', en: 'October 12, 2018' },
    readingMinutes: 15,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 6,
    title: {
      ar: 'الشيطان والإنسان: غاية ووسيلة',
      en: 'Satan and Man: Goal and Means',
    },
    subtitle: {
      ar: 'خطبة جمعة في مداخل الشيطان: الطمع، البخل، المقارنات، صحبة السوء',
      en: "A Friday sermon on Satan's entry points: greed, miserliness, comparisons, and bad company",
    },
    excerpt: {
      ar: 'تأمُّلٌ في غاية الشيطان من ابن آدم — ﴿لأغوينَّهم﴾ — والمداخل التي يتسلَّل منها إلى النَّفس: الطمعُ المختلفُ توزيعُه بين الناس، والبخلُ في المال والفكرة والمشاعر، والمقارناتُ التي تتَّخذ مقياسَ الهوى فتُهلِك. خلاصةُ خطبة جمعة في «مركز مِيسكويت الإسلامي» (Mesquite Islamic Center) بولاية تكساس، أُلقيت في 12 أكتوبر 2018م، مع وصايا تطبيقية لحفظ المؤمن من مداخل الشيطان وصحبة السوء.',
      en: "A reflection on Satan's goal with the children of Adam — ﴿I will surely lead them astray﴾ — and the entry points by which he infiltrates the soul: greed (whose distribution varies between people), miserliness (with wealth, ideas, and feelings), and comparisons that take desire as their measure and so destroy. A distillation of a Friday sermon at the Mesquite Islamic Center (M.I.C.), Texas, delivered on October 12, 2018, with practical counsels to safeguard the believer from Satan's entry points and from bad company.",
    },
  },
  {
    slug: 'nourishing-fatherhood',
    category: 'family',
    isoDate: '2026-05-20',
    date: { ar: '٢٠ مايو ٢٠٢٦', en: 'May 20, 2026' },
    readingMinutes: 14,
    series: {
      ar: 'الأسرة والتربية',
      en: 'Family & Parenting',
    },
    episode: 1,
    title: {
      ar: 'غَزَلُ الأبِ لابنتِه',
      en: "A Father's Tender Affection for His Daughter",
    },
    subtitle: {
      ar: 'حِصْنٌ من الحُبِّ يَقي قلبَها من سهامِ المتربِّصين — بين هَدْي النبوّة، وشهادةِ علم النفس، وفِقْه الحدود',
      en: 'A Shield of Love That Guards Her Heart Against the Predators — Between Prophetic Guidance, Psychological Insight, and the Boundaries of the Sacred Law',
    },
    excerpt: {
      ar: 'بنتُ المُسلِم في زمنِ المتربِّصين: كيف يَحْمِيها أبوها بالكلمةِ الحانيةِ قبل أن يَسبِقَه إليها مَن يَكِيدُ بقلبِها الغَضّ؟ هذه الحلقة الأولى من سلسلة «الأسرة والتربية» تُؤَصِّل لِما نُسَمِّيه ـ مع التحفُّظ على اللَّفظ ـ «غَزَلَ الأبِ المُباح»: تَبدأ بِتَحريرِ المُصطَلَح، ثُمَّ تَستَخرِج من هَدْي النبوّة مع فاطمةَ رضي الله عنها أَربَعَ تَعبيراتٍ مُتَتاليةٍ للحُبِّ المُعلَن، وتَستَشهِد بشهاداتِ علماء النَّفس المُسلِمين والمُعاصِرين، وتَرسُم سَبعةَ مَيادينَ تَطبيقيَّةٍ، ثُمَّ تَضَع سَبعةَ ضَوابطَ شَرعيَّةٍ تَحفَظ هذا الغَزَلَ المُباحَ في دائرةِ الأُبوَّةِ الراشدة.',
      en: "The Muslim daughter in an age of predators: how does her father shield her with tender words before someone with ill intent reaches her tender heart first? This first episode of the 'Family & Parenting' series roots what we are calling — with reservation about the term — 'a father's permissible tender affection': it begins by clarifying the term, then extracts from Prophetic guidance with Fātimah (may Allah be pleased with her) four consecutive expressions of openly declared love, draws on the testimonies of Muslim and contemporary psychologists, charts seven fields of practical application, and lays down seven Sharia guidelines that keep this permissible paternal affection within the dignity of mature fatherhood.",
    },
  },
  {
    slug: 'where-we-stand',
    category: 'wisdom-insights',
    isoDate: '2026-05-24',
    date: { ar: '٢٤ مايو ٢٠٢٦', en: 'May 24, 2026' },
    readingMinutes: 14,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 5,
    title: {
      ar: 'موقعنا من الإعراب',
      en: 'Where We Stand in the Sentence of History',
    },
    subtitle: {
      ar: 'قراءةٌ في موضع المؤمن حين تَدور رحى الحوادث',
      en: "A Reading of the Believer's Position When the Mill of Events Turns",
    },
    excerpt: {
      ar: 'كلُّ كلمةٍ في الجملة العربيَّة لها موقعٌ من الإعراب: فإذا اختلَّ الموقعُ انكسرَ المعنى. وكذلك المؤمنُ في الحوادث: له موقعٌ ينبغي أن يَعرفه. هذه الحلقةُ الخامسةُ من «حِكَمٌ وبصائر» تَقرأ سورةَ الرُّوم بوصفها مَدرسةً في «موقع البَصيرة» حين تَدور الرَّحى بين قُوًى ليس بينك وبينها إلَّا التاريخ، تُشَخِّص فِتنةَ الشَّماتةِ بمسلمٍ يَختلف عنك مذهبُه، تَرسم موقعَ المسلمِ في الغربِ بين السفارةِ والنَّقد، وتُؤَصِّل لخطابٍ يَتعامل مع الأنماط لا مع الأعيان.',
      en: "Every word in an Arabic sentence has a grammatical station: if the station fails, meaning collapses. So too with the believer in events — he has a station he ought to know. This fifth episode of 'Wisdoms & Insights' reads Sūrat al-Rūm as a school in the 'station of insight' when the mill turns between powers that share with us only history, diagnoses the trial of schadenfreude toward a Muslim of a different school, charts the position of the Muslim in the West between embassy and critique, and grounds a discourse that engages patterns, not personalities.",
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
    date: { ar: '٢٤ مايو ٢٠٢٦', en: 'May 24, 2026' },
    readingMinutes: 7,
    series: {
      ar: 'بشارات القرآن',
      en: "Glad Tidings of the Qur'an",
    },
    episode: 1,
    title: {
      ar: 'بِشاراتُ القرآن',
      en: "Glad Tidings of the Qur'an",
    },
    subtitle: {
      ar: 'صِناعةُ الأملِ بهندسةِ ترتيبِ السُّوَر',
      en: 'Engineering Hope through the Architecture of Sūra Order',
    },
    excerpt: {
      ar: 'ليس ترتيبُ سُورِ القرآنِ نَسَقاً موضوعيّاً فحسب، بل هو نَسَقٌ نفسيٌّ تربويٌّ بَديع: يَجعلُ البِشارةَ تَجيءُ بعدَ التَّخويف، والفجرَ بعدَ الغاشية، والضُّحى بعدَ السُّجى. هذه الحلقةُ الأولى من سلسلة «بشارات القرآن» تَستخرجُ من ثلاثِ مُجاوَراتٍ راسخة (الغاشية/الفجر، الليل/الضحى، الضحى/الشرح) نَمَطَ البِشارة المُتعاقبة مع الإنذار، ثم تَستأنِسُ بمثالَين من نَمَطَين مُجاوِرَين (هود/يوسف، الفيل/قريش)، وتَستخلصُ أربعَ سُنَنٍ غالبةٍ تَحكُمُ بِشاراتِ القرآن، مع لَفتةٍ منهجيّةٍ تَضبُطُ القراءة في تقاليد علم المناسبات.',
      en: "The order of the Qur'an's sūras is not merely a thematic sequence — it is a marvelous psychological and pedagogical one: glad tidings come after warning, dawn after Al-Ghāshiyah, morning brightness after the deepening night. This first episode of the series 'Glad Tidings of the Qur'an' draws from three solid pairings (Al-Ghāshiyah/Al-Fajr, Al-Layl/Al-Ḍuḥā, Al-Ḍuḥā/Al-Sharḥ) the pattern of glad tidings following warning, then supports the reading with two adjacent patterns (Hūd/Yūsuf, Al-Fīl/Quraysh), distills four prevailing patterns that govern the Qur'an's glad tidings, and concludes with a methodological note grounding the reading within the tradition of ʿilm al-munāsabāt.",
    },
  },
  {
    slug: 'island-of-quran',
    category: 'civilization',
    isoDate: '2026-02-06',
    date: { ar: '٦ فبراير ٢٠٢٦', en: 'February 6, 2026' },
    readingMinutes: 13,
    series: {
      ar: 'القرآن والحضارة',
      en: "The Qur'an and Civilization",
    },
    episode: 7,
    title: {
      ar: 'جَزيرَةُ القُرآن',
      en: "The Island of the Qur'an",
    },
    subtitle: {
      ar: 'حين يَنقَسِم العالَمُ إلى جَزيرَتَين: جَزيرَةُ الإذنِ والكَرامَة، وجَزيرَةُ الفَوضى والعَبَث',
      en: 'When the World Splits into Two Islands — One of Permission and Dignity, One of Chaos and Indulgence',
    },
    excerpt: {
      ar: 'في الكَوكَب جُزُرٌ كثيرة، لكنّها في الجَوهَر صِنفان: جزيرةٌ يَعبُر إليها الإنسانُ بإذنٍ من السماء فيَستردّ كَرامتَه، وجزيرةٌ يَتسلّل إليها خُفيةً ليُخفي عارَه. هذه الحلقة السابعة من «القرآن والحضارة» تَستخرج من باء «بسم الله» قانونَ الإذن في دُخول جزيرة الوَحي، تَقرأ افتتاحَ القرآن بـ«اقرأ» قبل «آمِنْ» قانونًا لحماية الإنسان من الفَشل، تُشَخِّص أنّ أزمة العالم ليست تقنيّةً بل أزمةُ فراغٍ أخلاقي، وتَطرح رمضان ثَورةً على الفَوضى الداخليّة وتدريبًا على السيادة الذاتيّة.',
      en: "On our planet there are countless islands — but in essence only two: an island crossed by permission from the heavens where the human recovers his dignity, and an island sneaked into to hide one's shame. This seventh episode of 'The Qur'an and Civilization' extracts from the bāʾ of 'In the name of God' the law of permission for entering the island of revelation, reads the Qur'an's opening with 'Read' before 'Believe' as a law of human protection from failure, diagnoses that the world's crisis is not technological but a crisis of moral emptiness, and presents Ramadan as a revolution against inner chaos and a training in self-sovereignty.",
    },
  },
  {
    slug: 'awakened-consciences',
    category: 'wisdom-insights',
    isoDate: '2026-05-23',
    date: { ar: '٢٣ مايو ٢٠٢٦', en: 'May 23, 2026' },
    readingMinutes: 12,
    series: {
      ar: 'حِكَمٌ وبصائر',
      en: 'Wisdoms & Insights',
    },
    episode: 4,
    title: {
      ar: 'الضَّمائرُ اليقظَة',
      en: 'Awakened Consciences',
    },
    subtitle: {
      ar: 'قراءةٌ في حركةِ الإيمان من مشاهد الخليل إلى وعيِ الإنسان المعاصر',
      en: 'A Reading in the Movement of Faith — From the Scenes of the Khalīl to the Awareness of the Modern Soul',
    },
    excerpt: {
      ar: 'ما الذي يجعل القلبَ يهفو إلى بيتٍ في صحراء، والنفسَ تتجرَّد من ألقابها لِتقفَ على صعيدٍ واحد؟ إنّه سرُّ الضمير اليقظ. هذه الحلقة الرابعة من «حِكَمٌ وبصائر» تَتَتَبَّع نبضَ الضمير في مَشاهد إبراهيمَ وهاجرَ وإسماعيل، ثم تَقرأ سورةَ القيامة شاهداً على بصيرة الإنسان على نفسه، وتَكشِف عن المنظومة التعبّديّة في الإسلام بوصفها نظاماً لإيقاظ الضمائر، وتُحدّد للضمير المعاصر أربعةَ أدوار في الأبوّة والزوجيّة والعمل والرسالة، وتَختمُ بأنّ من ماتَ ضميرُه فقد ماتَ مع إيقاف التنفيذ لبقيّة جسده.',
      en: 'What makes the heart yearn for a house in the desert, and the soul strip itself of titles to stand on a single ground? It is the secret of the awakened conscience. This fourth episode of "Wisdoms & Insights" traces the pulse of the conscience through the scenes of Ibrāhīm, Hājar, and Ismāʿīl, then reads Sūrat al-Qiyāmah as testimony to the human being\'s sure insight over himself, exposes Islam\'s devotional system as a regimen for awakening the conscience, defines four contemporary roles for it — in fatherhood, marriage, work, and message — and closes on the truth that whoever\'s conscience dies has died, with the body merely on suspended sentence.',
    },
  },
  {
    slug: 'house-of-dawah-inherited-image-human-reality',
    category: 'imamship',
    isoDate: '2026-05-20',
    date: { ar: '٢٠ مايو ٢٠٢٦', en: 'May 20, 2026' },
    readingMinutes: 9,
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
      ar: 'تأمُّلٌ في الفجوة بين الصورة الذهنيّة لبيت الإمام وبَشريّته الحقيقيّة — من بيت النبوّة إلى بيوت اليوم',
      en: "A Reflection on the Gap Between the Mental Image of the Imam's Household and Its True Humanity — From the Prophetic Household to Today's Homes",
    },
    excerpt: {
      ar: 'في مخيلة الجالية يَسكنُ بيتَ الداعية صورةٌ موروثةٌ مُسطَّحة لا تَحتمل البشريّة. لكنّ القرآن نفسه فَتَح نوافذَ بيت النبوّة على الجوع والغَيرة والإيلاء والإفك، وعالَج كلَّ ضغطٍ بنمطٍ مختلف. هذه الحلقة الثانية من «قضايا الإمام» تُفكِّك ثلاثَ "مُصادَرات" يَرزحُ تحتها بيتُ الإمام المعاصر، وتُفرد فصلاً لنفسيّة زوجته، وتُعيد تعريفَ القُدوة من "بيتٍ بلا توتّر" إلى "بيتٍ يُدير توتّرَه بحكمة".',
      en: "In the imagination of the community, the daʿwah household is inhabited by a flat, inherited image that cannot bear humanity. Yet the Qurʾān itself opened the windows of the Prophetic household onto hunger, jealousy, separation, and slander — treating each pressure with a different mode. This second episode of 'Issues of the Imam' unpacks three 'confiscations' the contemporary imam's home labors under, devotes a section to his wife's inner life, and redefines exemplarity from 'a home without tension' to 'a home that manages its tension with wisdom'.",
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
      ar: 'مَسجدٌ بِلا ذاكرةٍ مؤسَّسية هو شَجرة بلا جذور: مُكتمِلٌ ظاهرًا، هَشٌّ في أوَّل ريح. خمس عِلَل تَنهَش مساجد الغَرب، وخمسة أركان عِلاجية تُحَوِّلها من مَكاتب خِدمات إلى مُؤَسَّسات تُورِّث للأجيال. تَأصيلٌ من فقه الأَوقاف، ونُبوءة ابن خَلدون عن الأَجيال الثلاثة.',
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
