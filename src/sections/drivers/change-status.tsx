import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useTranslations } from 'next-intl';
import { enqueueSnackbar } from 'notistack';
import { endpoints } from 'src/utils/endpoints';
import { editData } from 'src/utils/crud-fetch-api';
import { DriverDetailsType } from 'src/types/driver';
import { FetchTags } from 'src/actions/config-actions';
import { invalidateTag } from 'src/actions/cache-invalidation';
import {
  Grid,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
} from '@mui/material';

interface Props {
    open: boolean;
    onClose: () => void;
    driver: DriverDetailsType;
    onStatusUpdated?: (updatedDriver: DriverDetailsType) => void;
  }
  
  export default function EditDriverStatusDialog({ 
    open, 
    onClose, 
    driver,
    onStatusUpdated 
  }: Props) {
  const t = useTranslations();
  const { id: driverId } = driver || {};
  const [selectedStatus, setSelectedStatus] = useState<string | null>(driver?.status || null);
  const [loading, setLoading] = useState(false);

  // All possible driver statuses
  const DRIVER_STATUS_OPTIONS = [
    { label: t('Pages.Drivers.status.active'), value: 'Active' },
    { label: t('Pages.Drivers.status.blocked'), value: 'Blocked' },
  ];



const handleUpdateStatus = async () => {
    if (!driverId || !selectedStatus) return;
    setLoading(true);
  
      // Construct URL with id in path and status as query parameter
      const url = `${endpoints.drivers.editStatus(driverId)}?status=${selectedStatus}`;
      
      // Send empty body since status is passed in query params
      const res = await editData(url, 'PUT', {});
  
      if ('error' in res) {
        enqueueSnackbar(res.error || 'Failed to update driver status', { variant: 'error' });
      } else {
        enqueueSnackbar(t('Global.Server.Success.var_updated', { var: t('Nav.Users.drivers') }), { variant: 'success' }); // 'Driver status updated successfully') { variant: 'success' });
        onStatusUpdated?.({ ...driver, status: selectedStatus });
        invalidateTag(FetchTags.DriversList); // Make sure this matches your actual tag
        onClose();
      }
    }
      
return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('Pages.Drivers.change_driver_status')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              options={DRIVER_STATUS_OPTIONS}
              value={DRIVER_STATUS_OPTIONS.find((opt) => opt.value === selectedStatus) || null}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('Pages.Drivers.table.status')}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              onChange={(_, value) => setSelectedStatus(value?.value || null)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('Global.Action.cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={handleUpdateStatus}
          disabled={
            !driverId ||
            !selectedStatus ||
            selectedStatus === driver?.status
          }
        >
          {t('Global.Action.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}