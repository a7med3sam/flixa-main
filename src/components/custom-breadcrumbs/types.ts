import { LoadingButtonProps } from '@mui/lab';
import { BreadcrumbsProps } from '@mui/material/Breadcrumbs';

// ----------------------------------------------------------------------

export type BreadcrumbsLinkProps = {
  name?: string;
  href?: string;
  icon?: React.ReactElement;
};

export interface CustomBreadcrumbsProps extends BreadcrumbsProps {
  heading?: string;
  activeLast?: boolean;
  actions?: LoadingButtonProps[];
  links: BreadcrumbsLinkProps[];
}
