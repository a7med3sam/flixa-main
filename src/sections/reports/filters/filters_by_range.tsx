'use client';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'src/components/use-query';
import { Box, TextField, Autocomplete } from '@mui/material';

const DateRangeFilter = () => {
  const t = useTranslations();
  const { changeQueries } = useQuery(['StartDate', 'EndDate'], true);

  const DATE_RANGE_OPTIONS = [
    { label: t('Pages.Reports.dateFilter.day'), value: 'day' },
    { label: t('Pages.Reports.dateFilter.week'), value: 'week' },
    { label: t('Pages.Reports.dateFilter.month'), value: 'month' },
  ];

  const [selectedRange, setSelectedRange] = useState<{
    label: string;
    value: string;
  } | null>(null);

useEffect(() => {
  const endDate = dayjs().startOf('day');
  let startDate = endDate;

  if (selectedRange?.value === 'week') {
    startDate = endDate.subtract(6, 'day');
  } else if (selectedRange?.value === 'month') {
    startDate = endDate.subtract(29, 'day');
  }

  changeQueries({
    StartDate: selectedRange ? startDate.format('YYYY-MM-DD') : '',
    EndDate: selectedRange ? endDate.format('YYYY-MM-DD') : ''
  });
}, [selectedRange, changeQueries]);

  const handleRangeSelect = (option: { label: string; value: string } | null) => {
    setSelectedRange(option);
  };

  return (
    <Box sx={{ width: 250 }}>
      <Autocomplete
        options={DATE_RANGE_OPTIONS}
        value={selectedRange}
        onChange={(_, newValue) => handleRangeSelect(newValue)}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField {...params} label={t('Pages.Reports.select_date_range')} />
        )}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        clearOnEscape
        sx={{bgcolor:'#fefefe',color:'#ABBFAB40'}}
      />
    </Box>
  );
};

export default DateRangeFilter;