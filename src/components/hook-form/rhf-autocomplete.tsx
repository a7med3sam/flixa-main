import { Box } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import FormLabel, { FormLabelProps } from '@mui/material/FormLabel';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';

import { useQuery } from '../use-query';

// ----------------------------------------------------------------------

interface Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  name: string;
  label?: string;
  placeholder?: string;
  value?: any;
  rules?: { [key: string]: any };
  helperText?: React.ReactNode;
  onCustomChange?: (value: any) => void;
  searchQuery?: string;
  textProps?: TextFieldProps;
}

export default function RHFAutocomplete<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  name,
  label,
  helperText,
  rules,
  placeholder,
  onCustomChange,
  searchQuery,
  defaultLabel,
  formLabelProps,
  textProps,
  value: _value,
  ...other
}: Omit<Props<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'> & {
  defaultLabel?: boolean;
  formLabelProps?: FormLabelProps;
}) {
  const { control, setValue } = useFormContext();
  const { changeQueries } = useQuery([...(searchQuery ? [searchQuery] : [])], true);

  return (
    <Controller
      name={name}
      defaultValue={_value}
      rules={rules}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const renderAutoCompelete = (
          <Autocomplete
            {...field}
            id={`autocomplete-${name}`}
            onChange={(event, newValue) => {
              if (onCustomChange) onCustomChange(newValue);
              setValue(name, newValue, { shouldValidate: true });
            }}
            renderInput={(params) => (
              <TextField
                {...textProps}
                {...params}
                value={field.value}
                label={defaultLabel ? label : undefined}
                placeholder={placeholder}
                error={!!error}
                helperText={error ? error?.message : helperText}
                onChange={(event) => {
                  if (searchQuery) {
                    changeQueries({
                      [searchQuery]: event?.target?.value || null,
                    });
                  }
                }}
                slotProps={{
                  input: {
                    autoComplete: 'new-password',
                    ...textProps?.slotProps?.input,
                    ...params.InputProps,
                  },
                }}
              />
            )}
            {...other}
          />
        );

        if (defaultLabel || !label) return renderAutoCompelete;

        return (
          <Box>
            <FormLabel error={!!error} {...formLabelProps}>
              {label}
            </FormLabel>
            {renderAutoCompelete}
          </Box>
        );
      }}
    />
  );
}
