'use client';
import { useState } from 'react';
import { Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export default function RHFMultiTextField({ name, helperText, type, ...other }: Props) {
  const t = useTranslations('Global.Form');
  const { control, setError, clearErrors } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDelete = (value: string) => {
          field.onChange(field.value.filter((item: string) => item !== value));
        };

        return (
          <TextField
            {...field}
            fullWidth
            type={type}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            slotProps={{
              input: {
                startAdornment:
                  Array.isArray(field.value) && field.value.length
                    ? field.value.map((item) => (
                        <Chip label={item} key={item} onDelete={() => onDelete(item)} />
                      ))
                    : undefined,
              },
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (inputValue && !field.value.includes(inputValue)) {
                  field.value.push(inputValue);
                  field.onChange(field.value);
                  setInputValue('');
                  clearErrors(name);
                } else if (inputValue) {
                  setError(name, {
                    type: 'manual',
                    message: t('Error.value_already_exist'),
                  });
                }
              }
            }}
            error={!!error}
            helperText={error ? error?.message : helperText || t('Helper.multi_text')}
            {...other}
            sx={{
              ...other.sx,
              '& .MuiInputBase-root': {
                display: 'flex',
                gap: 0.75,
                flexWrap: 'wrap',
                paddingBlock: 1.25,
                paddingInlineEnd: 1.25,
              },
              '& .MuiInputBase-input': {
                flexGrow: 1,
                width: 0,
                minWidth: '30px',
                paddingBlock: '7.5px',
              },
            }}
          />
        );
      }}
    />
  );
}
