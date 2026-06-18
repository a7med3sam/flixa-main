import React from 'react';
import { useTranslations } from 'next-intl';
import { EmployeePermission } from 'src/types/employee';
import { Box, Grid2, Table, Checkbox, TableRow, TableBody, TableCell, TableHead, Typography } from '@mui/material'; // Imported Box

interface Props {
  permissionList: EmployeePermission[];
  permissions?: Record<string, string[]>; // Make optional
  handleCheck: (permissionKey: string, action: string) => void;
}

export default function PermissionTable({ permissionList, permissions = {}, handleCheck }: Props) {
  const t = useTranslations();

  // Define the order of actions to match the visual flow (right-to-left) in the Arabic UI
  const visualOrder = ['View', 'Add','Edit','Delete'];

  const actionTranslations = {
    View: t('Global.Action.view'),
    Add: t('Global.Action.add'),
    Edit: t('Global.Action.edit'),
    Delete: t('Global.Action.remove'),
  };

  // Safe permission check
  const isPermissionActive = (permissionKey: string, actionKey: string) => {
    return permissions?.[permissionKey]?.includes(actionKey) ?? false;
  };

  return (
    <Grid2 container spacing={2}>
      {/* Note: The outer Card/Grid2 in NewEditForm already controls the overall width */}
      <Box sx={{ p: 2, width: '100%' }}>
        <Typography variant="h6" gutterBottom>{t('Pages.Employee.permissions')}</Typography>

        {/* FIX: Wrap the Table in a Box to control overflow */}
        <Box
          sx={{
            width: '100%',
            // Apply horizontal scroll on small screens (xs, sm)
            // Prevent scroll on medium screens (md) and up
            overflowX: { xs: 'auto', md: 'visible' },
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('Pages.Employee.elements')}</TableCell>
                {/* Map over the visual order for the table header */}
                {visualOrder.map((action) => (
                  <TableCell
                    key={action}
                    sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} // Keep header text from wrapping
                    align="center"
                  >
                    {actionTranslations[action as keyof typeof actionTranslations]}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {permissionList?.map((perm) => (
                <TableRow key={perm.key}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{perm.nameAr}</TableCell>
                  {/* Map over the visual order for the table body */}
                  {visualOrder.map((action) => {
                    const actionExists = perm.actions.some(a => a.key === action);
                    const isChecked = isPermissionActive(perm.key, action);

                    return (
                      <TableCell key={`${perm.key}-${action}`} align="center">
                        {actionExists && (
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleCheck(perm.key, action)}
                          />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
       </Box>
    </Grid2>
  );
}
