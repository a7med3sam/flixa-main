import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Card, Stack, Typography } from '@mui/material';


interface Props {
  reason: string;
  notes: string ;
}
export default function ReasonAndNotesOfReturnsDetails({ reason,notes }: Props) {
  const t = useTranslations();
  const sharedBoxStyle = {
    bgcolor: '#f3f7f3',
    p: 2,
    borderRadius: 1,
    minHeight: 130,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlign: 'right',
  };

  return (
    <Stack flexDirection="row" width="100%" gap={2}>
  <Card sx={{ mt: 3, flex: 1 }}>
    <Box sx={{ p: 2, width: '100%' }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 'bold',
          color: 'green',
          mb: 1,
          textAlign: 'left',
        }}
      >
        {t('Pages.Orders.reason_returned')}
      </Typography>

      <Box sx={sharedBoxStyle}>
        <Typography sx={{ color: '#333' }}>{reason}</Typography>
      </Box>
    </Box>
  </Card>

  <Card sx={{ mt: 3, flex: 1 }}>
    <Box sx={{ p: 2, width: '100%' }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 'bold',
          color: 'green',
          mb: 1,
          textAlign: 'left',
        }}
      >
        {t('Pages.Orders.add_notes_client')}
      </Typography>

      <Box sx={sharedBoxStyle}>
        <Typography sx={{ color: '#333' }}>{notes}</Typography>
      </Box>
    </Box>
  </Card>
</Stack>

  );
}
