# 🚀 دليل النشر السريع

## ⚠️ تنبيه مهم:
**GitHub Pages لا يدعم تطبيقات Node.js!** يجب استخدام منصة تدعم الخوادم.

---

## ✅ الحل الموصى به: Render (مجاني)

### الخطوات بالترتيب:

#### 1️⃣ تجهيز GitHub

```bash
# في مجلد المشروع، افتح Terminal/PowerShell:
git init
git add .
git commit -m "Ready for deployment"
```

ثم:
1. اذهب إلى: https://github.com
2. أنشئ مستودع جديد (New Repository)
3. سمّه: `training-website`
4. **لا تضيف** README أو .gitignore

ثم في Terminal:
```bash
git remote add origin https://github.com/YOUR-USERNAME/training-website.git
git branch -M main
git push -u origin main
```

#### 2️⃣ النشر على Render

1. **إنشاء حساب:**
   - اذهب إلى: https://render.com
   - سجل دخول بحساب GitHub

2. **إنشاء Web Service:**
   - اضغط "New +" → "Web Service"
   - اختر مستودع `training-website`
   - املأ:
     * Name: `training-website-hail`
     * Environment: `Node`
     * Build Command: `npm install`
     * Start Command: `npm start`
     * Plan: `Free`

3. **Environment Variables (مهم!):**
   اضغط "Advanced" وأضف:
   ```
   NODE_ENV = production
   JWT_SECRET = tvtc-hail-secret-2024-secure-key
   ```

4. **اضغط "Create Web Service"**

5. **انتظر 2-3 دقائق حتى ينتهي النشر**

6. **تهيئة قاعدة البيانات:**
   - في Render Dashboard، اضغط "Shell" (في القائمة اليسرى)
   - اكتب: `npm run init-db`
   - اضغط Enter

#### 3️⃣ اختبر الموقع

رابط موقعك سيكون:
```
https://training-website-hail.onrender.com
```

جرّب:
- الصفحة الرئيسية: `https://training-website-hail.onrender.com/`
- تسجيل الدخول: `https://training-website-hail.onrender.com/login-admin.html`

استخدم أحد الحسابات:
- Username: `admin-m`
- Password: `mohmd77`

---

## 🎯 بدائل أخرى (كلها مجانية):

### Railway.app
1. https://railway.app
2. Connect GitHub
3. Deploy from repo
4. يضيف قاعدة البيانات تلقائياً

### Fly.io
```bash
# تثبيت Fly CLI
npm install -g flyctl

# تسجيل الدخول
flyctl auth login

# النشر
flyctl launch
flyctl deploy
```

---

## ⚠️ ملاحظات النسخة المجانية:

1. **Render Free Tier:**
   - الموقع ينام بعد 15 دقيقة من عدم النشاط
   - أول زيارة بعد النوم تأخذ 30-60 ثانية
   - الحل: استخدم UptimeRobot لإبقائه مستيقظاً

2. **للإنتاج الفعلي:**
   - انقل للخطة المدفوعة ($7/شهر على Render)
   - أو استخدم VPS مثل DigitalOcean ($4/شهر)

---

## 🔗 ربط دومين خاص (اختياري)

إذا اشتريت دومين (مثل training-hail.gov.sa):

1. **في Render:**
   - Settings → Custom Domain
   - أضف الدومين
   - سينشئ لك CNAME Record

2. **في موقع الدومين (مثل STC.sa):**
   - اذهب لإعدادات DNS
   - أضف:
     ```
     Type: CNAME
     Name: @
     Value: training-website-hail.onrender.com
     ```

---

## 📞 تحتاج مساعدة؟

**تواصل معي:**
- WhatsApp: 0534630161
- Email: sheikhaalbander@gmail.com
- LinkedIn: https://www.linkedin.com/in/sheikha-albander-255150261

**خدمات أقدمها:**
- ✅ نشر الموقع كامل (مجاناً للمشروع)
- ✅ ربط الدومين
- ✅ تفعيل HTTPS
- ✅ دعم فني

