# إعداد تخزين الصور - Image Storage Setup

## المشكلة
الصور كانت بتتحفظ في `/tmp` على Vercel وده مكان مؤقت بيتمسح، عشان كده:
- الصور بتختفي بعد فترة
- الصور المرفوعة من الموبايل مش بتظهر على اللاب (كل سيرفر عنده `/tmp` خاص بيه)

## الحل
استخدام Vercel Blob Storage - تخزين سحابي دائم ومشترك بين كل السيرفرات

## خطوات الإعداد

### 1. إنشاء Blob Store على Vercel

1. افتح مشروعك على Vercel Dashboard: https://vercel.com/dashboard
2. اختار المشروع بتاعك
3. روح على تاب "Storage"
4. اضغط "Create Database"
5. اختار "Blob"
6. اديله اسم (مثلاً: `portfolio-images`)
7. اضغط "Create"

### 2. ربط Blob Store بالمشروع

بعد إنشاء الـ Blob Store:
1. اضغط على "Connect to Project"
2. اختار المشروع بتاعك
3. Vercel هيضيف المتغيرات دي تلقائياً:
   - `BLOB_READ_WRITE_TOKEN`

### 3. التأكد من المتغيرات

روح على Settings > Environment Variables وتأكد إن `BLOB_READ_WRITE_TOKEN` موجود

### 4. إعادة Deploy

بعد ربط الـ Blob Store، لازم تعمل deploy جديد:
```bash
git add .
git commit -m "Add Vercel Blob Storage for images"
git push
```

أو من Vercel Dashboard:
- روح على Deployments
- اضغط على الـ 3 نقط جنب آخر deployment
- اختار "Redeploy"

## التطوير المحلي (Local Development)

للتطوير المحلي، الصور هتتحفظ في مجلد `uploads` عادي.

إذا عايز تختبر Blob Storage محلياً:
1. انسخ `BLOB_READ_WRITE_TOKEN` من Vercel
2. ضيفه في ملف `.env.local`:
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

## كيف يعمل الكود الجديد

الكود بيتحقق تلقائياً:
- **على Vercel**: يستخدم Blob Storage (تخزين سحابي دائم)
- **محلياً**: يستخدم مجلد `uploads` العادي

## ملاحظات مهمة

- الصور القديمة في `/tmp` هتختفي، لازم ترفعها تاني
- الصور الجديدة هتكون دائمة ومتزامنة بين كل الأجهزة
- Vercel Blob مجاني لحد 500MB شهرياً

## التحقق من نجاح الإعداد

بعد Deploy:
1. ارفع صورة جديدة من الموبايل
2. افتح الموقع من اللاب
3. الصورة المفروض تظهر على الجهازين
4. الصورة مش هتختفي بعد فترة
