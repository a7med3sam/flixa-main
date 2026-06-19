import { useTranslations } from 'next-intl';
import { headCellType } from './types';

type Props = {
  headLabel: headCellType[];
  enableActions?: boolean;
};

export default function TableHeadCustom({ headLabel, enableActions = false }: Props) {
  const t = useTranslations();

  const getAlignmentClass = (align?: string) => {
    if (align === 'right') return 'text-end';
    if (align === 'center') return 'text-center';
    return 'text-start';
  };

  return (
    <thead className="bg-grey-100 dark:bg-grey-800 border-b border-solid border-grey-200 dark:border-grey-700">
      <tr>
        {headLabel.map((headCell) => (
          <th
            key={headCell.id}
            className={`px-6 py-4 text-xs font-semibold text-grey-500 dark:text-grey-400 tracking-wider whitespace-nowrap uppercase ${getAlignmentClass(
              headCell.align
            )}`}
            style={{ width: headCell.width }}
          >
            {headCell?.label ? t(headCell?.label) : ''}
          </th>
        ))}
        {enableActions && <th className="px-6 py-4 whitespace-nowrap" />}
      </tr>
    </thead>
  );
}
