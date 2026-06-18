import { IconButton } from '@mui/material';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';

import CustomPopover from '../custom-popover';
import { usePopover } from '../custom-popover';
import { SxStyle, SharedTableRowProps } from './types';

export default function SharedTableRow<T extends { id: string }>({
  row,
  actions,
  customRender,
  headIds,
}: SharedTableRowProps<T>) {
  const t = useTranslations();
  let rowStyle: SxStyle = {};

  if (Object.hasOwn(row, 'rowSx')) {
    rowStyle = (row as any).rowSx as SxStyle;
  }
  const popover = usePopover();

  return (
    <>
      <TableRow hover sx={rowStyle}>
        {headIds.map((x, index) => (
          <TableCell key={index} sx={{ whiteSpace: 'nowrap' }}>
            {customRender && x in customRender ? customRender[x]!(row) : (row as any)[x]}
          </TableCell>
        ))}

        {!!actions?.length && (
          <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>

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
              <ListItemText>{t(action.label)}</ListItemText>
            </MenuItem>
          ))}
      </CustomPopover>
    </>
  );
}
