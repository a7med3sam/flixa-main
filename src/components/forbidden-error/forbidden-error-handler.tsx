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
    <div className="w-full bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-900/50 p-4 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="shrink-0 p-2 bg-red-100 dark:bg-red-800/30 rounded-lg text-red-600 dark:text-red-400">
            <Iconify icon="solar:shield-warning-bold-duotone" width={24} />
          </div>
          <div className="flex flex-col">
            <h4>
              تم رفض الوصول
            </h4>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1 mb-0 font-medium">
              عفوا، ليس لديك الصلاحيات الكاملة للقيام بهذا الإجراء. يرجى مراجعة مدير النظام.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShow(false)}
          className="shrink-0 p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50 rounded-lg transition-colors border-none bg-transparent cursor-pointer outline-none"
          title="إخفاء التحذير"
        >
          <Iconify icon="eva:close-fill" width={20} />
        </button>
      </div>
    </div>
  );
}
