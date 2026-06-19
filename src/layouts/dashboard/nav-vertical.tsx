'use client';

import { useEffect } from 'react';
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { usePathname } from 'src/routes/hooks';
import { useAuthStore } from 'src/auth/auth-store';
import { useResponsive } from 'src/hooks/use-responsive';
import { NavSectionVertical } from 'src/components/nav-section';
import { useTranslations } from 'next-intl';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { user } = useAuthStore();
  const t = useTranslations();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-center px-6 py-4">
        <Logo
          enableText
          title={t('Metadata.title')}
          sx={{ width: 130, height: 44, color: '#212B36' }}
          textProps={{
            sx: { color: '#212B36' },
            variant: 'h5',
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        />
      </div>

      <Scrollbar
        sx={{
          flex: 1,
          py: 1,
          '& .simplebar-content': {
            height: 1,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <NavSectionVertical
          data={navData}
          slotProps={{
            userModules: user?.modules,
          }}
        />
        <div className="flex-grow" />
      </Scrollbar>

      <div className="flex items-center justify-center border-t border-[rgba(145,158,171,0.2)] px-4 py-4">
        <div className="flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-[0.8rem] font-medium tracking-wide text-grey-800/50">
            فليكسا
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="shrink-0 lg:w-[280px]">
      {lgUp ? (
        <div className="fixed h-full" style={{ width: NAV.W_VERTICAL }}>
          {renderContent}
        </div>
      ) : (
        <>
          {openNav && (
            <div
              className="fixed inset-0 z-[1200] bg-black/50 lg:hidden"
              onClick={onCloseNav}
              aria-hidden="true"
            />
          )}

          <div
            className={[
              'fixed top-0 bottom-0 z-[1201] bg-white transition-transform duration-300 ease-in-out lg:hidden',
              openNav
                ? 'translate-x-0'
                : '-translate-x-full pointer-events-none rtl:translate-x-full',
            ].join(' ')}
            style={{ width: NAV.W_VERTICAL, insetInlineStart: 0 }}
          >
            {renderContent}
          </div>
        </>
      )}
    </div>
  );
}
