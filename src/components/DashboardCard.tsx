import type { ReactNode } from 'react';
import Card from '@mui/material/Card';

export default function DashboardCard({
  children,
  sx,
  ...other
}: {
  children: ReactNode;
  sx?: Record<string, unknown>;
}) {
  return (
    <Card
      sx={{
        bgcolor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '16px',
        boxShadow: 'none',
        p: 2.5,
        ...sx,
      }}
      {...other}
    >
      {children}
    </Card>
  );
}
