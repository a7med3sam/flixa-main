export const CARD_SX = {
  bgcolor: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: "16px",
  boxShadow: "none",
  p: 2.5,
} as const;

export const PERIOD_TABS = ["اليوم", "أسبوعي", "شهري"] as const;

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const CHART_MONTHS = [20, 35, 28, 45, 52, 38, 55, 48, 62, 58, 72, 68];
export const CHART_MONTHS_SECOND = [15, 28, 22, 38, 42, 32, 48, 40, 55, 50, 65, 60];
export const CHART_BARS = [30, 42, 35, 50, 58, 45, 62, 55, 70, 65, 78, 72];
export const CHART_LINE = [25, 38, 32, 48, 55, 42, 58, 52, 68, 62, 75, 70];

export const STATS_ROW_1 = [
  {
    title: "العروض النشطة",
    value: "24",
    trend: { value: "+12%", positive: true },
    icon: "solar:tag-bold",
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
  },
  {
    title: "إجمالي العملاء",
    value: "3,205",
    icon: "solar:users-group-rounded-bold",
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
  },
  {
    title: "إجمالي الفروع",
    value: "8",
    icon: "solar:shop-bold",
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
  },
  {
    title: "استخدام الأكواد اليوم",
    value: "142",
    trend: { value: "+5%", positive: true },
    icon: "solar:qr-code-bold",
    iconBg: "#FFF7ED",
    iconColor: "#EA580C",
  },
] as const;

export const STATS_ROW_2 = [
  {
    title: "الاستخدام الشهري",
    value: "856",
    trend: { value: "-3%", positive: false },
    icon: "solar:chart-bold",
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
  },
  {
    title: "الأكواد المتبقية",
    value: "568",
    icon: "solar:ticket-bold",
    iconBg: "#FEF2F2",
    iconColor: "#DC2626",
  },
  {
    title: "أيام الاشتراك المتبقية",
    value: "14",
    badge: "تجديد قريب",
    icon: "solar:calendar-bold",
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
  },
  {
    title: "رصيد المحفظة",
    value: "4,250 ر.س",
    icon: "solar:wallet-bold",
    iconBg: "#FEF2F2",
    iconColor: "#DC2626",
  },
] as const;

export const NOTIFICATIONS = [
  {
    id: "1",
    title: "عرض جديد بانتظار الموافقة",
    description: 'تم إرسال عرض "خصم 30%" للمراجعة',
    time: "منذ 10 دقائق",
    icon: "solar:document-add-bold",
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
  },
  {
    id: "2",
    title: "الأكواد على وشك الانتهاء",
    description: "تبقى 50 كوداً في فرع العليا",
    time: "منذ ساعتين",
    icon: "solar:danger-triangle-bold",
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
  },
  {
    id: "3",
    title: "تم تجديد الاشتراك",
    description: "تم تجديد باقتك بنجاح حتى 2027",
    time: "منذ يوم",
    icon: "solar:check-circle-bold",
    iconBg: "#ECFDF3",
    iconColor: "#027A48",
  },
  {
    id: "4",
    title: "تم تفعيل فرع جديد",
    description: 'فرع "التحلية" أصبح نشطاً',
    time: "منذ يومين",
    icon: "solar:shop-bold",
    iconBg: "#FEF2F2",
    iconColor: "#DC2626",
  },
] as const;

export const TOP_OFFERS = [
  {
    id: "1",
    name: "خصم 30% على المشروبات",
    branch: "فرع التحلية",
    usage: 245,
    status: "active" as const,
  },
  {
    id: "2",
    name: "وجبة مجانية",
    branch: "فرع العليا",
    usage: 189,
    status: "active" as const,
  },
  {
    id: "3",
    name: "خصم 20%",
    branch: "فرع النخيل",
    usage: 156,
    status: "expired" as const,
  },
  {
    id: "4",
    name: "عرض العائلة",
    branch: "فرع الياسمين",
    usage: 134,
    status: "active" as const,
  },
] as const;

export const BRANCH_PERFORMANCE = [
  { name: "فرع التحلية", value: 850 },
  { name: "فرع العليا", value: 720 },
  { name: "فرع النخيل", value: 580 },
  { name: "فرع الياسمين", value: 420 },
  { name: "فرع الملقا", value: 280 },
] as const;

export const BRANCH_BAR_COLORS = [
  "#C2410C",
  "#EA580C",
  "#FB923C",
  "#38BDF8",
  "#94A3B8",
];
