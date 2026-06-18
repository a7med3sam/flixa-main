'use client';

import { ICONS } from 'src/config-icons';
import { useTranslations } from 'next-intl';
import { useNameValue } from 'src/utils/locale-utils';
import { RHFTextField } from 'src/components/hook-form';
import { useFieldArray, useFormContext } from 'react-hook-form';
import RHFAutocomplete from 'src/components/hook-form/rhf-autocomplete';
import { Box, Card, Button, Tooltip, CardProps, CardContent } from '@mui/material';

import { FormUnit } from './form-utils';
import { useFormStore } from './form-store';

export default function ProductFormUnits(props: CardProps) {
  const t = useTranslations();
  const nameVal = useNameValue();
  const { labels, units } = useFormStore();
  const { control } = useFormContext();

  const { fields, append, remove, update } = useFieldArray({
    name: 'ProductUnitOfMeasures',
    control,
  });

  const renderSubUnits = (fields as FormUnit[]).map((field, index) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr auto',
        alignItems: 'stretch',
        mt: 1,
      }}
      key={index}
    >
      <RHFAutocomplete
        name={`ProductUnitOfMeasures.${index}.UnitId`}
        label={labels.SubUnit}
        color="primary"
        options={units || []}
        getOptionKey={(option) => (typeof option === 'string' ? option : option.id || '')}
        getOptionLabel={(option) =>
          typeof option === 'string'
            ? units.find((item) => item.id === option)?.[nameVal] || option
            : option[nameVal] || ''
        }
        onChange={(_, newValue) => {
          if (typeof newValue === 'string' || Array.isArray(newValue)) return;
          update(index, { ...field, UnitId: newValue?.id || '' });
        }}
        textProps={{
          slotProps: {
            input: {
              sx: {
                borderRadius: '16px 0 0 16px !important',
              },
            },
          },
        }}
      />

      <RHFTextField
        name={`ProductUnitOfMeasures.${index}.ConversionRate`}
        label={labels.ConversionRate}
        color="primary"
        value={field.ConversionRate}
        type="number"
        onChange={(e) => {
          update(index, { ...field, ConversionRate: Number(e.target.value) || 0 });
        }}
        fullWidth
        slotProps={{
          input: {
            sx: {
              borderRadius: 0,
              paddingTop: '1px',
            },
          },
        }}
      />
      <RHFTextField
        name={`ProductUnitOfMeasures.${index}.Price`}
        label={labels.Price}
        color="primary"
        value={field.Price}
        type="number"
        onChange={(e) => {
          update(index, { ...field, Price: Number(e.target.value) || 0 });
        }}
        fullWidth
        slotProps={{
          input: {
            sx: {
              borderRadius: 0,
              paddingTop: '1px',
            },
          },
        }}
      />

      <Tooltip title={t('Pages.Products.remove_subunit')}>
        <Button
          sx={{
            fontSize: 24,
            minWidth: 0,
            borderRadius: '0 16px 16px 0',
            mt: 4,
            alignSelf: 'start',
            paddingBlock: '13px',
          }}
          variant="outlined"
          color="primary"
          onClick={() => remove(index)}
        >
          {ICONS.global.x}
        </Button>
      </Tooltip>
    </Box>
  ));

  return (
    <Card {...props}>
      <CardContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', alignItems: 'stretch' }}>
          <RHFAutocomplete
            name="MainUnit"
            label={labels.MainUnit}
            color="primary"
            options={units || []}
            getOptionKey={(option) => (typeof option === 'string' ? option : option.id || '')}
            getOptionLabel={(option) =>
              typeof option === 'string'
                ? units.find((item) => item.id === option)?.[nameVal] || option
                : option[nameVal] || ''
            }
            textProps={{
              slotProps: {
                input: {
                  sx: {
                    borderRadius: '16px 0 0 16px !important',
                  },
                },
              },
            }}
          />
          <RHFTextField
            name="PriceInMainUnit"
            label={labels.Price}
            color="primary"
            type="number"
            fullWidth
            slotProps={{
              input: {
                sx: {
                  borderRadius: 0,
                  paddingTop: '1px',
                },
              },
            }}
          />

          <Tooltip title={t('Pages.Products.add_subunit')}>
            <Button
              sx={{
                fontSize: 24,
                minWidth: 0,
                borderRadius: '0 16px 16px 0',
                mt: 4,
                alignSelf: 'start',
                paddingBlock: '13px',
              }}
              variant="outlined"
              color="primary"
              onClick={() => append({})}
            >
              {ICONS.global.add}
            </Button>
          </Tooltip>
        </Box>

        {renderSubUnits}

        <Box mt={1}>
          <RHFTextField
            name="StockQuantity"
            color="primary"
            label={labels.StockQuantity}
            type="number"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
