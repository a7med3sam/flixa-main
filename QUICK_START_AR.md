# 🚀 دليل البدء السريع

## 1️⃣ تثبيت المشروع

```bash
# تثبيت المتطلبات
pnpm install

# أو استخدام npm
npm install
```

## 2️⃣ تشغيل المشروع

```bash
# بيئة التطوير
pnpm dev

# السرفر سيعمل على http://localhost:8083
```

## 3️⃣ المسارات المتاحة

### الصفحات الرئيسية:

| الصفحة        | المسار               | الوصف                        |
| ------------- | -------------------- | ---------------------------- |
| 🏠 الرئيسية   | `/`                  | صفحة لوحة التحكم الرئيسية    |
| 👥 المستخدمون | `/users`             | إدارة المستخدمين             |
| 💰 العمولات   | `/commissions`       | إدارة العمولات على المدفوعات |
| 📊 التقارير   | `/reports`           | التقارير والإحصائيات         |
| 💹 الماليات   | `/financial-reports` | التقارير المالية             |
| 📝 المحتوى    | `/content/about-us`  | إدارة المحتوى النصي          |
| 💬 الرسائل    | `/messages`          | إدارة رسائل اتصل بنا         |
| 🔔 الإشعارات  | `/notifications`     | إدارة الإشعارات              |

## 4️⃣ هيكل الملفات المهم

```
src/
├── app/[locale]/(control-panel)/    # صفحات التطبيق
├── sections/admin-dashboard/         # مكونات الـ Views
├── _mock/                           # بيانات وهمية للاختبار
├── routes/paths.ts                  # جميع المسارات
└── layouts/dashboard/               # التخطيط والقائمة الجانبية
```

## 5️⃣ ميزات التطبيق

### 🎯 الميزات الأساسية:

- ✅ لوحة تحكم إدارية احترافية
- ✅ 7 أقسام إدارية مختلفة
- ✅ واجهات مستجابة (Responsive)
- ✅ دعم العربية والإنجليزية
- ✅ Mock Data جاهزة للاختبار

### 🔐 الميزات الأمنية:

- ✅ TypeScript لضمان أمان الكود
- ✅ Input Validation
- ✅ Error Handling

## 6️⃣ تطوير الميزات الجديدة

### إضافة صفحة جديدة:

1. **إنشاء مجلد في sections:**

```bash
src/sections/admin-dashboard/new-section/
```

2. **إنشاء view component:**

```typescript
// src/sections/admin-dashboard/new-section/list-view.tsx
'use client';
import { Box } from '@mui/material';

export default function NewSectionView() {
  return <Box>محتوى جديد</Box>;
}
```

3. **إنشاء صفحة:**

```typescript
// src/app/[locale]/(control-panel)/new-section/page.tsx
import NewSectionView from 'src/sections/admin-dashboard/new-section/list-view';

export default function NewSectionPage() {
  return <NewSectionView />;
}
```

4. **إضافة المسار:**

```typescript
// في src/routes/paths.ts
dashboard: {
  newSection: {
    list: '/new-section',
  }
}
```

5. **إضافة الملاحة:**

```typescript
// في src/layouts/dashboard/config-navigation.tsx
{
  title: 'القسم الجديد',
  path: paths.dashboard.newSection.list,
  icon: ICONS.navbar.products,
}
```

## 7️⃣ استخدام Mock Data

### الوصول إلى البيانات:

```typescript
import { _dashboardUsers } from 'src/_mock/_dashboard-users';

// استخدام البيانات
const users = _dashboardUsers;
```

### إنشاء Mock Data جديد:

```typescript
// src/_mock/_new-data.ts
import { _mock } from './_mock';

export const _newData = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  // ... المزيد من الخصائص
}));
```

## 8️⃣ البناء والنشر

### بناء المشروع:

```bash
# بناء الإنتاج
pnpm build

# اختبار الإنتاج محلياً
pnpm start
```

### النشر:

يمكن نشر المشروع على:

- Vercel
- Netlify
- AWS
- أي خادم يدعم Node.js

## 9️⃣ الأخطاء الشائعة وحلولها

### ❌ خطأ: الصفحة لا تحمل

**الحل:** تأكد من:

- أن ملف `page.tsx` موجود في المجلد
- أن المسار صحيح في `paths.ts`
- أن المكون يُصدر بشكل صحيح

### ❌ خطأ: عدم ظهور البيانات

**الحل:**

- تحقق من import `_mock` data
- تأكد من أن البيانات موجودة في الـ component
- استخدم console.log للتصحيح

### ❌ خطأ: الأيقونات لا تظهر

**الحل:**

- تأكد من وجود الأيقونة في `src/config-icons.tsx`
- استخدم أيقونة موجودة أخرى بدلاً منها

## 🔟 الموارد الإضافية

- [توثيق Next.js](https://nextjs.org/docs)
- [توثيق Material-UI](https://mui.com)
- [توثيق TypeScript](https://www.typescriptlang.org/docs)
- [توثيق next-intl](https://next-intl-docs.vercel.app)

## 📞 الدعم والمساعدة

إذا واجهت مشكلة:

1. تحقق من رسالة الخطأ في Terminal
2. ابحث عن الحل في التوثيق
3. جرب إعادة تثبيت المتطلبات: `pnpm install`
4. امسح ذاكرة التخزين المؤقتة: `rm -rf .next`

---

**استمتع بالتطوير! 🎉**
