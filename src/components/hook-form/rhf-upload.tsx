import { FormLabel } from '@mui/material';
import { useTranslations } from 'next-intl';
import { fData } from 'src/utils/format-number';
import FormHelperText from '@mui/material/FormHelperText';
import { Controller, useFormContext } from 'react-hook-form';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_HELPER } from 'src/config-global';

import { Upload, UploadBox, UploadProps, UploadAvatar } from '../upload';

// ----------------------------------------------------------------------

interface Props extends Omit<UploadProps, 'file' | 'onDrop' | 'onRemove' | 'onRemoveAll'> {
  name: string;
  label?: string;
  multiple?: boolean;
  isLogoIndex?: number;
  setIsLogoIndex?: (index: number) => void;
  maxSizeHelper?: boolean;
}

// ----------------------------------------------------------------------

export function RHFUploadAvatar({
  name,
  label,
  maxSizeHelper = MAX_FILE_SIZE_HELPER,
  maxSize = MAX_FILE_SIZE,
  ...other
}: Props) {
  const { control } = useFormContext();
  const t = useTranslations('Global');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          {label && (
            <FormLabel sx={{ mb: 0.5, display: 'block' }} error={!!error}>
              {label}
            </FormLabel>
          )}
          <UploadAvatar
            error={!!error}
            file={field.value}
            onDrop={(acceptedFiles: File[]) => {
              const file = acceptedFiles[0];

              const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
              });

              if (file) {
                field.onChange(newFile);
              }
            }}
            helperText={
              !!maxSize && maxSizeHelper ? (
                <FormHelperText
                  // variant="caption"
                  sx={{
                    px: 2,
                    mt: 1,
                  }}
                >
                  {t.rich('Helper.allowed_image', {
                    formate: '*.jpeg, *.jpg, *.png, *.gif',
                    br: () => <br />,
                    size: fData(maxSize),
                  })}
                </FormHelperText>
              ) : (
                other.helperText
              )
            }
            maxSize={maxSize}
            {...other}
          />

          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox files={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({
  name,
  label,
  multiple,
  helperText,
  isLogoIndex,
  setIsLogoIndex,
  maxSizeHelper = MAX_FILE_SIZE_HELPER,
  maxSize = MAX_FILE_SIZE,
  ...other
}: Props) {
  const { control } = useFormContext();
  const t = useTranslations('Global');

  if (!!maxSize && maxSizeHelper && !helperText)
    helperText = t.rich('Helper.allowed_image', {
      formate: '*.jpeg, *.jpg, *.png, *.gif',
      br: () => <br />,
      size: fData(maxSize),
    });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          {label && (
            <FormLabel sx={{ mb: 0.5, display: 'block' }} error={!!error}>
              {label}
            </FormLabel>
          )}

          {multiple ? (
            <Upload
              multiple
              accept={{ 'image/*': [] }}
              files={field.value?.url ? field.value?.url : field.value}
              error={!!error}
              isLogoIndex={isLogoIndex}
              setIsLogoIndex={setIsLogoIndex}
              onDrop={(acceptedFiles: File[]) => {
                const files = field.value || [];
                const newFiles = acceptedFiles.map((file) =>
                  Object.assign(file, {
                    preview: URL.createObjectURL(file),
                  })
                );

                field.onChange([...files, ...newFiles], { shouldValidate: true });
              }}
              onRemove={(inputFile: File | string) => {
                const filtered =
                  field.value && field.value?.filter((file: any) => file !== inputFile);
                field.onChange(filtered);
              }}
              onRemoveAll={() => {
                field.onChange([]);
              }}
              helperText={
                (!!error || helperText) && (
                  <FormHelperText error={!!error} sx={{ px: 2 }}>
                    {error ? error?.message : helperText}
                  </FormHelperText>
                )
              }
              maxSize={maxSize}
              {...other}
            />
          ) : (
            <Upload
              accept={{ 'image/*': [] }}
              file={field.value}
              error={!!error}
              onDrop={(acceptedFiles: File[]) => {
                const file = acceptedFiles[0];

                const newFile = Object.assign(file, {
                  preview: URL.createObjectURL(file),
                });

                if (file) {
                  field.onChange(newFile);
                }
              }}
              helperText={
                (!!error || helperText) && (
                  <FormHelperText error={!!error} sx={{ px: 2 }}>
                    {error ? error?.message : helperText}
                  </FormHelperText>
                )
              }
              maxSize={maxSize}
              {...other}
            />
          )}
        </div>
      )}
    />
  );
}
