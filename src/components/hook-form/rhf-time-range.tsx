import { Dayjs } from 'dayjs';
import { useFormContext } from 'react-hook-form';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers';
import { Box, Stack, FormLabel, Typography, FormHelperText } from '@mui/material';

interface Props {
  label?: string;
  fromName: string;
  toName: string;
  fromProps?: TimePickerProps<Dayjs>;
  toProps?: TimePickerProps<Dayjs>;
  format?: string;
}

export default function RHFTimeRange({
  label,
  fromName,
  toName,
  fromProps,
  toProps,
  format = 'HH:mm',
}: Props) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <Box>
      {label && <FormLabel error={!!errors[fromName] && !!errors[toName]}>{label}</FormLabel>}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box width="100%">
          <TimePicker
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors[fromName],
              },
            }}
            {...fromProps}
            onChange={(value) =>
              setValue(fromName, value?.format(format), { shouldValidate: true })
            }
          />
        </Box>
        <Typography>{' : '}</Typography>
        <Box width="100%">
          <TimePicker
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors[toName],
              },
            }}
            {...toProps}
            onChange={(value) => setValue(toName, value?.format(format), { shouldValidate: true })}
          />
        </Box>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Box width="100%">
          {errors[fromName] && (
            <FormHelperText error>{errors[fromName].message as String}</FormHelperText>
          )}
        </Box>
        <Typography />
        <Box width="100%">
          {errors[toName] && (
            <FormHelperText error>{errors[toName].message as String}</FormHelperText>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
