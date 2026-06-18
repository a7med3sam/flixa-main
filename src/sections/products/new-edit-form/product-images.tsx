'use client';

import { CardContent } from '@mui/material';
import Card, { CardProps } from '@mui/material/Card/Card';
import { RHFUpload } from 'src/components/hook-form/rhf-upload';

import { useFormStore } from './form-store';

export default function ProductFormImages(props: CardProps) {
  const { labels } = useFormStore();
  return (
    <Card {...props}>
      <CardContent>
        <RHFUpload name="Images" label={labels.Images} multiple thumbnail />
      </CardContent>
    </Card>
  );
}
