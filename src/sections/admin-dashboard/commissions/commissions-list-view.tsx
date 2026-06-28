// // 'use client';

// // import { useState } from 'react';
// // import { useTranslations } from 'next-intl';
// // import { m, AnimatePresence } from 'framer-motion';
// // import {
// //   _commissionsList,
// //   COMMISSION_TYPE_OPTIONS,
// //   COMMISSION_STATUS_OPTIONS,
// // } from 'src/_mock/_dashboard-commissions';
// // import Iconify from 'src/components/iconify';

// // type DashboardCommission = (typeof _commissionsList)[number];

// // const STATUS_COLORS: Record<string, string> = {
// //   active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
// //   inactive: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
// //   pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
// // };

// // export default function CommissionsListView() {
// //   const t = useTranslations();
// //   // Using the first 4 for the demo since they represent unique commission categories
// //   const [commissions, setCommissions] = useState(_commissionsList.slice(0, 4)); 
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [editingId, setEditingId] = useState<string | null>(null);

// //   const filteredCommissions = commissions.filter((c) =>
// //     c.name.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   const handleEditToggle = (id: string) => {
// //     setEditingId(editingId === id ? null : id);
// //   };

// //   const handleSave = (id: string, newRate: string, newType: string, newStatus: string) => {
// //     setCommissions((prev) =>
// //       prev.map((c) => (c.id === id ? { ...c, rate: newRate, type: newType, status: newStatus } : c))
// //     );
// //     setEditingId(null);
// //   };

// //   return (
// //     <div className="p-6 max-w-7xl mx-auto min-h-screen">
// //       {/* Header Section */}
// //       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
// //         <div className="space-y-1">
// //           <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
// //             إعدادات العمولات
// //           </h1>
// //           <p className="text-grey-500 dark:text-grey-400 font-medium">
// //             قم بإدارة وتعديل نسب العمولات للتطبيق بسهولة
// //           </p>
// //         </div>

// //         {/* Search */}
// //         <div className="relative group w-full md:w-80">
// //           <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-grey-400 group-focus-within:text-primary transition-colors">
// //             <Iconify icon="solar:magnifer-linear" className="w-5 h-5" />
// //           </div>
// //           <input
// //             type="text"
// //             placeholder="ابحث عن عمولة..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="w-full h-12 ps-12 pe-4 rounded-2xl border border-solid border-grey-200 dark:border-grey-800 bg-white dark:bg-[#212B36] text-sm text-grey-800 dark:text-white placeholder:text-grey-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
// //           />
// //         </div>
// //       </div>

// //       {/* Cards Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
// //         <AnimatePresence>
// //           {filteredCommissions.map((commission, index) => (
// //             <CommissionCard
// //               key={commission.id}
// //               commission={commission}
// //               isEditing={editingId === commission.id}
// //               onToggleEdit={() => handleEditToggle(commission.id)}
// //               onSave={handleSave}
// //               index={index}
// //             />
// //           ))}
// //         </AnimatePresence>
// //       </div>

// //       {filteredCommissions.length === 0 && (
// //         <div className="flex flex-col items-center justify-center py-20">
// //           <Iconify icon="solar:folder-error-broken" className="w-24 h-24 text-grey-300 dark:text-grey-700 mb-4" />
// //           <p className="text-lg text-grey-500 dark:text-grey-400">لا توجد عمولات مطابقة للبحث</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function CommissionCard({
// //   commission,
// //   isEditing,
// //   onToggleEdit,
// //   onSave,
// //   index,
// // }: {
// //   commission: DashboardCommission;
// //   isEditing: boolean;
// //   onToggleEdit: () => void;
// //   onSave: (id: string, rate: string, type: string, status: string) => void;
// //   index: number;
// // }) {
// //   const [editRate, setEditRate] = useState(commission.rate);
// //   const [editType, setEditType] = useState(commission.type);
// //   const [editStatus, setEditStatus] = useState(commission.status);

// //   const handleSave = () => {
// //     onSave(commission.id, editRate, editType, editStatus);
// //   };

// //   const handleCancel = () => {
// //     setEditRate(commission.rate);
// //     setEditType(commission.type);
// //     setEditStatus(commission.status);
// //     onToggleEdit();
// //   };

