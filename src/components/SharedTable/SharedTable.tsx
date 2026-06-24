'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import useTable from './use-table';
import TableNoData from './table-no-data';
import { SharedTableProps } from './types';
import { DEFAULT_LIMIT } from '../constant';
import SharedTableRow from './SharedTableRow';
import TableHeadCustom from './table-head-custom';
import TablePaginationCustom from './table-pagination-custom';

export default function SharedTable<T extends { id: string }>({
  data = [],
  actions,
  tableHead,
  showPagination = false,
  customRender,
  count,
}: SharedTableProps<T>) {
  const table = useTable();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const hasPage = searchParams.get('page');
  const page = hasPage ? Number(searchParams.get('page')) - 1 : 0;
  const limit = Number(searchParams.get('limit')) || DEFAULT_LIMIT;

  const dense = table.dense;

  return (
    <div className="w-full p-3 border-0 outline-none ring-0 shadow-none">
      <div className="w-full overflow-x-auto overflow-y-hidden relative border-0 outline-none ring-0 shadow-none bg-white dark:bg-[#212B36]">
        <table className="w-full text-sm text-start border-collapse border-spacing-0 border-0 outline-none ring-0 shadow-none">
          <TableHeadCustom headLabel={tableHead} enableActions={!!actions?.length} />

          <tbody>
            {data.map((row) => (
              <SharedTableRow<T>
                key={row.id}
                row={row}
                actions={actions}
                customRender={customRender}
                dense={dense}
                headIds={
                  tableHead
                    .map((x) => x.id)
                    .filter((x) => x !== '' && x !== 'rowsActions') as (keyof T)[]
                }
                headLabel={tableHead}
              />
            ))}

            <TableNoData notFound={!data.length} />
          </tbody>
        </table>
      </div>

      {showPagination && (
        <TablePaginationCustom
          count={count}
          page={page}
          rowsPerPage={limit}
          onPageChange={table.onChangePage!}
          onRowsPerPageChange={(e) => table.onChangeRowsPerPage!(e as any)}
          dense={dense}
          onChangeDense={table.onChangeDense}
        />
      )}
    </div>
  );
}
