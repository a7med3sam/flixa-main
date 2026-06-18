'use client';
import Stack from '@mui/material/Stack';
import { useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { useFormContext } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

type Props = TextFieldProps & {
  name: string;
};

export default function RHFOTP({ name, helperText, ...other }: Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const value = watch(name) || '';
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, input: string) => {
    const newValue = value.split('');
    newValue[index] = input;
    setValue(name, newValue.join(''));

    // Move to next input if value entered
    if (input && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    // Focus first input on mount
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <Stack direction="row" justifyContent="space-between" spacing={1} dir="ltr">
      {[0, 1, 2, 3].map((index) => (
        <TextField
          key={index}
          inputRef={(el: HTMLInputElement) => {
            inputsRef.current[index] = el;
          }}
          variant="filled"
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)}
          sx={{
            '& .MuiInputBase-input': {
              textAlign: 'center',
            },
            '& input': {
              fontSize: '40px !important',
              padding: '0 !important',
              font: 'large sans-serif',
              boxSizing: 'border-box',
            },
          }}
          slotProps={{
            input: {
              inputProps: {
                maxLength: 1,
              },
            },
          }}
          error={!!errors[name]}
          placeholder="_"
          {...other}
        />
      ))}
    </Stack>
  );
}
