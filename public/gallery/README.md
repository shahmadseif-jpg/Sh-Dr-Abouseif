# دليل إضافة صور الجاليري | Gallery Photos Guide

## كيفية إضافة صورة جديدة | How to Add a New Photo

### 1. ضع ملف الصورة هنا | Place the image file here
- ضع ملف `.jpg` أو `.png` أو `.webp` في هذا المجلد
- استخدم اسماً وصفياً مثل: `khutba-aia-2024-10.jpg`
- يُفضل أن تكون الصورة أكبر من 1200 بكسل عرضاً

### 2. أضف البيانات في `lib/gallery.ts` | Add metadata in `lib/gallery.ts`

أضف كائناً جديداً إلى المصفوفة `galleryItems`:

```typescript
{
  src: '/gallery/khutba-aia-2024-10.jpg',
  alt: {
    ar: 'الإمام د. أحمد أبو سيف يلقي خطبة الجمعة',
    en: 'Imam Dr. Ahmed Abouseif delivering Jumu\'ah khutbah',
  },
  caption: {
    ar: 'خطبة الجمعة بمسجد أكاديمية الأئمة الأمريكية',
    en: 'Friday khutbah at the American Imams Academy Mosque',
  },
  isoDate: '2024-10-15',
  location: {
    ar: 'بلانو، تكساس',
    en: 'Plano, Texas',
  },
  category: 'lectures', // lectures | events | academy | community | media
},
```

### 3. الفئات المتاحة | Available Categories

- `lectures` — محاضرات ودروس | Lectures & Classes
- `events` — فعاليات وملتقيات | Events & Conferences
- `academy` — أكاديمية الأئمة | Imams Academy
- `community` — نشاط جماعي | Community Activities
- `media` — ظهور إعلامي | Media Appearances

## معايير اختيار الصور للنشر الدعوي | Criteria for Da'wah-Suitable Photos

تشمل الصور المناسبة:

- ✅ خطب وفعاليات عامة في المساجد والمراكز
- ✅ محاضرات ودروس
- ✅ لقاءات مع طلاب العلم والعلماء
- ✅ ظهور إعلامي ومقابلات
- ✅ أنشطة الأكاديمية والمؤسسات الإسلامية
- ✅ مؤتمرات ومنتديات

تجنّب:

- ❌ صور أسرية خاصة
- ❌ صور تحتوي على وجوه نساء بدون إذن
- ❌ صور قد تثير حساسيات اجتماعية أو سياسية غير مقصودة
- ❌ صور ذات جودة منخفضة

## التحسين قبل الرفع | Optimization Before Upload

لتقليل حجم الموقع وتسريعه:

```bash
# في Terminal
cd /Users/dr.ahmedabouseif/Documents/Claude/Projects/Dr-Ahmed-Website/public/gallery

# تحسين JPG (يحتاج Sharp أو ImageMagick)
# أو استخدم موقع: https://squoosh.app/
```

أو يكفي رفع الصور كما هي - Vercel وNext.js يقومان بالتحسين تلقائياً.
