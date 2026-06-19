import Iconify from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';
import { useCurrentLocale } from 'src/utils/locale-utils';
import { useSettingsContext } from 'src/components/settings';

import { NAV } from '../config-layout';

// ----------------------------------------------------------------------

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function NavToggleButton({ className, style }: Props) {
  const { dir } = useCurrentLocale();

  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  if (!lgUp) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() =>
        settings.onUpdate('themeLayout', settings.themeLayout === 'vertical' ? 'mini' : 'vertical')
      }
      className={[
        'fixed top-8 z-[1101] rounded-full border border-dashed border-grey-300 bg-white/80 p-1 backdrop-blur-md transition-colors hover:bg-grey-100',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        insetInlineStart: NAV.W_VERTICAL - 12,
        ...style,
      }}
    >
      <Iconify
        width={16}
        className={dir === 'rtl' ? 'scale-x-[-1]' : undefined}
        icon={
          settings.themeLayout === 'vertical'
            ? 'eva:arrow-ios-back-fill'
            : 'eva:arrow-ios-forward-fill'
        }
      />
    </button>
  );
}
