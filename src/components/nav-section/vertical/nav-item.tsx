import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import { alpha, styled } from '@mui/material/styles';
import { Link as RouterLink } from 'src/i18n/routing';
import ListItemButton from '@mui/material/ListItemButton';

import Iconify from '../../iconify';
import { NavItemProps, NavItemStateProps } from '../types';

// ----------------------------------------------------------------------

const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
  (
    {
      title,
      path,
      icon,
      info,
      disabled,
      caption,
      roles,
      //
      open,
      depth,
      active,
      hasChild,
      externalLink,
      currentRole = 'admin',
      ...other
    },
    ref
  ) => {
    const subItem = depth !== 1;

    const renderContent = (
      <StyledNavItem
        ref={ref}
        disableGutters
        open={open}
        depth={depth}
        active={active}
        disabled={disabled}
        {...other}
      >
        {!subItem && icon && (
          <Box component="span" className="icon">
            {icon}
          </Box>
        )}

        {subItem && icon ? (
          <Box component="span" className="icon">
            {icon}
          </Box>
        ) : (
          <Box component="span" className="sub-icon" />
        )}

        {title && (
          <Box component="span" sx={{ flex: '1 1 auto', minWidth: 0 }}>
            <Box component="span" className="label">
              {title}
            </Box>

            {caption && (
              <Tooltip title={caption} placement="top-start">
                <Box component="span" className="caption">
                  {caption}
                </Box>
              </Tooltip>
            )}
          </Box>
        )}

        {info && (
          <Box component="span" className="info">
            {info}
          </Box>
        )}

        {hasChild && (
          <Iconify
            width={16}
            className="arrow"
            icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
          />
        )}
      </StyledNavItem>
    );

    if (roles && !roles.includes(`${currentRole}`)) {
      return null;
    }

    if (hasChild) {
      return renderContent;
    }

    if (externalLink)
      return (
        <Link
          href={path}
          target="_blank"
          rel="noopener"
          color="inherit"
          underline="none"
          sx={{
            ...(disabled && {
              cursor: 'default',
            }),
          }}
        >
          {renderContent}
        </Link>
      );

    return (
      <Link
        component={RouterLink}
        href={path}
        color="inherit"
        underline="none"
        sx={{
          ...(disabled && {
            cursor: 'default',
          }),
        }}
      >
        {renderContent}
      </Link>
    );
  }
);

export default NavItem;

// ----------------------------------------------------------------------

const StyledNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<NavItemStateProps>(({ active, open, depth, theme }) => {
  const subItem = depth !== 1;
  const opened = open && !active;
  const deepSubItem = Number(depth) > 2;

  const noWrapStyles = {
    width: '100%',
    maxWidth: '100%',
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  } as const;

  const baseStyles = {
    item: {
      marginBottom: 4,
      borderRadius: 12,
      color: '#454F5B',
      padding: theme.spacing(0.75, 1.5, 0.75, 1.5),
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 8,
        bottom: 8,
        insetInlineStart: 0,
        width: 3,
        borderRadius: 4,
        backgroundColor: 'transparent',
        transition: theme.transitions.create(['background-color'], {
          duration: theme.transitions.duration.shorter,
        }),
      },
      '&:hover': {
        backgroundColor: alpha('#919EAB', 0.08),
      },
    },
    icon: {
      width: 28,
      height: 28,
      flexShrink: 0,
      marginRight: theme.spacing(2),
      opacity: 0.6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& > .svg-color': {
        width: 26,
        height: 26,
      },
      transition: theme.transitions.create(['opacity'], {
        duration: theme.transitions.duration.shorter,
      }),
    },
    label: {
      ...noWrapStyles,
      ...theme.typography.body1,
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: '0.95rem',
      letterSpacing: 0.3,
      opacity: 0.8,
      transition: theme.transitions.create(['opacity'], {
        duration: theme.transitions.duration.shorter,
      }),
    },
    caption: {
      ...noWrapStyles,
      ...theme.typography.caption,
      color: alpha('#454F5B', 0.5),
    },
    info: {
      display: 'inline-flex',
      marginLeft: theme.spacing(0.75),
    },
    arrow: {
      flexShrink: 0,
      marginLeft: theme.spacing(0.75),
      opacity: 0.4,
    },
  } as const;

  return {
    ...(!subItem && {
      ...baseStyles.item,
      minHeight: 48,
      marginX: theme.spacing(1),
      '& .icon': {
        ...baseStyles.icon,
      },
      '& .sub-icon': {
        display: 'none',
      },
      '& .label': {
        ...baseStyles.label,
      },
      '& .caption': {
        ...baseStyles.caption,
      },
      '& .info': {
        ...baseStyles.info,
      },
      '& .arrow': {
        ...baseStyles.arrow,
      },
      ...(active && {
        backgroundColor: alpha('#2065D1', 0.08),
        color: '#2065D1',
        '&::before': {
          backgroundColor: '#2065D1',
        },
        '& .icon': {
          opacity: 1,
        },
        '& .label': {
          opacity: 1,
          fontWeight: theme.typography.fontWeightSemiBold,
        },
        '&:hover': {
          backgroundColor: alpha('#2065D1', 0.12),
        },
      }),
      ...(opened && {
        backgroundColor: alpha('#919EAB', 0.06),
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: 0,
        '& .icon': {
          opacity: 1,
        },
        '& .label': {
          opacity: 1,
        },
      }),
    }),

    ...(subItem && {
      ...baseStyles.item,
      marginBottom: 0,
      borderRadius: 0,
      minHeight: 40,
      padding: theme.spacing(0.5, 1.5, 0.5, 1.5),
      backgroundColor: alpha('#2065D1', active ? 0.06 : 0),
      borderRight: active ? `2px solid #2065D1` : '2px solid transparent',
      color: active ? '#2065D1' : alpha('#454F5B', 0.75),
      '&:hover': {
        backgroundColor: alpha('#919EAB', 0.06),
      },
      '& .icon': {
        ...baseStyles.icon,
      },
      '& .sub-icon': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18,
        marginRight: theme.spacing(1.5),
        '&::before': {
          content: '""',
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: active ? '#2065D1' : alpha('#454F5B', 0.35),
          transition: theme.transitions.create(['transform', 'background-color'], {
            duration: theme.transitions.duration.shorter,
          }),
        },
      },
      '& .label': {
        ...baseStyles.label,
        opacity: active ? 1 : 0.75,
        fontSize: '0.9rem',
      },
      '& .caption': {
        ...baseStyles.caption,
      },
      '& .info': {
        ...baseStyles.info,
      },
      '& .arrow': {
        ...baseStyles.arrow,
      },
    }),

    ...(deepSubItem && {
      paddingLeft: `${theme.spacing(Number(depth))} !important`,
    }),
  };
});
