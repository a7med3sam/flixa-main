import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTranslations } from 'next-intl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { ConfirmDialogProps } from './types';

// ----------------------------------------------------------------------

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  ...other
}: ConfirmDialogProps) {
  const t = useTranslations();
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && (
        <DialogContent sx={{ typography: 'body2', overflow: 'visible' }}> {content} </DialogContent>
      )}

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('Global.Action.cancel')}
        </Button>

        {action}
      </DialogActions>
    </Dialog>
  );
}
