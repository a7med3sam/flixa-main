
'use client';
import React, { useState } from 'react';
import { ICONS } from 'src/config-icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { endpoints } from 'src/utils/endpoints';
import { deleteData } from 'src/utils/crud-fetch-api';
import { ContactUs } from 'src/types/static-page-type';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ConfirmDeleteDialog from 'src/components/custom-dialog/confirm-delete-dialog';
import { Box, Card, Stack, Avatar, Container, IconButton, Typography } from '@mui/material';

import NewEditSocialMediaDialog from './new-edit-dialog';

interface Props {
  data: ContactUs[];
}

export default function ContactUsView({ data }: Props) {
  const t = useTranslations();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContactUs | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDialog = (item?: ContactUs) => {
    setSelectedItem(item || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    router.refresh();
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    setIsDeleting(true);
    const res = await deleteData(endpoints.contactUs.delete(selectedDeleteId));
    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
    const deletedItem = data.find((item) => item.id === selectedDeleteId);

    if ('error' in res) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(
        t('Global.Server.Success.var_deleted', {
          var: t('Pages.ContactUs.title_var', {
            var: deletedItem?.nameAr || deletedItem?.nameEn || '',
          }),
        }),
        { variant: 'success' }
      );
      router.refresh();
    }
  };

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Nav.contact-us')}
        links={[{}]}
        actions={[
          {
            children: t('Global.Action.add'),
            startIcon: ICONS.global.add,
            onClick: () => handleOpenDialog(),
          },
        ]}
      />
      <Card sx={{ p: 3 }}>
        <Typography fontWeight="bold" color="success.main" mb={2}>
          {t('Pages.ContactUs.social_media_added')}
        </Typography>

        <Stack spacing={2}>
          {data.map((item) => (
            <Box
              key={item.id}
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
              flexWrap={{ xs: 'wrap', md: 'nowrap' }}
              alignItems="center"
              borderRadius={2}
              border="1px solid #DADFD6"
              bgcolor="#EEF3EF"
              px={2}
              py={1.5}
              gap={2}
            >
              {/* Content (URL or text) */}
              <Typography
                component="a"
                href={item.content}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  flex: { xs: 'none', md: 1 },
                  width: { xs: '100%', md: 'auto' },
                  color: '#1A1A1A',
                  textDecoration: 'none',
                  wordBreak: 'break-word',
                  order: { xs: 1, md: 0 },
                }}
              >
                {item.content}
              </Typography>

              {/* Display the name correctly */}
              <Typography
                fontWeight="bold"
                sx={{
                  width: { xs: 'auto', md: 120 },
                  minWidth: { xs: '100px', md: '120px' },
                  order: { xs: 0, md: 1 },
                }}
              >
                {item.name || '-' }
              </Typography>

              {/* Actions + Avatar */}
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                width={{ xs: '100%', md: 'auto' }}
                justifyContent={{ xs: 'space-between', md: 'flex-start' }}
                order={{ xs: 2, md: 2 }}
                mt={{ xs: 1.5, md: 0 }}
              >
                <IconButton
                  onClick={() => handleOpenDialog(item)}
                  sx={{
                    backgroundColor: '#E3F1E5',
                    color: '#2E7D32',
                    '&:hover': { backgroundColor: '#d0e7d5' },
                  }}
                >
                  {ICONS.global.edit}
                </IconButton>

                <IconButton
                  onClick={() => {
                    setSelectedDeleteId(item.id);
                    setSelectedItem(item); // store item for dialog name
                    setDeleteDialogOpen(true);
                  }}
                  sx={{
                    backgroundColor: '#FDECEA',
                    color: '#D32F2F',
                    '&:hover': { backgroundColor: '#f8d4d2' },
                  }}
                >
                  {ICONS.global.x}
                </IconButton>

                <Avatar
                  src={item.logoUrl}
                  alt={item.nameAr || item.nameEn || ''}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: '#fff',
                    border: '1px solid #ccc',
                    ml: { xs: 'auto', md: 2 },
                  }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </Card>

      {/* Add/Edit Dialog */}
      <NewEditSocialMediaDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        item={selectedItem || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        name={t('Pages.ContactUs.title_var', {
          var: selectedItem?.nameAr || selectedItem?.nameEn || '',
        })}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        isLoading={isDeleting}
        action={handleConfirmDelete}
      />
    </Container>
  );
}
