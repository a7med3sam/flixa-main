'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import LinkItem from './link-item';
import { CustomBreadcrumbsProps } from './types';

// ----------------------------------------------------------------------

export default function CustomBreadcrumbs({
  links,
  actions,
  heading,
  activeLast,
  sx,
  ...other
}: CustomBreadcrumbsProps) {
  const lastLink = links[links.length - 1]?.name;

  return (
    <Box sx={{ mb: 1.5, ...sx }}>
      <Stack direction="row" alignItems="center" minHeight={80} flexWrap="wrap">
        <Box sx={{ flexGrow: 1 }}>
          {/* HEADING */}
          {heading && <Typography variant="h4">{heading}</Typography>}

          {/* BREADCRUMBS */}
          {!!links.length && (
            <Breadcrumbs
              separator={<Separator />}
              sx={{
                '& .MuiBreadcrumbs-separator': {
                  alignSelf: 'flex-end',
                  mr: 1,
                  ml: 1,
                },
              }}
              {...other}
            >
              {links.map((link) => (
                <LinkItem
                  key={link.name || ''}
                  link={link}
                  activeLast={activeLast}
                  disabled={link.name === lastLink}
                />
              ))}
            </Breadcrumbs>
          )}
        </Box>

        {actions?.length && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {actions.map((action, index) => (
              <LoadingButton
                key={index}
                sx={{ flexShrink: 0 }}
                size="large"
                color="primary"
                variant="contained"
                {...action}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: 'primary.main',
      }}
    />
  );
}
