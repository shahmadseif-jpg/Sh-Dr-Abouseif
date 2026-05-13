'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { siteConfig } from '@/lib/site-config';

type Location = 'aia' | 'bayt_al_karim';

const content = {
  ar: {
    title: 'خدمة الاستشارات الأسرية',
    subtitle: 'برعاية د. أحمد أبو سيف',
    intro:
      'خدمة استشارات أسرية شرعية ومتخصصة لخدمة الجالية المسلمة. نستقبل الإخوة والأخوات في موعدين أسبوعيين بأحد المسجدين أدناه، بسرية تامة وبدون رسوم.',
    select_location: 'اختر مكان الاستشارة',
    aia_name: 'مسجد أكاديمية الأئمة',
    aia_address: 'American Imams Academy, USA',
    aia_hours: 'الجمعة بعد العصر · السبت بعد المغرب',
    bayt_name: 'مسجد بيت الكريم',
    bayt_address: 'Bayt Al-Karim Islamic Center, Fort Worth, TX',
    bayt_hours: 'الخميس بعد المغرب · الأحد بعد الظهر',
    form_title: 'نموذج التسجيل',
    name_label: 'الاسم الكامل',
    email_label: 'البريد الإلكتروني',
    phone_label: 'رقم الهاتف',
    type_label: 'نوع الاستشارة',
    type_premarital: 'استشارة ما قبل الزواج',
    type_marital: 'مشكلة زوجية',
    type_parenting: 'تربية الأبناء',
    type_other: 'أخرى',
    message_label: 'وصف موجز للاستشارة (سيُتعامل معه بسرية تامة)',
    message_placeholder: 'اكتب وصفاً موجزاً... (اختياري)',
    submit: 'إرسال طلب الاستشارة',
    note_title: 'ملاحظات مهمة',
    notes: [
      'الخدمة مجانية بالكامل',
      'يحفظ كل ما يدور في الاستشارة بسرية تامة',
      'الإخوة يستقبلهم الشيخ، والأخوات تستقبلهن من تنوب عنه',
      'قد يتم تأجيل الموعد لظروف طارئة',
      'يفضل الحجز قبل الموعد بـ 24 ساعة على الأقل',
    ],
    success: 'تم تجهيز رسالتك. سيفتح برنامج البريد الإلكتروني لإرسالها.',
  },
  en: {
    title: 'Family Consultation Service',
    subtitle: 'Sponsored by Dr. Ahmed Abouseif',
    intro:
      "A confidential, specialized Islamic family-counseling service for our Muslim community. Brothers and sisters are welcome at two weekly slots at either masjid below — no fees, complete privacy.",
    select_location: 'Choose your consultation location',
    aia_name: 'American Imams Academy Masjid',
    aia_address: 'American Imams Academy, USA',
    aia_hours: 'Friday after Asr · Saturday after Maghrib',
    bayt_name: 'Bayt Al-Karim Islamic Center',
    bayt_address: 'Bayt Al-Karim Islamic Center, Fort Worth, TX',
    bayt_hours: 'Thursday after Maghrib · Sunday afternoon',
    form_title: 'Registration form',
    name_label: 'Full name',
    email_label: 'Email',
    phone_label: 'Phone number',
    type_label: 'Consultation type',
    type_premarital: 'Pre-marriage counseling',
    type_marital: 'Marital issue',
    type_parenting: 'Parenting',
    type_other: 'Other',
    message_label: 'Brief description (kept fully confidential)',
    message_placeholder: 'Write a brief note... (optional)',
    submit: 'Submit consultation request',
    note_title: 'Important notes',
    notes: [
      'The service is completely free',
      'All consultations are kept strictly confidential',
      'Brothers meet the Sheikh; sisters are received by a female counselor',
      'Sessions may be rescheduled in case of emergencies',
      'Please book at least 24 hours in advance',
    ],
    success: 'Your request is ready. Your email app will open to send it.',
  },
};

export default function ConsultationsContent() {
  const locale = useLocale() as 'ar' | 'en';
  const c = content[locale];

  const [location, setLocation] = useState<Location>('aia');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState(c.type_marital);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locName = location === 'aia' ? c.aia_name : c.bayt_name;
    const subject = `Family Consultation Request — ${locName}`;
    const body = `${c.name_label}: ${name}
${c.email_label}: ${email}
${c.phone_label}: ${phone}
${c.select_location}: ${locName}
${c.type_label}: ${type}

${c.message_label}:
${message}`;

    const mailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  const inputCls =
    'w-full px-4 py-2 text-sm border border-navy-200 rounded-md focus:outline-none focus:border-navy-400 bg-white';

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-3">
            {c.subtitle}
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">
            {c.title}
          </h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">
            {c.intro}
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-medium text-navy-700 mb-4 gold-line">
            {c.select_location}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setLocation('aia')}
              className={`text-start p-5 rounded-lg border-2 transition-colors ${
                location === 'aia'
                  ? 'border-navy-600 bg-navy-50/50'
                  : 'border-navy-100 bg-white hover:border-navy-300'
              }`}
            >
              <div className="font-medium text-navy-700 mb-1">{c.aia_name}</div>
              <div className="text-xs text-navy-500 mb-2">{c.aia_address}</div>
              <div className="text-xs text-gold-500">{c.aia_hours}</div>
            </button>
            <button
              type="button"
              onClick={() => setLocation('bayt_al_karim')}
              className={`text-start p-5 rounded-lg border-2 transition-colors ${
                location === 'bayt_al_karim'
                  ? 'border-navy-600 bg-navy-50/50'
                  : 'border-navy-100 bg-white hover:border-navy-300'
              }`}
            >
              <div className="font-medium text-navy-700 mb-1">{c.bayt_name}</div>
              <div className="text-xs text-navy-500 mb-2">{c.bayt_address}</div>
              <div className="text-xs text-gold-500">{c.bayt_hours}</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-navy-100 rounded-lg p-6 sm:p-8 space-y-5">
          <h2 className="text-xl font-medium text-navy-700">{c.form_title}</h2>

          <div>
            <label className="block text-sm text-navy-600 mb-1.5">{c.name_label}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-navy-600 mb-1.5">{c.email_label}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm text-navy-600 mb-1.5">{c.phone_label}</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-navy-600 mb-1.5">{c.type_label}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputCls}
            >
              <option>{c.type_premarital}</option>
              <option>{c.type_marital}</option>
              <option>{c.type_parenting}</option>
              <option>{c.type_other}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-navy-600 mb-1.5">{c.message_label}</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={c.message_placeholder}
              className={inputCls + ' resize-none'}
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-navy-600 text-white text-sm font-medium rounded-md hover:bg-navy-700 transition-colors"
          >
            {c.submit}
          </button>

          {submitted && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">
              {c.success}
            </div>
          )}
        </form>

        <div className="mt-10 bg-navy-50/40 border border-navy-100 rounded-lg p-6">
          <h3 className="text-base font-medium text-navy-700 mb-3">{c.note_title}</h3>
          <ul className="space-y-2 text-sm text-navy-600">
            {c.notes.map((note, idx) => (
              <li key={idx} className="flex gap-2 items-start">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
