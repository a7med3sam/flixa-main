'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { TableProps } from './types';

// ----------------------------------------------------------------------

type ReturnType = TableProps;

export type UseTableProps = {
  defaultDense?: boolean;
};

export default function useTable(props?: UseTableProps): Partial<ReturnType> {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dense, setDense] = useState(!!props?.defaultDense);

  // 🔹 Preserve filters while changing page
  const onChangePage = useCallback(
    (_event: unknown, newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(newPage + 1));
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // 🔹 Preserve filters while changing limit
  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newLimit = event.target.value;
      const params = new URLSearchParams(searchParams.toString());
      params.set('limit', newLimit);
      params.set('page', '1'); // reset to first page
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // 🔹 Toggle table density
  const onChangeDense = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  }, []);

  return {
    dense,
    onChangePage,
    onChangeRowsPerPage,
    onChangeDense,
    setDense,
  };
}