// //   return (
// //     <m.div
// //       layout
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       exit={{ opacity: 0, scale: 0.9 }}
// //       transition={{ duration: 0.3, delay: index * 0.1 }}
// //       className="relative overflow-hidden bg-white dark:bg-[#212B36] rounded-[2rem] border border-solid border-grey-100 dark:border-grey-800 shadow-xl shadow-grey-200/40 dark:shadow-black/20 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
// //     >
// //       {/* Decorative Gradient Blob */}
// //       <div className="absolute -top-24 -end-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

// //       <div className="p-8 relative z-10">
// //         <div className="flex justify-between items-start mb-6">
// //           <div className="flex items-center gap-4">
// //             <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
// //               <Iconify icon="solar:wallet-money-bold-duotone" className="w-7 h-7" />
// //             </div>
// //             <div>
// //               <h3 className="text-lg font-bold text-grey-900 dark:text-white mb-1">
// //                 {commission.name}
// //               </h3>
// //               <span
// //                 className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border border-solid ${
// //                   STATUS_COLORS[commission.status] || STATUS_COLORS.inactive
// //                 }`}
// //               >
// //                 {COMMISSION_STATUS_OPTIONS.find((s) => s.value === commission.status)?.label ||
// //                   commission.status}
// //               </span>
// //             </div>
// //           </div>

// //           <button
// //             onClick={isEditing ? handleCancel : onToggleEdit}
// //             className={`flex items-center justify-center w-10 h-10 rounded-full border border-solid transition-all duration-300 shadow-sm ${
// //               isEditing 
// //                 ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-red-500/30' 
// //                 : 'border-grey-200 dark:border-grey-700 bg-white dark:bg-grey-800 text-grey-600 dark:text-grey-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-primary/30'
// //             }`}
// //           >
// //             <Iconify icon={isEditing ? 'solar:close-circle-linear' : 'solar:pen-linear'} className="w-5 h-5" />
// //           </button>
// //         </div>

// //         <AnimatePresence mode="wait">
// //           {!isEditing ? (
// //             <m.div
// //               key="view"
// //               initial={{ opacity: 0, x: -20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: 20 }}
// //               transition={{ duration: 0.2 }}
// //             >
// //               <div className="flex items-baseline gap-2 mb-8">
// //                 <span className="text-5xl font-black text-grey-900 dark:text-white tracking-tight">
// //                   {commission.rate}
// //                 </span>
// //                 <span className="text-xl font-semibold text-grey-400">
// //                   {commission.type === 'percentage' ? '%' : 'ريال'}
// //                 </span>
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="bg-grey-50 dark:bg-grey-800/50 p-4 rounded-2xl border border-solid border-grey-100 dark:border-grey-700/50">
// //                   <p className="text-xs text-grey-500 mb-1">الحد الأدنى</p>
// //                   <p className="font-bold text-grey-900 dark:text-white">{commission.minAmount} ريال</p>
// //                 </div>
// //                 <div className="bg-grey-50 dark:bg-grey-800/50 p-4 rounded-2xl border border-solid border-grey-100 dark:border-grey-700/50">
// //                   <p className="text-xs text-grey-500 mb-1">الحد الأقصى</p>
// //                   <p className="font-bold text-grey-900 dark:text-white">{commission.maxAmount} ريال</p>
// //                 </div>
// //               </div>
// //             </m.div>
// //           ) : (
// //             <m.div
// //               key="edit"
// //               initial={{ opacity: 0, x: 20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -20 }}
// //               transition={{ duration: 0.2 }}
// //               className="space-y-5"
// //             >
// //               <div>
// //                 <label className="block text-sm font-semibold text-grey-700 dark:text-grey-300 mb-2">
// //                   قيمة العمولة
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     type="number"
// //                     value={editRate}
// //                     onChange={(e) => setEditRate(e.target.value)}
// //                     className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 text-grey-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
// //                   />
// //                   <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
// //                     <span className="text-grey-400 font-medium">
// //                       {editType === 'percentage' ? '%' : 'SAR'}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-semibold text-grey-700 dark:text-grey-300 mb-2">
// //                     نوع العمولة
// //                   </label>
// //                   <select
// //                     value={editType}
// //                     onChange={(e) => setEditType(e.target.value)}
// //                     className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 text-grey-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
// //                   >
// //                     {COMMISSION_TYPE_OPTIONS.map((opt) => (
// //                       <option key={opt.value} value={opt.value}>
// //                         {opt.label}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-semibold text-grey-700 dark:text-grey-300 mb-2">
// //                     الحالة
// //                   </label>
// //                   <select
// //                     value={editStatus}
// //                     onChange={(e) => setEditStatus(e.target.value)}
// //                     className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 text-grey-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
// //                   >
// //                     {COMMISSION_STATUS_OPTIONS.map((opt) => (
// //                       <option key={opt.value} value={opt.value}>
// //                         {opt.label}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               </div>

