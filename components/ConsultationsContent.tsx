'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/lib/site-config';
import { FIELD_LIMITS, validateFields, type FieldError } from '@/lib/forms';

type Location = 'aia' | 'bayt_al_karim';
type Status = 'idle' | 'draft_opened';

/**
 * Family-consultation request.
 *
 * Honest flow (FORM-03 / REL-02): this page does NOT book or deliver
 * anything. It prepares an e-mail draft in the visitor's own mail app
 * (mailto:), and nothing leaves the device until the visitor presses Send
 * there. An appointment exists only after the Academy replies. The copy
 * says so before and after the button in all four languages.
 */
export default function ConsultationsContent() {
  const t = useTranslations('consultationsPage');
  const notes = t.raw('notes') as string[];
  const types = [t('type_premarital'), t('type_marital'), t('type_parenting'), t('type_other')];
  const receiver = siteConfig.contact.email;

  const [location, setLocation] = useState<Location>('aia');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState(types[1]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, FieldError>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateFields(
      { name, email, phone },
      {
        name: { required: true, maxLength: FIELD_LIMITS.name },
        email: { required: true, email: true },
        phone: { required: true, maxLength: 40 },
      }
    );
    setErrors(found);
    if (Object.keys(found).length) {
      const first = (['name', 'email', 'phone'] as const).find((f) => found[f]);
      if (first) e.currentTarget.querySelector<HTMLElement>(`#consult-${first}`)?.focus();
      return;
    }
    const locName = location === 'aia' ? t('aia_name') : t('bayt_name');
    const subject = `Family Consultation Request — ${locName}`;
    const body = `${t('name_label')}: ${name}
${t('email_label')}: ${email}
${t('phone_label')}: ${phone}
${t('select_location')}: ${locName}
${t('type_label')}: ${type}

${t('message_label')}:
${message}`;

    const mailto = `mailto:${receiver}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    // We cannot know whether a mail app opened or whether the e-mail was
    // sent; the status text below says exactly that.
    setStatus('draft_opened');
  };

  const errText = (e: FieldError) => (e === 'email' ? t('err_email') : t('err_required'));
  const fieldA11y = (f: string) => ({
    id: `consult-${f}`,
    'aria-invalid': errors[f] ? (true as const) : undefined,
    'aria-describedby': [errors[f] ? `consult-${f}-err` : '', f === 'name' ? 'consult-howto' : '']
      .filter(Boolean)
      .join(' ') || undefined,
  });
  const fieldErr = (f: string) =>
    errors[f] ? (
      <p id={`consult-${f}-err`} className="mt-1 text-sm text-red-700">
        {errText(errors[f])}
      </p>
    ) : null;

  const inputCls =
    'w-full min-h-[44px] px-4 py-2 text-sm border border-navy-200 rounded-md focus:outline-none focus:border-navy-500 bg-white aria-[invalid=true]:border-red-600';
  const labelCls = 'block text-sm text-navy-600 mb-1.5';

  const locationButton = (id: Location, nameKey: string, addrKey: string, hoursKey: string) => (
    <button
      type="button"
      onClick={() => setLocation(id)}
      aria-pressed={location === id}
      className={`text-start p-5 rounded-lg border-2 transition-colors ${
        location === id ? 'border-navy-600 bg-navy-50/50' : 'border-navy-100 bg-white hover:border-navy-300'
      }`}
    >
      <div className="font-medium text-navy-700 mb-1">{t(nameKey)}</div>
      <div className="text-xs text-navy-500 mb-2" dir="ltr" lang="en">
        {t(addrKey)}
      </div>
      <div className="text-xs text-gold-700">{t(hoursKey)}</div>
    </button>
  );

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-gold-700 mb-3">{t('subtitle')}</div>
          <h1 className="text-4xl sm:text-5xl font-medium text-navy-700 mb-4">{t('title')}</h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">{t('intro')}</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-medium text-navy-700 mb-4 gold-line">{t('select_location')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {locationButton('aia', 'aia_name', 'aia_address', 'aia_hours')}
            {locationButton('bayt_al_karim', 'bayt_name', 'bayt_address', 'bayt_hours')}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border border-navy-100 rounded-lg p-6 sm:p-8 space-y-5"
        >
          <h2 className="text-xl font-medium text-navy-700">{t('form_title')}</h2>

          <p
            id="consult-howto"
            className="rounded-md border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-navy-700 leading-relaxed"
          >
            {t('mailto_note', { email: receiver })}
          </p>

          <div>
            <label htmlFor="consult-name" className={labelCls}>
              {t('name_label')} <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              {...fieldA11y('name')}
              required
              aria-required="true"
              autoComplete="name"
              maxLength={FIELD_LIMITS.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
            {fieldErr('name')}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="consult-email" className={labelCls}>
                {t('email_label')} <span aria-hidden="true">*</span>
              </label>
              <input
                type="email"
                dir="ltr"
                {...fieldA11y('email')}
                required
                aria-required="true"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
              {fieldErr('email')}
            </div>
            <div>
              <label htmlFor="consult-phone" className={labelCls}>
                {t('phone_label')} <span aria-hidden="true">*</span>
              </label>
              <input
                type="tel"
                dir="ltr"
                {...fieldA11y('phone')}
                required
                aria-required="true"
                autoComplete="tel"
                maxLength={40}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
              />
              {fieldErr('phone')}
            </div>
          </div>

          <div>
            <label htmlFor="consult-type" className={labelCls}>
              {t('type_label')}
            </label>
            <select id="consult-type" value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
              {types.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="consult-message" className={labelCls}>
              {t('message_label')}
            </label>
            <textarea
              id="consult-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('message_placeholder')}
              className={inputCls + ' resize-none'}
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-navy-600 text-white text-sm font-medium rounded-md hover:bg-navy-700 transition-colors"
          >
            {t('submit')}
          </button>

          <div role="status" aria-live="polite">
            {status === 'draft_opened' && (
              <div className="text-sm text-navy-800 bg-gold-50 border border-gold-200 rounded-md p-3 leading-relaxed">
                {t('success')}{' '}
                <a href={`mailto:${receiver}`} className="font-medium underline" dir="ltr">
                  {receiver}
                </a>
              </div>
            )}
          </div>
        </form>

        <div className="mt-10 bg-navy-50/40 border border-navy-100 rounded-lg p-6">
          <h2 className="text-base font-medium text-navy-700 mb-3">{t('note_title')}</h2>
          <ul className="space-y-2 text-sm text-navy-600">
            {notes.map((note, idx) => (
              <li key={idx} className="flex gap-2 items-start">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" aria-hidden="true" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
