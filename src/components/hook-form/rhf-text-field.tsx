import { Box } from '@mui/material';
import { FormLabel, FormLabelProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  defaultLabel?: boolean;
  formLabelProps?: FormLabelProps;
};

export default function RHFTextField({
  name,
  helperText,
  type,
  label,
  defaultLabel,
  formLabelProps,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const renderTextField = (
          <TextField
            {...field}
            fullWidth
            type={type}
            value={type === 'number' && field.value === 0 ? '' : field.value}
            onChange={(event) => {
              if (type === 'number') {
                field.onChange(Number(event.target.value));
              } else {
                field.onChange(event.target.value);
              }
            }}
            error={!!error}
            label={defaultLabel ? label : undefined}
            helperText={error ? error?.message : helperText}
            sx={{
              ...other.sx,
              '& .MuiInputBase-input': {
                ...(other.sx as any)?.['& .MuiInputBase-input'],
                ...(!defaultLabel ? { paddingTop: 2, paddingBottom: 2 } : undefined),
              },
            }}
            {...other}
          />
        );

        if (defaultLabel || !label) return renderTextField;

        return (
          <Box>
            <FormLabel error={!!error} {...formLabelProps}>
              {label}
            </FormLabel>
            {renderTextField}
          </Box>
        );
      }}
    />
  );
}