// //               <button
// //                 onClick={handleSave}
// //                 className="w-full h-12 mt-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
// //               >
// //                 <Iconify icon="solar:check-circle-bold" className="w-5 h-5" />
// //                 حفظ التغييرات
// //               </button>
// //             </m.div>
// //           )}
// //         </AnimatePresence>
// //       </div>
// //     </m.div>
// //   );
// // }
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useTranslations } from 'next-intl';
// import { m, AnimatePresence } from 'framer-motion';
// import axios from 'src/utils/axios';
// import { endpoints } from 'src/utils/endpoints';
// import { useSnackbar } from 'notistack';
// import Iconify from 'src/components/iconify';

// // ----------------------------------------------------------------------
// // Types
// // ----------------------------------------------------------------------

// interface CommissionSetting {
//   commissionValue: number;
//   commissionType: 'Percentage' | 'Fixed';
//   isCommissionEnabled: boolean;
// }

// // Extended type for UI display
// interface CommissionDisplay extends CommissionSetting {
//   id: string;
//   name: string;
//   status: string;
//   minAmount: string;
//   maxAmount: string;
// }

// // ----------------------------------------------------------------------
// // Constants
// // ----------------------------------------------------------------------

// const COMMISSION_TYPE_OPTIONS = [
//   { value: 'Percentage', label: 'نسبة مئوية' },
//   { value: 'Fixed', label: 'قيمة ثابتة' },
// ];

// const COMMISSION_STATUS_OPTIONS = [
//   { value: 'active', label: 'نشط' },
//   { value: 'inactive', label: 'غير نشط' },
// ];

// const STATUS_COLORS: Record<string, string> = {
//   active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
//   inactive: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
// };

// // ----------------------------------------------------------------------

// export default function CommissionsListView() {
//   const t = useTranslations();
//   const { enqueueSnackbar } = useSnackbar();

//   const [loading, setLoading] = useState(true);
//   const [commission, setCommission] = useState<CommissionSetting | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editingId, setEditingId] = useState<string | null>(null);

//   // ──────────────────────────────────────────────
//   // Fetch commission settings from API
//   // ──────────────────────────────────────────────
//   const fetchCommissionSettings = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get<CommissionSetting>(endpoints.AdminCommissionSettings.list);
//       setCommission(res.data);
//     } catch (err: any) {
//       enqueueSnackbar(err?.message || 'Failed to load commission settings', { variant: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   }, [enqueueSnackbar]);

//   useEffect(() => {
//     fetchCommissionSettings();
//   }, [fetchCommissionSettings]);

//   // ──────────────────────────────────────────────
//   // Transform API data to display format
//   // ──────────────────────────────────────────────
//   const transformToDisplay = (data: CommissionSetting | null): CommissionDisplay[] => {
//     if (!data) return [];

//     return [
//       {
//         id: '1',
//         name: t('Pages.Commissions.automatic_payment_commission') || 'عمولة الدفع الآلي',
//         commissionValue: data.commissionValue,
//         commissionType: data.commissionType,
//         isCommissionEnabled: data.isCommissionEnabled,
//         status: data.isCommissionEnabled ? 'active' : 'inactive',
//         minAmount: '0',
//         maxAmount: '5000',
//       },
//     ];
//   };

//   const displayData = transformToDisplay(commission);

//   // ──────────────────────────────────────────────
//   // Update commission settings
//   // ──────────────────────────────────────────────
//   const handleUpdateCommission = async (
//     id: string,
//     value: number,
//     type: string,
//     status: string
//   ) => {
//     try {
//       const payload = {
//         commissionValue: value,
//         commissionType: type as 'Percentage' | 'Fixed',
//         isCommissionEnabled: status === 'active',
//       };

//       // TODO: Replace with actual update endpoint
//       // await axios.put(endpoints.AdminCommissionSettings.update, payload);

//       // Simulate success
//       setCommission(payload);
//       enqueueSnackbar('تم تحديث إعدادات العمولة بنجاح', { variant: 'success' });
//       setEditingId(null);
//     } catch (err: any) {
//       enqueueSnackbar(err?.message || 'Failed to update commission', { variant: 'error' });
//     }
//   };

