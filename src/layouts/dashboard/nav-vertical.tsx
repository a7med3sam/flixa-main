'use client';

import { useEffect } from 'react';
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
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
  const { user, logout } = useAuthStore();
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

  const handleLogout = async () => {
    await logout();
  };

  const renderContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-start px-5 py-3 my-4">
        <Logo
          enableText
          title={t('Metadata.title')}
          sx={{ width: 120, height: 40, color: '#212B36' }}
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
          py: 0.5,
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

      <div className=" px-4 py-3 mb-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg border-0 px-2 py-2 text-sm font-medium text-grey-600 outline-none transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Iconify icon="solar:logout-2-bold-duotone" width={20} />
          {t('Pages.Notification.status.logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="shrink-0 lg:w-[280px]">
      {lgUp ? (
        <div 
          className="fixed h-full bg-gradient-to-br from-white/90 to-white/40 dark:from-[#212B36]/90 dark:to-[#212B36]/40 backdrop-blur-2xl border-e border-white/50 dark:border-white/10 shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.6)] dark:shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.1)]" 
          style={{ width: NAV.W_VERTICAL }}
        >
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
              'fixed top-0 bottom-0 z-[1201] bg-gradient-to-br from-white/90 to-white/40 dark:from-[#212B36]/90 dark:to-[#212B36]/40 backdrop-blur-2xl border-e border-white/50 dark:border-white/10 shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.6)] dark:shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.1)] transition-transform duration-300 ease-in-out lg:hidden',
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
