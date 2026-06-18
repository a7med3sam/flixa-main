'use client';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { enqueueSnackbar } from 'notistack';
import { Card, Container } from '@mui/material';
import { endpoints } from 'src/utils/endpoints';
import { DeliveryFees } from 'src/types/delivery-fees';
import { FetchTags } from 'src/actions/config-actions';
import { editData, postData } from 'src/utils/crud-fetch-api';
import { invalidateTag } from 'src/actions/cache-invalidation';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DeliveryFeesTable from '../list-table';
import AddDeliveryFeeDialog from './new-delivery-fees';

export default function DeliveryFeesView({
  data,
  totalCount,
}: {
  data: DeliveryFees[];
  totalCount: number;
}) {
  const t = useTranslations();
  const [openDialog, setOpenDialog] = useState(false);
  const [editDataFees, setEditDataFees] = useState<DeliveryFees | null>(null);

  const handleAddFee = async (formData: { fromMeter: number; toMeter: number; cost: number }) => {
    const res = await postData(endpoints.DeliveryFees.create, formData);
    if ('error' in res) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(
        t('Global.Server.Success.var_created', { var: t('Nav.delivery-fees') }),
        { variant: 'success' }
      );
      invalidateTag(FetchTags.DeliveryFees);
    }
    setOpenDialog(false);
  };

  // const handleEditFee = async (formData: { fromMeter: number; toMeter: number; cost: number }) => {
  //   if (!editDataFees) return;

  //   const res = await editData(endpoints.DeliveryFees.patch(editDataFees.id),'PATCH', formData);
  //   if ('error' in res) {
  //     enqueueSnackbar(res.error, { variant: 'error' });
  //   } else {
  //     enqueueSnackbar(
  //       t('Global.Server.Success.var_updated', { var: t('Nav.delivery-fees') }),
  //       { variant: 'success' }
  //     );
  //     invalidateTag(FetchTags.DeliveryFees);
  //   }

  //   setEditDataFees(null);
  //   setOpenDialog(false);
  // };

  const handleEditFee = async (formData: { fromMeter: number; toMeter: number; cost: number }) => {
  if (!editDataFees) return;

  // Build query string as the backend expects
  const queryParams = new URLSearchParams({
    FromMeter: formData.fromMeter.toString(),
    ToMeter: formData.toMeter.toString(),
    Cost: formData.cost.toString(),
  }).toString();

  // Build the final endpoint with query params
  const url = `${endpoints.DeliveryFees.patch(editDataFees.id)}?${queryParams}`;

  // Send PATCH request (no body needed)
  const res = await editData(url, 'PATCH', {});

  if ('error' in res) {
    enqueueSnackbar(res.error, { variant: 'error' });
  } else {
    enqueueSnackbar(
      t('Global.Server.Success.var_updated', { var: t('Nav.delivery-fees') }),
      { variant: 'success' }
    );
    invalidateTag(FetchTags.DeliveryFees);
  }

  setEditDataFees(null);
  setOpenDialog(false);
};

  const handleOpenEditDialog = (item: DeliveryFees) => {
    setEditDataFees(item);
    setOpenDialog(true);
  };

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Nav.delivery-fees')}
        links={[{}]}
        actions={[
          {
            children: t('Global.Action.add') + ' ' + t('Nav.delivery-fees'),
            onClick: () => {
              setEditDataFees(null);
              setOpenDialog(true);
            },
          },
        ]}
      />
      <Card>
        <DeliveryFeesTable
          items={data}
          totalCount={totalCount}
          onEdit={handleOpenEditDialog}
        />
      </Card>

      <AddDeliveryFeeDialog
        open={openDialog}
        onClose={() => {
          setEditDataFees(null);
          setOpenDialog(false);
        }}
        onSubmit={editDataFees ? handleEditFee : handleAddFee}
        editData={editDataFees}
      />
    </Container>
  );
}