//   // ──────────────────────────────────────────────
//   // Filter and search
//   // ──────────────────────────────────────────────
//   const filteredCommissions = displayData.filter((c) =>
//     c.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // ──────────────────────────────────────────────
//   // Loading state
//   // ──────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="p-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//           <p className="text-grey-500 dark:text-grey-400">
//             {t('Global.Loading.loading') || 'جاري التحميل...'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ──────────────────────────────────────────────
//   // Empty state
//   // ──────────────────────────────────────────────
//   if (!commission) {
//     return (
//       <div className="p-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center">
//         <Iconify icon="solar:folder-error-broken" className="w-24 h-24 text-grey-300 dark:text-grey-700 mb-4" />
//         <p className="text-lg text-grey-500 dark:text-grey-400">لا توجد بيانات عمولة</p>
//       </div>
//     );
//   }

//   // ──────────────────────────────────────────────
//   // Render
//   // ──────────────────────────────────────────────
//   return (
//     <div className="p-6 max-w-7xl mx-auto min-h-screen">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
//         <div className="space-y-1">
//           <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
//             {t('Pages.Commissions.title') || 'إعدادات العمولات'}
//           </h1>
//           <p className="text-grey-500 dark:text-grey-400 font-medium">
//             {t('Pages.Commissions.subtitle') || 'قم بإدارة وتعديل نسب العمولات للتطبيق بسهولة'}
//           </p>
//         </div>

//         {/* Search */}
//         <div className="relative group w-full md:w-80">
//           <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-grey-400 group-focus-within:text-primary transition-colors">
//             <Iconify icon="solar:magnifer-linear" className="w-5 h-5" />
//           </div>
//           <input
//             type="text"
//             placeholder={t('Pages.Commissions.search_placeholder') || 'ابحث عن عمولة...'}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full h-12 ps-12 pe-4 rounded-2xl border border-solid border-grey-200 dark:border-grey-800 bg-white dark:bg-[#212B36] text-sm text-grey-800 dark:text-white placeholder:text-grey-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
//           />
//         </div>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
//         <AnimatePresence>
//           {filteredCommissions.map((item, index) => (
//             <CommissionCard
//               key={item.id}
//               commission={item}
//               isEditing={editingId === item.id}
//               onToggleEdit={() => setEditingId(editingId === item.id ? null : item.id)}
//               onSave={handleUpdateCommission}
//               index={index}
//             />
//           ))}
//         </AnimatePresence>
//       </div>

//       {filteredCommissions.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-20">
//           <Iconify icon="solar:folder-error-broken" className="w-24 h-24 text-grey-300 dark:text-grey-700 mb-4" />
//           <p className="text-lg text-grey-500 dark:text-grey-400">لا توجد عمولات مطابقة للبحث</p>
//         </div>
//       )}
//     </div>
//   );
// }

// // ----------------------------------------------------------------------
// // Commission Card Component
// // ----------------------------------------------------------------------

// function CommissionCard({
//   commission,
//   isEditing,
//   onToggleEdit,
//   onSave,
//   index,
// }: {
//   commission: CommissionDisplay;
//   isEditing: boolean;
//   onToggleEdit: () => void;
//   onSave: (id: string, value: number, type: string, status: string) => void;
//   index: number;
// }) {
//   const [editValue, setEditValue] = useState(commission.commissionValue.toString());
//   const [editType, setEditType] = useState(commission.commissionType);
//   const [editStatus, setEditStatus] = useState(commission.status);

//   const handleSave = () => {
//     onSave(
//       commission.id,
//       parseFloat(editValue) || 0,
//       editType,
//       editStatus
//     );
//   };

//   const handleCancel = () => {
//     setEditValue(commission.commissionValue.toString());
//     setEditType(commission.commissionType);
//     setEditStatus(commission.status);
//     onToggleEdit();
//   };

//   const statusLabel = COMMISSION_STATUS_OPTIONS.find((s) => s.value === commission.status)?.label || commission.status;
//   const typeLabel = COMMISSION_TYPE_OPTIONS.find((t) => t.value === commission.commissionType)?.label || commission.commissionType;

//   return (
//     <m.div
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       transition={{ duration: 0.3, delay: index * 0.1 }}
//       className="relative overflow-hidden bg-white dark:bg-[#212B36] rounded-[2rem] border border-solid border-grey-100 dark:border-grey-800 shadow-xl shadow-grey-200/40 dark:shadow-black/20 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
//     >
//       {/* Decorative Gradient Blob */}
//       <div className="absolute -top-24 -end-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

