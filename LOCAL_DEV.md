# تشغيل المشروع محلياً (Frontend + Backend + Admin)

## 1. الباكند (Backend)

```powershell
cd backend
```

- انسخ ملف البيئة: انسخ `.env.example` إلى `.env`
- إذا عندك MongoDB Atlas: ضع في `.env` السطر:
  ```
  MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
  ```
- إذا تستخدم MongoDB محلي: اترك الافتراضي أو ضع:
  ```
  MONGO_URI=mongodb://localhost:27017/portfolio
  ```

ثم شغّل السيرفر:

```powershell
npm install
npm run dev
```

يجب أن تظهر: `Server Started on http://localhost:3001` و `DB Connected`.

---

## 2. لوحة الإدارة (Admin) – المنفذ 5174

في **نافذة PowerShell جديدة**:

```powershell
cd admin
npm install
npm run dev
```

افتح المتصفح: **http://localhost:5174**

من هنا تضيف/تعدّل/تحذف المشاريع، والطلبات تذهب تلقائياً للباكند عبر البروكسي.

---

## 3. الواجهة الأمامية (Frontend) – المنفذ 5173

في **نافذة PowerShell ثالثة**:

```powershell
cd frontend
npm install
npm run dev
```

افتح المتصفح: **http://localhost:5173**

المشاريع التي أضفتها من لوحة الإدارة تظهر هنا لأن الـ Frontend يقرأ من نفس الـ API.

---

## الربط بين الأجزاء

| جزء      | المنفذ | الوظيفة |
|----------|--------|----------|
| Backend  | 3001   | API + قاعدة البيانات + رفع الصور |
| Admin    | 5174   | إدارة المشاريع (يطلب من Backend عبر بروكسي) |
| Frontend | 5173   | عرض المشاريع للزوار (يطلب من Backend عبر بروكسي) |

في وضع التطوير (dev) الـ Admin والـ Frontend يستخدمان **بروكسي** تجاه `http://localhost:3001`، فلا تحتاج لتعديل روابط الـ API يدوياً.

للنشر على السحابة: ضع `VITE_API_URL` في ملفات `.env` لكل من `admin` و `frontend` برابط الباكند المنشور (مثل Render).
