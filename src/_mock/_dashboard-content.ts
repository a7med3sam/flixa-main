import { _mock } from './_mock';

// Content pages
export const CONTENT_PAGES = [
  { value: 'aboutUs', label: 'عن التطبيق' },
  { value: 'termsConditions', label: 'الشروط والأحكام' },
  { value: 'privacyPolicy', label: 'سياسة الخصوصية' },
];

// Content statuses
export const CONTENT_STATUS_OPTIONS = [
  { value: 'published', label: 'منشور' },
  { value: 'draft', label: 'مسودة' },
  { value: 'archived', label: 'مؤرشف' },
];

// Content management list
export const _contentPages = [
  {
    id: '1',
    title: 'عن التطبيق',
    slug: 'about-us',
    language: 'ar',
    status: 'published',
    lastUpdated: _mock.time(0),
    updatedBy: _mock.fullName(0),
    views: 15420,
  },
  {
    id: '2',
    title: 'About Us',
    slug: 'about-us',
    language: 'en',
    status: 'published',
    lastUpdated: _mock.time(1),
    updatedBy: _mock.fullName(1),
    views: 8920,
  },
  {
    id: '3',
    title: 'الشروط والأحكام',
    slug: 'terms-conditions',
    language: 'ar',
    status: 'published',
    lastUpdated: _mock.time(2),
    updatedBy: _mock.fullName(2),
    views: 5320,
  },
  {
    id: '4',
    title: 'Terms & Conditions',
    slug: 'terms-conditions',
    language: 'en',
    status: 'published',
    lastUpdated: _mock.time(3),
    updatedBy: _mock.fullName(3),
    views: 3420,
  },
  {
    id: '5',
    title: 'سياسة الخصوصية',
    slug: 'privacy-policy',
    language: 'ar',
    status: 'published',
    lastUpdated: _mock.time(4),
    updatedBy: _mock.fullName(4),
    views: 12500,
  },
  {
    id: '6',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    language: 'en',
    status: 'published',
    lastUpdated: _mock.time(5),
    updatedBy: _mock.fullName(5),
    views: 7800,
  },
];

const contentData: Record<
  string,
  {
    id: string;
    title: string;
    slug: string;
    language: string;
    status: string;
    content: string;
    metaDescription: string;
    metaKeywords: string;
    lastUpdated: Date;
    updatedBy: string;
    publishedAt: Date;
    views: number;
  }
> = {
  'about-us': {
    id: '1',
    title: 'عن التطبيق',
    slug: 'about-us',
    language: 'ar',
    status: 'published',
    content: `مرحباً بك في تطبيقنا

نحن نقدم أفضل الخدمات والمنتجات ذات الجودة العالية.

تم إنشاء هذا التطبيق لتوفير تجربة تسوق سلسة وآمنة للمستخدمين في جميع أنحاء المملكة.

رؤيتنا
أن نكون المنصة الأولى للتسوق الإلكتروني في المنطقة.

مهمتنا
توفير منتجات وخدمات عالية الجودة بأسعار تنافسية مع ضمان رضا العملاء.

قيمنا
- الجودة: نسعى دائماً لتقديم الأفضل
- الثقة: نبني علاقات طويلة الأمد مع عملائنا
- الابتكار: نتبنى أحدث التقنيات لتطوير خدماتنا
- المسؤولية: نلتزم بأعلى معايير الأمان والخصوصية`,
    metaDescription: 'تعرف على تطبيقنا - أفضل منصة تسوق إلكتروني في المملكة',
    metaKeywords: 'تطبيق، تسوق، خدمات، متجر إلكتروني',
    lastUpdated: _mock.time(0),
    updatedBy: _mock.fullName(0),
    publishedAt: _mock.time(0),
    views: 15420,
  },
  'terms-conditions': {
    id: '3',
    title: 'الشروط والأحكام',
    slug: 'terms-conditions',
    language: 'ar',
    status: 'published',
    content: `الشروط والأحكام

يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام التطبيق.

قبول الشروط
باستخدامك لهذا التطبيق، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يجب عليك عدم استخدام التطبيق.

حساب المستخدم
عند إنشاء حساب على تطبيقنا، يجب عليك تقديم معلومات دقيقة وكاملة. أنت المسؤول الوحيد عن الحفاظ على سرية حسابك وكلمة المرور.

الاستخدام المسموح
توافق على استخدام التطبيق فقط للأغراض القانونية ووفقاً لهذه الشروط. يحظر استخدام التطبيق في أي نشاط غير قانوني.

الملكية الفكرية
جميع المحتويات والمواد المتاحة على التطبيق محمية بموجب قوانين الملكية الفكرية.

تعديل الشروط
نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بالتغييرات الهامة.`,
    metaDescription: 'الشروط والأحكام الخاصة باستخدام تطبيقنا - اقرأ قبل الاستخدام',
    metaKeywords: 'شروط، أحكام، استخدام، سياسة',
    lastUpdated: _mock.time(2),
    updatedBy: _mock.fullName(2),
    publishedAt: _mock.time(1),
    views: 5320,
  },
  'privacy-policy': {
    id: '5',
    title: 'سياسة الخصوصية',
    slug: 'privacy-policy',
    language: 'ar',
    status: 'published',
    content: `سياسة الخصوصية

نحن نأخذ خصوصيتك على محمل الجد. تصف هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.

المعلومات التي نجمعها
نجمع المعلومات التي تقدمها عند إنشاء حساب، بما في ذلك الاسم والبريد الإلكتروني ورقم الهاتف وعنوان التوصيل.

كيف نستخدم معلوماتك
نستخدم معلوماتك لتقديم وتحسين خدماتنا، ومعالجة الطلبات، والتواصل معك بشأن حسابك وطلباتك.

حماية المعلومات
نطبق إجراءات أمنية صارمة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الاستخدام أو الإفصاح.

مشاركة المعلومات
لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا عند الضرورة لتقديم الخدمات أو وفقاً للقانون.

حقوقك
لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها وحذفها في أي وقت.

تحديثات سياسة الخصوصية
قد نقوم بتحديث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات جوهرية.`,
    metaDescription: 'سياسة الخصوصية - كيف نحمي معلوماتك الشخصية',
    metaKeywords: 'خصوصية، أمان، معلومات، حماية',
    lastUpdated: _mock.time(4),
    updatedBy: _mock.fullName(4),
    publishedAt: _mock.time(2),
    views: 12500,
  },
};

// Content detail
export const _contentDetail = (slug: string) => {
  return contentData[slug] || contentData['about-us'];
};