//       <div className="p-8 relative z-10">
//         <div className="flex justify-between items-start mb-6">
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
//               <Iconify icon="solar:wallet-money-bold-duotone" className="w-7 h-7" />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold text-grey-900 dark:text-white mb-1">
//                 {commission.name}
//               </h3>
//               <span
//                 className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border border-solid ${STATUS_COLORS[commission.status] || STATUS_COLORS.inactive
//                   }`}
//               >
//                 {statusLabel}
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={isEditing ? handleCancel : onToggleEdit}
//             className={`flex items-center justify-center w-10 h-10 rounded-full border border-solid transition-all duration-300 shadow-sm ${isEditing
//                 ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-red-500/30'
//                 : 'border-grey-200 dark:border-grey-700 bg-white dark:bg-grey-800 text-grey-600 dark:text-grey-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-primary/30'
//               }`}
//           >
//             <Iconify icon={isEditing ? 'solar:close-circle-linear' : 'solar:pen-linear'} className="w-5 h-5" />
//           </button>
//         </div>

//         <AnimatePresence mode="wait">
//           {!isEditing ? (
//             <m.div
//               key="view"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 20 }}
//               transition={{ duration: 0.2 }}
//             >
//               <div className="flex items-baseline gap-2 mb-8">
//                 <span className="text-5xl font-black text-grey-900 dark:text-white tracking-tight">
//                   {commission.commissionValue}
//                 </span>
//                 <span className="text-xl font-semibold text-grey-400">
//                   {commission.commissionType === 'Percentage' ? '%' : 'ريال'}
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-grey-50 dark:bg-grey-800/50 p-4 rounded-2xl border border-solid border-grey-100 dark:border-grey-700/50">
//                   <p className="text-xs text-grey-500 mb-1">الحد الأدنى</p>
//                   <p className="font-bold text-grey-900 dark:text-white">{commission.minAmount} ريال</p>
//                 </div>
//                 <div className="bg-grey-50 dark:bg-grey-800/50 p-4 rounded-2xl border border-solid border-grey-100 dark:border-grey-700/50">
//                   <p className="text-xs text-grey-500 mb-1">الحد الأقصى</p>
//                   <p className="font-bold text-grey-900 dark:text-white">{commission.maxAmount} ريال</p>
//                 </div>
//               </div>

//               {/* Type badge */}
//               <div className="mt-4 flex justify-end">
//                 <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">
//                   {typeLabel}
//                 </span>
//               </div>
//             </m.div>
//           ) : (
//             <m.div
//               key="edit"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.2 }}
//               className="space-y-5"
//             >
//               <div>
//                 <label className="block text-sm font-semibold text-grey-700 dark:text-grey-300 mb-2">
//                   قيمة العمولة
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     value={editValue}
//                     onChange={(e) => setEditValue(e.target.value)}
//                     className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 text-grey-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
//                   />
//                   <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
//                     <span className="text-grey-400 font-medium">
//                       {editType === 'Percentage' ? '%' : 'SAR'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-grey-700 dark:text-grey-300 mb-2">
//                     نوع العمولة
//                   </label>
//                   <select
//                     value={editType}
//                     onChange={(e) => setEditType(e.target.value)}
//                     className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 text-grey-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
//                   >
//                     {COMMISSION_TYPE_OPTIONS.map((opt) => (
//                       <option key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-grey-700 dark:text-grey-300 mb-2">
//                     الحالة
//                   </label>
//                   <select
//                     value={editStatus}
//                     onChange={(e) => setEditStatus(e.target.value)}
//                     className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 text-grey-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
//                   >
//                     {COMMISSION_STATUS_OPTIONS.map((opt) => (
//                       <option key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <button
//                 onClick={handleSave}
//                 className="w-full h-12 mt-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
//               >
//                 <Iconify icon="solar:check-circle-bold" className="w-5 h-5" />
//                 حفظ التغييرات
//               </button>
//             </m.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </m.div>
//   );
// }
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { m, AnimatePresence } from 'framer-motion';
import axios from 'src/utils/axios';
import { endpoints } from 'src/utils/endpoints';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface CommissionSetting {
  commissionValue: number;
  commissionType: 'Percentage' | 'Fixed';
  isCommissionEnabled: boolean;
}

