import dayjs, { Dayjs } from 'dayjs';
import { useFormContext } from 'react-hook-form';
import { useFormat } from 'src/utils/format-time';
import { Box, FormLabel, FormLabelProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

type Props = DatePickerProps<Dayjs> & {
  name: string;
  defaultLabel?: boolean;
  formLabelProps?: FormLabelProps;
};

export default function RHFDatePicker({
  name,
  label,
  defaultLabel,
  formLabelProps,
  ...other
}: Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message;

  const { formateDate } = useFormat();

  const renderDatePicker = (
    <DatePicker
      {...other}
      format={other.format || 'DD/MM/YYYY'}
      defaultValue={watch(name) ? dayjs(watch(name)) : null}
      slotProps={{
        ...other.slotProps,
        field: {
          clearable: true,
          onClear: () => setValue(name, undefined as unknown as string, { shouldValidate: true }),
        },
        textField: {
          ...other.slotProps?.textField,
          error: !!error,
          helperText: typeof error === 'string' ? error : undefined,
        },
      }}
      onChange={(value: Dayjs | null): void => {
        setValue(name, formateDate(value?.toDate(), 'yyyy-MM-dd') || '', { shouldValidate: true });
      }}
      label={defaultLabel ? label : undefined}
    />
  );

  if (defaultLabel || !label) return renderDatePicker;

  return (
    <Box>
      <FormLabel error={!!error} {...formLabelProps}>
        {label}
      </FormLabel>
      {renderDatePicker}
    </Box>
  );
}
