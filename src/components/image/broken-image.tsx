import { ICONS } from 'src/config-icons';
import { Avatar, AvatarProps } from '@mui/material';

export default function BrokenImage(props: Omit<AvatarProps, 'children'>) {
  return <Avatar {...props}>{ICONS.global.brokenImage}</Avatar>;
}
