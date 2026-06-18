'use client';
import { Icon } from '@iconify/react';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { DriverDetailsType } from 'src/types/driver';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  Box,
  Card,
  Stack,
  Button,
  Avatar,
  Container,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

import EditDriverStatusDialog from '../change-status';

interface Props {
  driverDetails: DriverDetailsType;
}

const LabeledData = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
    <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold', mr: 1 }}>
      {label} :
    </Box>
    <Box component="span" sx={{ color: 'text.primary' }}>
      {value || '---'}
    </Box>
  </Typography>
);

const ImageDisplay = ({
  src,
  altText,
  size = 120,
}: {
  src?: string;
  altText: string;
  size?: number;
}) => (
  <Box
    sx={{
      width: size,
      height: size,
      border: '1px dashed gray',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 2,
    }}
  >
    {src ? (
      <Avatar src={src} sx={{ width: '100%', height: '100%', borderRadius: 2 }} />
    ) : (
      <Typography variant="caption">{altText}</Typography>
    )}
  </Box>
);

export default function DriverDetails({ driverDetails }: Props) {
  const [localDriverDetails, setLocalDriverDetails] = useState(driverDetails);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const t = useTranslations('');
  const router = useRouter();

  useEffect(() => {
    setLocalDriverDetails(driverDetails);
  }, [driverDetails]);

  const handleOpenStatusDialog = () => {
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
  };

  const handleStatusUpdate = (updatedDriver: DriverDetailsType) => {
    setLocalDriverDetails(updatedDriver);
    handleCloseStatusDialog();
  };

  // Action buttons data
  const actionButtons = [
    {
      icon: 'ic:baseline-edit',
      expandable: true,
      onClick: handleOpenStatusDialog,
      text: t('Global.Action.edit') + ' ' + t('Global.Label.status'),
    },
    {
      icon: 'mdi:file-edit-outline',
      onClick: () => router.push(paths.controlPanel.users.drivers.edit(localDriverDetails.id)),
      expandable: true,
      text: t('Global.Action.edit') + ' ' + t('Pages.Orders.driver_name'),
    }
  ];

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(navigator.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 0 }}>
        <CustomBreadcrumbs
          heading={t('Pages.Drivers.table.name')}
          links={[
            { name: t('Pages.Drivers.driver_title'), href: paths.controlPanel.users.drivers.list },
            { name: t('Pages.Drivers.table.name') },
          ]}
          actions={[
            {
              children: t('Pages.Drivers.display_orders'),
              variant: 'contained',
              onClick: () => {
                router.push(paths.controlPanel.users.drivers.driverOrders(localDriverDetails.id));
              },
              sx: { minWidth: 120, maxWidth: '100%' },
            }
          ]}
          activeLast
        />

        <Card>
          <CardContent>
            {/* Main Content: Personal, Address, Actions */}
            <Stack
              direction={{ xs: 'column', md: 'row' }} // Change from row to column on small screens
              justifyContent="space-between"
              spacing={{ xs: 3, md: 1 }} // Add more vertical spacing on mobile
            >

              {/* Address & Dates Section */}
              <Stack spacing={1}
                flex={{ xs: 'none', md: 1.5 }} // Remove fixed flex on mobile
                width={{ xs: '100%', md: 'auto' }} // Take full width on mobile
              >
                <LabeledData label={t('Pages.Drivers.personal.address')} value={localDriverDetails.address} />
                <LabeledData
                  label={t('Pages.Drivers.table.registrationDate')}
                  value={formatDate(localDriverDetails.creationTime)}
                />
                <LabeledData
                  label={t('Pages.Drivers.table.status')}
                  value={localDriverDetails.status}
                />
                <LabeledData label={t('Pages.Drivers.personal.city')} value={localDriverDetails.address} />
                <LabeledData label={t('Pages.Drivers.table.workArea')} value={localDriverDetails.address} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Typography color='primary.main' sx={{fontWeight: 'bold', mr: 1}}>{t('Pages.Drivers.images.profilePhoto')} :</Typography>
                    <ImageDisplay
                      src={localDriverDetails.profileImage}
                      altText={t('Pages.Drivers.images.profilePhoto')}
                    />
                </Box>
              </Stack>

              {/* Personal Info Section */}
              <Stack spacing={1}
                flex={{ xs: 'none', md: 1 }} // Remove fixed flex on mobile
                width={{ xs: '100%', md: 'auto' }} // Take full width on mobile
              >
                <LabeledData label={t('Pages.Drivers.table.name')} value={localDriverDetails.name} />
                <LabeledData label={t('Pages.Drivers.table.phoneNumber')} value={localDriverDetails.phoneNumber} />
                <LabeledData label={t('Pages.Drivers.table.email')} value={localDriverDetails.email} />
                <LabeledData label={t('Pages.Drivers.table.idNumber')} value={localDriverDetails.idNumber} />
                <LabeledData label={t('Pages.Drivers.personal.birthDate')} value={localDriverDetails.address} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Typography color='primary.main' sx={{fontWeight: 'bold', mr: 1}}>{t('Pages.Drivers.images.idPhoto')} :</Typography>
                <ImageDisplay
                  src={localDriverDetails.idImageUrl}
                  altText={t('Pages.Drivers.images.idPhoto')}
                />
                </Box>
              </Stack>

              {/* Action Buttons Section */}
              <Stack
                spacing={1}
                flex={{ xs: 'none', md: 1 }} // Remove fixed flex on mobile
                width={{ xs: '100%', md: 'auto' }} // Take full width on mobile
                alignItems={{ xs: 'flex-start', md: 'flex-end' }} // Align left on mobile, right on desktop
              >
                {actionButtons.map((button, index) => (
                  button.expandable ? (
                    <Button
                      key={index}
                      variant="contained"
                      sx={{
                        // ... (Your original fixed/hover styles remain for button size/appearance)
                        bgcolor: '#E0F2F1',
                        color: '#33691E',
                        fontSize: '12px',
                        borderRadius: 2,
                        px: 1,
                        py: 1,
                        minWidth: { xs: '100%', md: '56px' }, // Fix: Take full width on mobile
                        maxWidth: { xs: '100%', md: '60px' },
                        minHeight: '56px',
                        maxHeight: '60px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', md: 'center' }, // Center text on mobile
                        transition: 'all 0.3s ease',
                        gap: 1,
                        '&:hover': {
                          bgcolor: '#B2DFDB',
                          maxWidth: { xs: '100%', md: '160px' },
                          px: 2,
                          justifyContent: { xs: 'center', md: 'flex-start' },
                        },
                        '& .text': {
                          opacity: { xs: 1, md: 0 }, // Fix: Keep text visible on mobile
                          width: { xs: 'auto', md: 0 },
                          transition: 'all 0.3s ease',
                        },
                        '&:hover .text': {
                          opacity: 1,
                          width: 'auto',
                        },
                      }}
                      onClick={button.onClick}
                    >
                      <Icon icon={button.icon} width="20" />
                      <span className="text">{button.text} </span>
                    </Button>
                  ) : (
                    <IconButton
                      key={index}
                      sx={{
                        bgcolor: '#E0F2F1',
                        borderRadius: 2,
                        width: 40,
                        height: 40,
                        '&:hover': { bgcolor: '#B2DFDB' },
                      }}
                      onClick={button.onClick}
                    >
                      <Icon icon={button.icon} width="24" />
                    </IconButton>
                  )
                ))}
              </Stack>

            </Stack>
          </CardContent>
        </Card>

        {/* Vehicle Info */}
        {localDriverDetails.vehicles.length > 0 && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Stack
                direction={{ xs: 'column', md: 'row' }} // Change from row to column on small screens
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={3} // Add spacing when stacked vertically
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }} // Change from row to column on small screens
                  spacing={2}
                  alignItems="flex-start"
                >
                  {/* License Image */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {t('Pages.Drivers.images.licensePhoto')} :
                    </Typography>
                    <ImageDisplay
                      src={localDriverDetails.vehicles[0].licenseImageUrl}
                      altText={t('Pages.Drivers.images.licensePhoto')}
                      size={150}
                    />
                  </Box>

                  {/* Vehicle Details (in a column stack) */}
                  <Stack spacing={1} flex={1} width={{ xs: '100%', md: 'auto' }}>
                    <LabeledData
                      label={t('Pages.Drivers.vehicle.type')}
                      value={localDriverDetails.vehicles[0].vehicleType}
                    />
                    <LabeledData
                      label={t('Pages.Drivers.vehicle.color')}
                      value={localDriverDetails.vehicles[0].color}
                    />
                    <LabeledData
                      label={t('Pages.Drivers.vehicle.licenseNumber')}
                      value={localDriverDetails.vehicles[0].licenseNumber}
                    />
                    <LabeledData
                      label={t('Pages.Drivers.table.phoneNumber')}
                      value={localDriverDetails.phoneNumber}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Container>

      <EditDriverStatusDialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        driver={localDriverDetails}
        onStatusUpdated={handleStatusUpdate}
      />
    </>
  );
}