'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Iconify from 'src/components/iconify';

export default function ForbiddenErrorHandler() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShow(false);
  }, [pathname]);

  useEffect(() => {
    const handleForbidden = () => {
      setShow(true);
    };

    window.addEventListener('forbidden_error', handleForbidden);

    return () => {
      window.removeEventListener('forbidden_error', handleForbidden);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="w-full bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-900/50 rounded-lg py-2 px-4 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="shrink-0 p-1.5 bg-red-100 dark:bg-red-800/30 rounded-md text-red-600 dark:text-red-400">
          <Iconify icon="solar:shield-warning-bold-duotone" width={18} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-red-800 dark:text-red-300 leading-none">
            تم رفض الوصول
          </span>
          <span className="text-xs text-red-600 dark:text-red-400 font-medium">
            — عفوا، ليس لديك الصلاحيات الكاملة للقيام بهذا الإجراء. يرجى مراجعة مدير النظام.
          </span>
        </div>
      </div>
    </div>
  );
}
