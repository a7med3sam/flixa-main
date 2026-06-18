'use client';

import Link from 'next/link';
import { Box } from '@mui/material';

interface ImageLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function ImageLink({ href, children }: ImageLinkProps) {
  return (
    <Box
      href={href}
      target="_blank"
      component={Link}
      sx={{
        textDecoration: 'none',
        display: 'block',
        '&:hover': {
          opacity: 0.8,
        },
        '&:focus': {
          opacity: 0.9,
        },
        transition: (theme) => `opacity ${theme.transitions.duration.short}ms`,
      }}
    >
      {children}
    </Box>
  );
}
