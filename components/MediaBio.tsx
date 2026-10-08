'use client';

import { useState } from 'react';

type Loc = 'ar' | 'en' | 'es' | 'ur';

/** Short (~150-word) biography for event organizers, media and institutions. */
const BIO: Record<Loc, { title: string; hint: string; text: string; copy: string; copied: string; photo: string }> = {
  ar: {
    title: 'سيرة مختصرة للإعلام والمنظِّمين',
    hint: 'نصٌّ جاهز للاستخدام في الإعلانات والتقديم في المؤتمرات والفعاليات.',
    text:
      'الإمام الدكتور أحمد محمد أبو سيف عالمٌ أزهريّ متخصص في التفسير وعلوم القرآن، حصل على الدكتوراه من جامعة الأزهر عام ٢٠٠٨م، ويحمل إجازة قرآنية برواية حفص من طريقي الشاطبية والطيبة بالسند المتصل إلى النبي ﷺ. أسّس أكاديمية الأئمة بأمريكا عام ٢٠١٧م ويرأسها، ويؤمّ مسجدها ويدير شؤونه الدينية، وشغل قبل ذلك منصب مدير الإدارة العامة للإرشاد الديني بوزارة الأوقاف المصرية. تمتد خبرته لأكثر من ثلاثة عقود بين الإمامة والتدريس الجامعي والبحث العلمي والإرشاد الأسري في مصر والولايات المتحدة. يقوم مشروعه الفكري على قراءة مقاصدية للقرآن تصل الوحي بواقع الإنسان، مع عناية خاصة بقضايا المسلمين في الغرب. له أبحاث محكّمة في التفسير وضبط الفتوى في العصر الرقمي، ويقدّم محاضراته وخطبه بالعربية والإنجليزية.',
    copy: 'نسخ النص',
    copied: 'تم النسخ',
    photo: 'تحميل الصورة الرسمية',
  },
  en: {
    title: 'Short Bio for Media & Event Organizers',
    hint: 'Ready to use in announcements and speaker introductions.',
    text:
      'Imam Dr. Ahmed Mohamed Abouseif is an Al-Azhar–trained scholar specializing in Qur’anic exegesis (tafsīr) and the sciences of the Qur’an. He earned his PhD from Al-Azhar University in 2008 and holds an authorized chain of Qur’anic recitation (ijāzah) tracing back to the Prophet ﷺ. He founded the American Imams Academy in 2017 and serves as its president, as well as imam and director of religious affairs at its mosque. He previously served as Director General of Religious Guidance at Egypt’s Ministry of Religious Endowments. With more than three decades of experience in Egypt and the United States, his work spans leading congregations, university teaching, research, and family counseling. His intellectual project centers on a purpose-driven reading of the Qur’an that connects revelation to everyday life, with special attention to the concerns of Muslims in the West. He has published peer-reviewed research on tafsīr and on religious rulings (fatwa) in the digital age, and he lectures and preaches in both Arabic and English.',
    copy: 'Copy text',
    copied: 'Copied',
    photo: 'Download official photo',
  },
  es: {
    title: 'Biografía breve para medios y organizadores',
    hint: 'Texto listo para anuncios y presentaciones en conferencias y eventos.',
    text:
      'El imam Dr. Ahmed Mohamed Abouseif es un sabio formado en Al-Azhar, especialista en exégesis coránica (tafsīr) y ciencias del Corán. Obtuvo su doctorado en la Universidad de Al-Azhar en 2008 y posee una licencia (iŷāza) de recitación coránica con cadena de transmisión ininterrumpida hasta el Profeta ﷺ. Fundó la Academia de Imames de América en 2017, de la que es presidente, y es imam y director de asuntos religiosos de su mezquita. Anteriormente fue director general de Orientación Religiosa del Ministerio de Bienes Religiosos de Egipto. Cuenta con más de tres décadas de experiencia en Egipto y Estados Unidos en el imamato, la docencia universitaria, la investigación y la orientación familiar. Su proyecto intelectual se basa en una lectura del Corán orientada a sus fines, que une la revelación con la realidad del ser humano, con especial atención a las cuestiones de los musulmanes en Occidente. Ha publicado investigaciones arbitradas sobre el tafsīr y la regulación de la fatwa en la era digital, e imparte conferencias y sermones en árabe y en inglés.',
    copy: 'Copiar texto',
    copied: 'Copiado',
    photo: 'Descargar foto oficial',
  },
  ur: {
    title: 'میڈیا اور منتظمین کے لیے مختصر تعارف',
    hint: 'اعلانات اور کانفرنسوں و تقریبات میں تعارف کے لیے تیار متن۔',
    text:
      'امام ڈاکٹر احمد محمد ابو سیف ازہری عالم ہیں جو تفسیر اور علومِ قرآن میں تخصص رکھتے ہیں۔ انہوں نے ۲۰۰۸ء میں جامعہ ازہر سے ڈاکٹریٹ حاصل کی، اور روایتِ حفص میں شاطبیہ اور طیبہ کے طرق سے نبی ﷺ تک متصل سند کے ساتھ قرآنی اجازت رکھتے ہیں۔ انہوں نے ۲۰۱۷ء میں امریکن امامز اکیڈمی کی بنیاد رکھی اور اس کے صدر ہیں، نیز اکیڈمی کی مسجد کے امام اور اس کے دینی امور کے نگران ہیں۔ اس سے قبل وہ مصر کی وزارتِ اوقاف میں دینی رہنمائی کے محکمۂ عامہ کے ڈائریکٹر رہ چکے ہیں۔ مصر اور امریکہ میں امامت، جامعاتی تدریس، علمی تحقیق اور خاندانی رہنمائی کا تین دہائیوں سے زائد تجربہ رکھتے ہیں۔ ان کا فکری منصوبہ قرآن کی مقاصدی قراءت پر قائم ہے جو وحی کو انسان کی عملی زندگی سے جوڑتی ہے، اور مغرب میں مسلمانوں کے مسائل پر خاص توجہ دیتی ہے۔ تفسیر اور ڈیجیٹل دور میں فتویٰ کے ضوابط پر ان کی محکّم تحقیقات شائع ہو چکی ہیں، اور وہ عربی اور انگریزی میں لیکچر اور خطبے دیتے ہیں۔',
    copy: 'متن کاپی کریں',
    copied: 'کاپی ہو گیا',
    photo: 'سرکاری تصویر ڈاؤن لوڈ کریں',
  },
};

export default function MediaBio({ locale }: { locale: string }) {
  const b = BIO[(locale as Loc)] ?? BIO.ar;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(b.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the text remains selectable */
    }
  };

  return (
    <section className="mb-12 rounded-lg border border-gold-200 bg-gold-50/60 p-6 print:hidden">
      <h2 className="mb-1 text-lg font-medium text-navy-700">{b.title}</h2>
      <p className="mb-4 text-sm text-navy-500">{b.hint}</p>
      <p className="mb-5 leading-loose text-navy-700 select-all">{b.text}</p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center rounded-md bg-navy-600 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 transition-colors"
        >
          {copied ? b.copied : b.copy}
        </button>
        <a
          href="/dr-ahmed-headshot.jpg"
          download="Dr-Ahmed-Abouseif.jpg"
          className="inline-flex items-center rounded-md border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors no-underline"
        >
          {b.photo}
        </a>
      </div>
    </section>
  );
}
