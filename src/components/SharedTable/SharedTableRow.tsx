import { IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';

import CustomPopover from '../custom-popover';
import { usePopover } from '../custom-popover';
import { SharedTableRowProps } from './types';

export default function SharedTableRow<T extends { id: string }>({
  row,
  actions,
  customRender,
  headIds,
  headLabel,
  dense,
}: SharedTableRowProps<T>) {
  const popover = usePopover();

  const getAlignment = (id: keyof T) => {
    const cell = headLabel.find((h) => h.id === id);
    return cell?.align || 'left';
  };

  const getAlignClass = (align?: string) => {
    if (align === 'right') return 'text-end';
    if (align === 'center') return 'text-center';
    return 'text-start';
  };

  const paddingClass = dense ? 'px-2 py-0.5' : 'px-2 py-1';

  return (
    <>
      <tr className="hover:bg-grey-50 dark:hover:bg-grey-800/50 transition-colors border-b border-solid border-grey-100 dark:border-grey-600">
        {headIds.map((x, index) => (
          <td
            key={index}
            className={`${paddingClass} whitespace-nowrap ${getAlignClass(getAlignment(x))}`}
          >
            {customRender && x in customRender ? customRender[x]!(row) : (row as any)[x]}
          </td>
        ))}

        {!!actions?.length && (
          <td className="px-2 py-1 whitespace-nowrap text-end">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </td>
        )}
      </tr>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ minWidth: 140 }}
      >
        {actions
          ?.filter((action) => (action.hide ? !action.hide(row) : true))
          .map((action, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                action.onClick(row);
                popover.onClose();
              }}
              sx={action.sx}
            >
              <ListItemIcon>{action.icon}</ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          ))}
      </CustomPopover>
    </>
  );
}
