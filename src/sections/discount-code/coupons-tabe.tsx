import { Switch } from '@mui/material';
import { ICONS } from 'src/config-icons';
import { Coupon } from 'src/types/coupons';
import { useTranslations } from 'next-intl';
import { enqueueSnackbar } from 'notistack';
import { fDate } from 'src/utils/format-time';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { deleteData } from 'src/utils/crud-fetch-api';
import { FetchTags } from 'src/actions/config-actions';
import React, { useMemo, useState, useCallback } from 'react';
import { invalidateTag } from 'src/actions/cache-invalidation';
import SharedTable from 'src/components/SharedTable/SharedTable';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

interface Props {
  coupons: Coupon[];
  totalCount: number;
}

const TABLE_HEAD = [
  { id: 'code', label: 'Pages.DiscountCodes.code' },
  { id: 'startDate', label: 'Pages.DiscountCodes.start_date' },
  { id: 'endDate', label: 'Pages.DiscountCodes.end_date' },
  { id: 'type', label: 'Pages.DiscountCodes.type_discount' },
  { id: 'discount', label: 'Pages.DiscountCodes.discount_value' },
  { id: 'NumOfUsage', label: 'Pages.DiscountCodes.current_uses' },
  // { id: 'IsActive', label: 'Pages.DiscountCodes.status' },
];
export default function CouponsTable({ coupons, totalCount }: Props) {
  const t = useTranslations();
  const deleteDialog = useBoolean();
  const isDeleting = useBoolean();
  const [selectedDiscountId, setselectedDiscountId] = useState<string | null>(null);

  const customRender: Record<string, (item: Coupon) => React.ReactNode> = useMemo(
    () => ({
      code: (item) => item.code,
      startDate: (item) => fDate(item?.startDate, 'dd-MM-yyyy'),
      endDate: (item) => fDate(item?.endDate, 'dd-MM-yyyy'),
      type: (item) =>
        item.type == 'FixedAmount' ? t('Pages.DiscountCodes.values') : t('Pages.DiscountCodes.percantage'),
      NumOfUsage: (item) => item.numberOfUsagesNow,
      // IsActive: (item) => <Switch checked={item.isActive} />,
    }),
    [t]
  );
  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();
      (async () => {
        const res = await deleteData(endpoints.barcodeDiscount.delete(id));
        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
          isDeleting.onFalse();
          deleteDialog.onFalse();
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: t(`Pages.Banners.this_banner`),
            })
          );
          isDeleting.onFalse();
          deleteDialog.onFalse();
          invalidateTag(FetchTags.BarcodeDiscount);
        }
      })();
    },
    [deleteDialog, isDeleting, t]
  );

  return (
    <>
      <SharedTable
        tableHead={TABLE_HEAD}
        data={coupons}
        count={totalCount}
        customRender={customRender}
        actions={[
          {
            label: 'Global.Action.delete',
            icon: ICONS.global.delete,
            onClick: (item) => {
              setselectedDiscountId(item.id);
              deleteDialog.onTrue();
            },
            sx: { color: 'error.main' },
          },
        ]}
      />
      <ConfirmDeleteDialog
        name={t('Pages.DiscountCodes.this_codes')}
        action={() => selectedDiscountId && handleDelete(selectedDiscountId)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
      />
    </>
  );
}
