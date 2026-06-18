'use client';

import { m } from 'framer-motion';
import { useCallback } from 'react';
import { Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { varHover } from 'src/components/animate';
import { allLocales } from 'src/i18n/config-locale';
import { useCurrentLocale } from 'src/utils/locale-utils';
import { clientRedirect } from 'src/actions/client-redirect';
import { usePathname, useSearchParams } from 'next/navigation';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function LanguagePopover({ large = false }: { large?: boolean }) {
  const popover = usePopover();

  const currentLocale = useCurrentLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChangeLang = useCallback(
    // (newLocale: LocaleType) => {
    (newLocale: string) => {
      if (currentLocale.value !== newLocale) {
        (async () => {
          await clientRedirect(
            `${pathname.replace(`/${currentLocale.value}`, `/${newLocale}`)}${searchParams ? `?${searchParams.toString()}` : ''}`
          );
        })();
      }
      popover.onClose();
    },
    [currentLocale, pathname, popover, searchParams]
  );

  return (
    <>
      {large ? (
        <Button
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          onClick={popover.onOpen}
          sx={{
            ...(popover.open && {
              bgcolor: 'action.selected',
            }),
          }}
          startIcon={<Iconify icon={currentLocale.icon} sx={{ borderRadius: 0.65, width: 28 }} />}
        >
          {currentLocale.label}
        </Button>
      ) : (
        <IconButton
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          onClick={popover.onOpen}
          sx={{
            width: 40,
            height: 40,
            ...(popover.open && {
              bgcolor: 'action.selected',
            }),
          }}
        >
          <Iconify icon={currentLocale.icon} sx={{ borderRadius: 0.65, width: 28 }} />
        </IconButton>
      )}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 160 }}
        arrow="top-left"
      >
        {allLocales.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLocale.value}
            onClick={() => handleChangeLang(option.value)}
          >
            <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 28 }} />

            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
