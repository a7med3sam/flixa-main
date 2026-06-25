'use client';

import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import { useTranslations } from 'next-intl';

import { NAV, HEADER } from '../config-layout';
import AccountPopover from '../common/account-popover';
import LanguagePopover from '../common/language-popover';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const t = useTranslations();
  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);
  const offsetTop = offset && !isNavHorizontal;

  const headerHeight = lgUp
    ? offsetTop || isNavHorizontal
      ? HEADER.H_DESKTOP_OFFSET
      : HEADER.H_DESKTOP
    : HEADER.H_MOBILE;

  const headerStyle: React.CSSProperties = {
    height: headerHeight,
    ...(lgUp &&
      !isNavHorizontal && {
        width: `calc(100% - ${isNavMini ? NAV.W_MINI + 1 : NAV.W_VERTICAL}px)`,
        insetInlineStart: isNavMini ? NAV.W_MINI : NAV.W_VERTICAL,
      }),
  };

  return (
    <header
      className={[
        'fixed top-0 z-[1101] w-full bg-white',
        lgUp && isNavHorizontal && 'border-b border-[rgba(145,158,171,0.16)]',
      ]
        .filter(Boolean)
        .join(' ')}
      style={headerStyle}
    >
      <div className="flex h-full items-center bg-white px-0 lg:px-10">
        {lgUp && isNavHorizontal && (
          <div className="me-5">
            <Logo />
          </div>
        )}

        {!lgUp && (
          <button
            type="button"
            onClick={onOpenNav}
            className="inline-flex items-center justify-center rounded-full p-2 hover:bg-grey-500/[0.08]"
          >
            <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" className="text-[#454F5B]" />
          </button>
        )}

        <div className="flex flex-1 items-center justify-between">
          {/* Search */}
          <div className="relative">
            <span className="pointer-events-none absolute start-1 top-1/2 flex -translate-y-1/2 items-center p-2">
              <Iconify icon="eva:search-fill" width={20} className="text-grey-600" />
            </span>
            <input
              type="search"
              placeholder={t('Global.Label.search')}
              className="h-10 w-[180px] rounded-[20px] border-0 bg-[#f7f7f7] px-4 ps-10 text-sm font-medium text-grey-800 placeholder:text-grey-500 focus:outline-none sm:w-[320px]"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguagePopover />
            <AccountPopover />
          </div>
        </div>
      </div>
    </header>
  );
}