// Extended type for UI display
interface CommissionDisplay extends CommissionSetting {
  id: string;
  name: string;
  status: string;
  minAmount: string;
  maxAmount: string;
}

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------

const COMMISSION_TYPE_OPTIONS = [
  { value: 'Percentage' as const, label: 'نسبة مئوية' },
  { value: 'Fixed' as const, label: 'قيمة ثابتة' },
];

const COMMISSION_STATUS_OPTIONS = [
  { value: 'active' as const, label: 'نشط' },
  { value: 'inactive' as const, label: 'غير نشط' },
];

type CommissionType = 'Percentage' | 'Fixed';
type CommissionStatus = 'active' | 'inactive';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  inactive: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
};

// ----------------------------------------------------------------------

export default function CommissionsListView() {
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [commission, setCommission] = useState<CommissionSetting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // ──────────────────────────────────────────────
  // Fetch commission settings from API
  // ──────────────────────────────────────────────
  const fetchCommissionSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<CommissionSetting>(endpoints.AdminCommissionSettings.list);
      setCommission(res.data);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to load commission settings', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchCommissionSettings();
  }, [fetchCommissionSettings]);

  // ──────────────────────────────────────────────
  // Transform API data to display format
  // ──────────────────────────────────────────────
  const transformToDisplay = (data: CommissionSetting | null): CommissionDisplay[] => {
    if (!data) return [];

    return [
      {
        id: '1',
        name: t('Pages.Commissions.automatic_payment_commission') || 'عمولة الدفع الآلي',
        commissionValue: data.commissionValue,
        commissionType: data.commissionType,
        isCommissionEnabled: data.isCommissionEnabled,
        status: data.isCommissionEnabled ? 'active' : 'inactive',
        minAmount: '0',
        maxAmount: '5000',
      },
    ];
  };

  const displayData = transformToDisplay(commission);

  // ──────────────────────────────────────────────
  // Update commission settings
  // ──────────────────────────────────────────────
  const handleUpdateCommission = async (
    id: string,
    value: number,
    type: CommissionType,
    status: CommissionStatus
  ) => {
    try {
      const payload = {
        commissionValue: value,
        commissionType: type,
        isCommissionEnabled: status === 'active',
      };

      // TODO: Replace with actual update endpoint
      // await axios.put(endpoints.AdminCommissionSettings.update, payload);

      // Simulate success
      setCommission(payload);
      enqueueSnackbar('تم تحديث إعدادات العمولة بنجاح', { variant: 'success' });
      setEditingId(null);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to update commission', { variant: 'error' });
    }
  };

  // ──────────────────────────────────────────────
  // Filter and search
  // ──────────────────────────────────────────────
  const filteredCommissions = displayData.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ──────────────────────────────────────────────
  // Loading state
  // ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-grey-500 dark:text-grey-400">
            {t('Global.Loading.loading') || 'جاري التحميل...'}
          </p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Empty state
  // ──────────────────────────────────────────────
  if (!commission) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center">
        <Iconify icon="solar:folder-error-broken" className="w-24 h-24 text-grey-300 dark:text-grey-700 mb-4" />
        <p className="text-lg text-grey-500 dark:text-grey-400">لا توجد بيانات عمولة</p>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
            {t('Pages.Commissions.title') || 'إعدادات العمولات'}
          </h1>
          <p className="text-grey-500 dark:text-grey-400 font-medium">
            {t('Pages.Commissions.subtitle') || 'قم بإدارة وتعديل نسب العمولات للتطبيق بسهولة'}
          </p>
        </div>

        {/* Search */}
        <div className="relative group w-full md:w-80">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-grey-400 group-focus-within:text-primary transition-colors">
            <Iconify icon="solar:magnifer-linear" className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder={t('Pages.Commissions.search_placeholder') || 'ابحث عن عمولة...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 ps-12 pe-4 rounded-2xl border border-solid border-grey-200 dark:border-grey-800 bg-white dark:bg-[#212B36] text-sm text-grey-800 dark:text-white placeholder:text-grey-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCommissions.map((item, index) => (
            <CommissionCard
              key={item.id}
              commission={item}
              isEditing={editingId === item.id}
              onToggleEdit={() => setEditingId(editingId === item.id ? null : item.id)}
              onSave={handleUpdateCommission}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredCommissions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Iconify icon="solar:folder-error-broken" className="w-24 h-24 text-grey-300 dark:text-grey-700 mb-4" />
          <p className="text-lg text-grey-500 dark:text-grey-400">لا توجد عمولات مطابقة للبحث</p>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Commission Card Component
// ----------------------------------------------------------------------

function CommissionCard({
  commission,
  isEditing,
  onToggleEdit,
  onSave,
  index,
}: {
  commission: CommissionDisplay;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: (id: string, value: number, type: CommissionType, status: CommissionStatus) => void;
  index: number;
}) {
  const [editValue, setEditValue] = useState(commission.commissionValue.toString());
  const [editType, setEditType] = useState<CommissionType>(commission.commissionType);
  const [editStatus, setEditStatus] = useState<CommissionStatus>(commission.status as CommissionStatus);

  const handleSave = () => {
    onSave(
      commission.id,
      parseFloat(editValue) || 0,
      editType,
      editStatus
    );
  };

  const handleCancel = () => {
    setEditValue(commission.commissionValue.toString());
    setEditType(commission.commissionType);
    setEditStatus(commission.status as CommissionStatus);
    onToggleEdit();
  };

  const statusLabel = COMMISSION_STATUS_OPTIONS.find((s) => s.value === commission.status)?.label || commission.status;
  const typeLabel = COMMISSION_TYPE_OPTIONS.find((t) => t.value === commission.commissionType)?.label || commission.commissionType;

  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative overflow-hidden bg-white dark:bg-[#212B36] rounded-[2rem] border border-solid border-grey-100 dark:border-grey-800 shadow-xl shadow-grey-200/40 dark:shadow-black/20 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Decorative Gradient Blob */}
      <div className="absolute -top-24 -end-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

      <div className="p-8 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Iconify icon="solar:wallet-money-bold-duotone" className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-grey-900 dark:text-white mb-1">
                {commission.name}
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border border-solid ${STATUS_COLORS[commission.status] || STATUS_COLORS.inactive
                  }`}
              >
                {statusLabel}
              </span>
            </div>
          </div>

          <button
            onClick={isEditing ? handleCancel : onToggleEdit}
            className={`flex items-center justify-center w-10 h-10 rounded-full border border-solid transition-all duration-300 shadow-sm ${isEditing
              ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-red-500/30'
              : 'border-grey-200 dark:border-grey-700 bg-white dark:bg-grey-800 text-grey-600 dark:text-grey-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-primary/30'
              }`}
          >
            <Iconify icon={isEditing ? 'solar:close-circle-linear' : 'solar:pen-linear'} className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!isEditing ? (
            <m.div
              key="view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-grey-900 dark:text-white tracking-tight">
                  {commission.commissionValue}
                </span>
                <span className="text-xl font-semibold text-grey-400">
                  {commission.commissionType === 'Percentage' ? '%' : 'ريال'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-grey-50 dark:bg-grey-800/50 p-4 rounded-2xl border border-solid border-grey-100 dark:border-grey-700/50">
                  <p className="text-xs text-grey-500 mb-1">الحد الأدنى</p>
                  <p className="font-bold text-grey-900 dark:text-white">{commission.minAmount} ريال</p>
                </div>
                <div className="bg-grey-50 dark:bg-grey-800/50 p-4 rounded-2xl border border-solid border-grey-100 dark:border-grey-700/50">
                  <p className="text-xs text-grey-500 mb-1">الحد الأقصى</p>
                  <p className="font-bold text-grey-900 dark:text-white">{commission.maxAmount} ريال</p>
                </div>
              </div>

              {/* Type badge */}
              <div className="mt-4 flex justify-end">
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">
                  {typeLabel}
                </span>
              </div>
            </m.div>
          ) : (
            <m.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-grey-700 dark:text-grey-300 mb-2">
                  قيمة العمولة
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 text-grey-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                  />
                  <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                    <span className="text-grey-400 font-medium">
                      {editType === 'Percentage' ? '%' : 'SAR'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-grey-700 dark:text-grey-300 mb-2">
                    نوع العمولة
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as CommissionType)}
                    className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 text-grey-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {COMMISSION_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-grey-700 dark:text-grey-300 mb-2">
                    الحالة
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as CommissionStatus)}
                    className="w-full h-12 px-4 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-900 text-grey-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {COMMISSION_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full h-12 mt-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
              >
                <Iconify icon="solar:check-circle-bold" className="w-5 h-5" />
                حفظ التغييرات
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.div>
  );
}