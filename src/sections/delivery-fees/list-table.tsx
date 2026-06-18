'use client';
import { useSnackbar } from 'notistack';
import { ICONS } from 'src/config-icons';
import { useTranslations } from 'next-intl';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { deleteData } from 'src/utils/crud-fetch-api';
import { FetchTags } from 'src/actions/config-actions';
import { DeliveryFees } from 'src/types/delivery-fees';
import React, { useMemo, useState, useCallback } from 'react';
import { invalidateTag } from 'src/actions/cache-invalidation';
import SharedTable from 'src/components/SharedTable/SharedTable';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

interface Props {
  items: DeliveryFees[] |DeliveryFees;
  totalCount: number;
  onEdit: (item: DeliveryFees) => void; // <-- Added callback

}
export default function DeliveryFeesTable({ items, totalCount, onEdit }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const isDeleting = useBoolean();
  const deleteDialog = useBoolean();
  const t = useTranslations();
  const [selectedDeliveryfee, setselectedDeliveryfee] = useState<string | null>(null);

  const tableHead = [
    { id: 'FromSpace', label: 'Pages.DeliveryFees.from_meter' },
    { id: 'ToSpace', label: 'Pages.DeliveryFees.to_meter' },
    { id: 'shopingPrice', label: 'Pages.DeliveryFees.fee' },
  ];

  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();
      (async () => {
        const res = await deleteData(endpoints.DeliveryFees.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: t(`Pages.DeliveryFees.this_delivery_fee`),
            })
          );
          isDeleting.onFalse();
          deleteDialog.onFalse();
          invalidateTag(FetchTags.CategoriesList);
        }
      })();
    },
    [deleteDialog, enqueueSnackbar, isDeleting, t]
  );

  const customRender: Record<string, (item: DeliveryFees) => React.ReactNode> = useMemo(
    () => ({
      FromSpace: (item) => item.fromMeter,
      ToSpace: (item) => item.toMeter,
      shopingPrice: (item) => item.cost,
    }),
    []
  );

  return (
    <>
      <SharedTable
        tableHead={tableHead}
        data={  items as DeliveryFees[]}
        customRender={customRender}
        count={totalCount}
        actions={[
          {
            label: 'Global.Action.delete',
            icon: ICONS.global.delete,
            onClick: (item) => {
              setselectedDeliveryfee(item.id);
              deleteDialog.onTrue();
            },
            sx: { color: 'error.main' },
          },

             {
            label: 'Global.Action.edit',
            icon: ICONS.global.edit,
            onClick: (item) => onEdit(item), // <-- open edit dialog
            sx: { color: 'info.main' },
              }
        ]}
      />
      <ConfirmDeleteDialog
        name={t('Pages.DeliveryFees.this_delivery_fee')}
        action={() => selectedDeliveryfee && handleDelete(selectedDeliveryfee)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </>
  );
}
