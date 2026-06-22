'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

const RECEIVER = 'shahmadseif@gmail.com';

/** Newsletter signup — captures the email to the shaykh's inbox via FormSubmit. */
export default function Newsletter() {
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  const t =
    locale === 'ar'
      ? { title: 'النشرة البريديّة', desc: 'اشترك لتصلك أحدث المقالات والأبحاث.', ph: 'بريدك الإلكترونيّ', btn: 'اشترك', sending: 'جارٍ…', ok: 'تمّ اشتراكك، بارك الله فيك.', err: 'تعذّر الإرسال، حاول لاحقاً.' }
      : locale === 'es'
      ? { title: 'Boletín', desc: 'Suscríbete para recibir los últimos artículos e investigaciones.', ph: 'Tu correo electrónico', btn: 'Suscribirse', sending: 'Enviando…', ok: '¡Suscripción realizada, que Dios te bendiga!', err: 'No se pudo enviar, inténtalo más tarde.' }
      : { title: 'Newsletter', desc: 'Subscribe for the latest articles and research.', ph: 'Your email', btn: 'Subscribe', sending: 'Sending…', ok: 'Subscribed — may God bless you.', err: 'Could not send, please try later.' };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${RECEIVER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          'البريد / Email': email.trim(),
          _subject: 'اشتراك جديد في النشرة البريديّة',
          _template: 'table',
          _captcha: 'false',
        }),
      });
      if (!res.ok) throw new Error('bad status');
      setStatus('ok');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="max-w-md">
      <h3 className="text-sm font-medium text-navy-700 mb-1">{t.title}</h3>
      <p className="text-xs text-navy-500 mb-3 leading-relaxed">{t.desc}</p>
      {status === 'ok' ? (
        <p className="text-sm text-gold-600">{t.ok}</p>
      ) : (
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.ph}
            className="min-w-0 flex-1 rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-100"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="shrink-0 rounded-md bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {status === 'sending' ? t.sending : t.btn}
          </button>
        </form>
      )}
      {status === 'error' && <p className="mt-2 text-xs text-red-500">{t.err}</p>}
    </div>
  );
}
