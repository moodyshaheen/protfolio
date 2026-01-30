# 🚀 دليل نشر Portfolio الكامل

هذا الدليل يشرح كيفية نشر المشروع بالكامل (Backend + Frontend + Admin) مع ربطهم ببعض.

---

## المتطلبات الأساسية

1. حساب على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - مجاني
2. حساب على [Render](https://render.com) - مجاني
3. حساب على [Surge](https://surge.sh) - مجاني (أو أي منصة أخرى للـ static sites)

---

## 📋 الخطوات بالترتيب

### الخطوة 1: إعداد قاعدة البيانات (MongoDB Atlas)

1. اذهب إلى https://www.mongodb.com/cloud/atlas
2. سجل دخول أو أنشئ حساب جديد
3. أنشئ **Cluster جديد**:
   - اختر **M0 Free tier**
   - اختر المنطقة الأقرب لك
4. انتظر حتى يتم إنشاء الـ Cluster (2-3 دقائق)
5. اضغط على **"Connect"**:
   - اختر "Drivers"
   - انسخ **Connection String**
   - استبدل `<password>` بكلمة المرور الخاصة بك
   - مثال: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`

---

### الخطوة 2: نشر الباك إند على Render

1. اذهب إلى https://render.com
2. سجل دخول أو أنشئ حساب جديد
3. اضغط على **"New +"** → **"Web Service"**
4. اختر **"Build and deploy from a Git repository"**
5. اربط حسابك على GitHub (أو ارفع المشروع على GitHub أولاً)
6. اختر Repository الخاص بالمشروع

#### إعدادات Render:

```
Name: portfolio-backend
Region: اختر أقرب منطقة لك
Branch: main (أو master)
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: node server.js
Plan: Free
```

#### Environment Variables (مهم جداً):

أضف المتغيرات التالية:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | رابط MongoDB Atlas الذي نسخته |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |

7. اضغط على **"Create Web Service"**
8. انتظر حتى ينتهي النشر (5-10 دقائق)
9. **احفظ الرابط** الذي سيظهر مثل: `https://portfolio-backend-xxxx.onrender.com`

---

### الخطوة 3: تحديث Frontend مع رابط الباك إند

1. افتح مجلد `frontend`
2. أنشئ ملف `.env` بجانب `package.json`:

```env
VITE_API_URL=https://portfolio-backend-xxxx.onrender.com
```

(استبدل الرابط برابط الباك إند الذي حصلت عليه من Render)

3. بناء Frontend:

```bash
cd frontend
npm run build
```

4. نشر على Surge:

```bash
surge dist falcon-portfolio.surge.sh
```

---

### الخطوة 4: تحديث Admin مع رابط الباك إند

1. افتح مجلد `admin`
2. أنشئ ملف `.env` بجانب `package.json`:

```env
VITE_API_URL=https://portfolio-backend-xxxx.onrender.com
```

(نفس رابط الباك إند)

3. بناء Admin:

```bash
cd admin
npm run build
```

4. نشر على Surge:

```bash
surge dist falcon-admin.surge.sh
```

---

## ✅ التحقق من النشر

### اختبر الباك إند:
افتح: `https://portfolio-backend-xxxx.onrender.com/api/projects`
يجب أن ترى `[]` (مصفوفة فارغة في البداية)

### اختبر الأدمين:
1. افتح: https://falcon-admin.surge.sh
2. أضف مشروع جديد
3. تأكد من حفظه بنجاح

### اختبر الفرونت إند:
1. افتح: https://falcon-portfolio.surge.sh
2. يجب أن ترى المشاريع التي أضفتها في الأدمين

---

## 🔄 تحديث المشروع مستقبلاً

### تحديث الباك إند:
Render سيُحدث تلقائياً عند رفع commits جديدة على GitHub

### تحديث Frontend أو Admin:
```bash
# Frontend
cd frontend
npm run build
surge dist falcon-portfolio.surge.sh

# Admin
cd admin
npm run build
surge dist falcon-admin.surge.sh
```

---

## ⚠️ ملاحظات مهمة

1. **Render Free Tier**:
   - السيرفر يتوقف بعد 15 دقيقة من عدم النشاط
   - أول طلب بعد التوقف قد يأخذ 30 ثانية
   - 750 ساعة مجانية شهرياً

2. **MongoDB Atlas Free Tier**:
   - مساحة تخزين: 512 MB
   - كافية لآلاف المشاريع

3. **الصور**:
   - الصور تُخزن على سيرفر Render
   - قد تُحذف عند إعادة تشغيل السيرفر
   - للإنتاج الحقيقي، استخدم خدمة تخزين سحابية مثل:
     - Cloudinary (مجاني حتى 25 GB)
     - AWS S3
     - Google Cloud Storage

---

## 🎉 انتهى!

الآن لديك:
- ✅ Backend على Render (شغال 24/7)
- ✅ Frontend على Surge
- ✅ Admin Panel على Surge
- ✅ قاعدة بيانات MongoDB في السحابة
- ✅ كل شيء مربوط ببعضه!

أي مشروع تضيفه من الأدمين سيظهر فوراً في الفرونت إند! 🚀

