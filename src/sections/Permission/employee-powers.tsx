'use client';

import {
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  Card,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { PermissionItem, assignPermissionAction, revokePermissionAction } from 'src/actions/permissions';

type Props = {
  permissions: PermissionItem[];
  userId?: string;
  initialPermissionIds?: string[];
};

export default function EmployeePowers({
  permissions,
  userId,
  initialPermissionIds = [],
}: Props) {
  const t = useTranslations('Permissions');
  const tMessage = useTranslations('Message');
  const { enqueueSnackbar } = useSnackbar();
  const [permissionIds, setPermissionIds] = useState<string[]>(initialPermissionIds);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (id: string) => {

    if (!userId || loadingId) return;

    const isChecked = permissionIds.includes(id);
    const newChecked = [...permissionIds];
    setLoadingId(id);
    try {
      if (isChecked) {
        // Revoke
        const res = await revokePermissionAction(userId, [id]);
        if (res.success) {
          const index = newChecked.indexOf(id);
          if (index !== -1) newChecked.splice(index, 1);
          setPermissionIds(newChecked);
          enqueueSnackbar(tMessage('Success.updated', { item: t('permissions') }), {
            variant: 'success',
          });
        } else {
          enqueueSnackbar((res.error as string) || tMessage('Error.unexpected_error'), {
            variant: 'error',
          });
        }
      } else {
        const res = await assignPermissionAction(userId, [id]);
        if (res.success) {
          newChecked.push(id);
          setPermissionIds(newChecked);
          enqueueSnackbar(tMessage('Success.updated', { item: t('permissions') }), {
            variant: 'success',
          });
        } else {
          enqueueSnackbar((res.error as string) || tMessage('Error.unexpected_error'), {
            variant: 'error',
          });
        }
      }
    } catch (error) {
      enqueueSnackbar(tMessage('Error.unexpected_error'), { variant: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      {/* Permissions Accordions */}
      <Stack>
        {permissions.map((permission, index) => (
          <Accordion
            key={permission.id}
            defaultExpanded={false}
            disableGutters
            sx={{
              '&:before': { display: 'none' },
              borderBottom: (theme) =>
                index === permissions.length - 1 ? 'none' : `1px dashed ${theme.palette.divider}`,
              bgcolor: 'transparent',
              boxShadow: 'none',
            }}
          >
            <AccordionSummary
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              sx={{ px: 2 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {permission.displayNameAr || permission.displayNameEn || permission.name}
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
              {/* Checkboxes List */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)',
                  },
                  gap: 1,
                }}
              >
                {permission.children && permission.children.length > 0 ? (
                  permission.children.map((child) => (
                    <FormControlLabel
                      key={child.id}
                      control={
                        <Checkbox
                          size="small"
                          checked={permissionIds.includes(child.id)}
                          onChange={() => handleToggle(child.id)}
                          disabled={loadingId === child.id || !userId}
                        />
                      }
                      label={child.displayNameAr || child.displayNameEn || child.name}
                      sx={{
                        margin: 0,
                        alignItems: 'flex-start',
                        '.MuiTypography-root': {
                          fontSize: 14,
                          ml: 0.5,
                          mr: 0.5,
                          lineHeight: 1.5,
                          mt: 0.3,
                        },
                      }}
                    />
                  ))
                ) : (
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={permissionIds.includes(permission.id)}
                        onChange={() => handleToggle(permission.id)}
                      />
                    }
                    label={permission.displayNameAr || permission.displayNameEn || permission.name}
                    sx={{
                      margin: 0,
                      alignItems: 'flex-start',
                      '.MuiTypography-root': {
                        fontSize: 14,
                        ml: 0.5,
                        mr: 0.5,
                        lineHeight: 1.5,
                        mt: 0.3,
                      },
                    }}
                  />
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
        {permissions.length === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('permissions')}
            </Typography>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
