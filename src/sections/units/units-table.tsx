'use client';
import { useCallback } from 'react';
import { Unit } from 'src/types/units';
import { useSnackbar } from 'notistack';
import { ICONS } from 'src/config-icons';
import { useDebounce } from 'use-debounce';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { endpoints } from 'src/utils/endpoints';
import { useBoolean } from 'src/hooks/use-boolean';
import { useQuery } from 'src/components/use-query';
import { FetchTags } from 'src/actions/config-actions';
import { invalidateTag } from 'src/actions/cache-invalidation';
import { editData, deleteData } from 'src/utils/crud-fetch-api';
import SharedTable from 'src/components/SharedTable/SharedTable';
import { Box, Card, Switch, TextField, IconButton } from '@mui/material';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';

const TABLE_HEAD = [
  { id: 'nameAr', label: 'Global.Label.name_ar' },
  { id: 'nameEn', label: 'Global.Label.name_en' },
  { id: 'isActive', label: 'Global.Label.status' },
];

interface Props {
  items: Unit[];
  totalCount: number;
  onEdit: (unit: Unit) => void;
}

export default function UnitsTable({ items, totalCount, onEdit }: Props) {
  const t = useTranslations();
  const { values,changeQueries } = useQuery(['status', 'search', 'parentId', 'parentName', 'page'], true);
  const { enqueueSnackbar } = useSnackbar();
  const [unitsStatus, setUnitsStatus] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((unit) => [unit.id, unit.isActive]))
  );
  const disableChangeStatus = useBoolean();
  const deleteDialog = useBoolean();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const isDeleting = useBoolean();

  const [search, setSearch] = useState(values.search || '');
const [debouncedSearch] = useDebounce(search, 500);


useEffect(() => {
  if (debouncedSearch !== values.search) changeQueries({ search: debouncedSearch, page: '1' });
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [debouncedSearch]);
// update units status on items change
useEffect(() => {
  setUnitsStatus(Object.fromEntries(items.map((unit) => [unit.id, unit.isActive])));
}, [items]);

  const handleToggleStatus = useCallback(
    (id: string) => {
      if (disableChangeStatus.value) return;
      disableChangeStatus.onTrue();

      const originalStatus = unitsStatus[id];
      setUnitsStatus((prev) => {
        return {
          ...prev,
          [id]: !prev[id],
        };
      });

      (async () => {
        const res = await editData(endpoints.units.patch(id), 'PATCH', {
          isActive: !originalStatus,
        });

        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
          setUnitsStatus((prev) => ({
            ...prev,
            [id]: originalStatus,
          }));
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_updated', {
              var: t('Global.Label.unit'),
            })
          );
          invalidateTag(FetchTags.UnitsList);
        }
        disableChangeStatus.onFalse();
      })();
    },
    [disableChangeStatus, enqueueSnackbar, t, unitsStatus]
  );


  const handleDelete = useCallback(
    (id: string) => {
      isDeleting.onTrue();

      (async () => {
        const res = await deleteData(endpoints.units.delete(id));

        if ('error' in res) {
          enqueueSnackbar(res.error, { variant: 'error' });
          // Ensure loading and dialog are reset even on error
          isDeleting.onFalse();
          deleteDialog.onFalse();
          setSelectedUnitId(null);
        } else {
          enqueueSnackbar(
            t('Global.Server.Success.var_deleted', {
              var: t('Global.Label.unit'),
            })
          );
          isDeleting.onFalse();
          deleteDialog.onFalse();
          setSelectedUnitId(null);
          invalidateTag(FetchTags.UnitsList);
        }
      })();
    },
    [deleteDialog, enqueueSnackbar, isDeleting, t]
  );


  return (
    <>
      <Card>
        <Box px={2} py={3}>
          <TextField
            variant="outlined"
            placeholder={t('Global.Label.search') + '...'}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
                  }}
               value={search || ''}
               slotProps={{
                input: {
                  endAdornment: search ?(<IconButton onClick={() => {setSearch("")}} sx={{"& .svg-color": {width: "1rem", height: "1rem"}}}>{ICONS.global.x}</IconButton>): null
                }
              }}
          />
        </Box>
        <SharedTable
          tableHead={TABLE_HEAD}
          data={items}
          count={totalCount}
          customRender={{

            isActive: (item) => (
              <Switch checked={!!unitsStatus[item.id]} onChange={() => handleToggleStatus(item.id)} />
            ),
          }}
          actions={[
            {
              label: 'Global.Action.edit',
              icon: ICONS.global.edit,
              onClick: (unit) => {
                onEdit(unit);
              },
            },
            {
              label: 'Global.Action.delete',
              icon: ICONS.global.delete,
              onClick: (unit) => {
                setSelectedUnitId(unit.id);
                deleteDialog.onTrue();
              },
              sx: { color: 'error.main' },
            },
          ]}
        />
      </Card>
      <ConfirmDeleteDialog
        name={t('Global.Label.unit')}
        action={() => selectedUnitId && handleDelete(selectedUnitId)}
        isLoading={isDeleting.value}
        open={deleteDialog.value}
        onClose={() => deleteDialog.onFalse()}
        />
    </>
  );
}
