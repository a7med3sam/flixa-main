'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSnackbar } from 'notistack';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/SharedTable/SharedTable';
import axios from 'src/utils/axios';
import { endpoints } from 'src/utils/endpoints';
import { headCellType, cellAlignment } from 'src/components/SharedTable/types';
import { Page, UpdatePageRequest } from 'src/types/content-page';

// ----------------------------------------------------------------------

const TABLE_HEAD: headCellType[] = [
  { id: 'slug', label: 'Pages.Content.title_col', align: cellAlignment.right },
  { id: 'description', label: 'Pages.Content.description_col', align: cellAlignment.right },
  { id: 'actions', label: 'Pages.Content.actions_col', align: cellAlignment.right },
];

// ----------------------------------------------------------------------

export default function ContentListView() {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const isAr = locale === 'ar';

  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ── Edit dialog state ──
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editForm, setEditForm] = useState<UpdatePageRequest>({ descriptionAr: '', descriptionEn: '' });
  const [saving, setSaving] = useState(false);

  // ──────────────────────────────────────────────
  // Fetch pages from API
  // ──────────────────────────────────────────────
  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<Page[]>(endpoints.pages.list);
      setPages(res.data ?? []);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to load pages', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  // ──────────────────────────────────────────────
  // Open / close edit dialog
  // ──────────────────────────────────────────────
  const handleOpenEdit = (page: Page) => {
    setSelectedPage(page);
    setEditForm({ descriptionAr: page.descriptionAr, descriptionEn: page.descriptionEn });
  };

  const handleCloseEdit = () => {
    if (saving) return;
    setSelectedPage(null);
  };

  // ──────────────────────────────────────────────
  // Save edited page via PUT /api/v1/admin/pages/{id}
  // ──────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      await axios.put<Page>(endpoints.pages.update(selectedPage.id), editForm);
      enqueueSnackbar(t('Pages.Content.save_success'), { variant: 'success' });
      // Update local state without refetching
      setPages((prev) =>
        prev.map((p) =>
          p.id === selectedPage.id ? { ...p, ...editForm } : p
        )
      );
      setSelectedPage(null);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to update page', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // ──────────────────────────────────────────────
  // Client-side search filter
  // ──────────────────────────────────────────────
  const filteredPages = useMemo(
    () =>
      pages.filter(
        (p) =>
          p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.descriptionAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [pages, searchTerm]
  );

  // ──────────────────────────────────────────────
  // Custom cell renderers
  // ──────────────────────────────────────────────
  const customRender = useMemo(
    () => ({
      slug: (row: Page) => (
        <span className="inline-flex items-center gap-1.5 font-medium text-grey-800 dark:text-grey-200">
          <Iconify icon="mdi:file-document-outline" className="w-4 h-4 text-primary shrink-0" />
          {row.slug}
        </span>
      ),
      description: (row: Page) => (
        <span
          className="max-w-xs truncate block text-grey-700 dark:text-grey-300"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          {(isAr ? row.descriptionAr : row.descriptionEn) || '—'}
        </span>
      ),
      actions: (row: Page) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-solid border-grey-300 dark:border-grey-700 text-grey-700 dark:text-grey-300 hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors"
          >
            {t('Pages.Content.edit_action')}
          </button>
        </div>
      ),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, isAr]
  );

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-solid border-grey-200 dark:border-grey-700">
          <div>
            <h2 className="text-base font-bold text-[#263238] dark:text-white">
              {t('Pages.Content.admin_title')}
            </h2>
            <p className="mt-0.5 text-sm text-grey-600 dark:text-grey-400">
              {t('Pages.Content.admin_subtitle')}
            </p>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-grey-500 dark:text-grey-400">
              <Iconify icon="mdi:magnify" className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder={t('Pages.Content.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-10 pe-4 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        {/* Table or Loading */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <SharedTable<Page>
            tableHead={TABLE_HEAD}
            data={filteredPages}
            count={filteredPages.length}
            customRender={customRender}
          />
        )}
      </div>

      {/* ── Edit Page Dialog ── */}
      <Dialog
        open={!!selectedPage}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}
        >
          <Typography variant="h6" fontWeight={700}>
            {t('Pages.Content.edit_action')} — {selectedPage?.slug}
          </Typography>
          <IconButton onClick={handleCloseEdit} disabled={saving} size="small">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} pt={1}>
            {/* Arabic description */}
            <div>
              <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                {t('Pages.Content.arabic_desc_label')}
              </label>
              <textarea
                dir="rtl"
                rows={5}
                value={editForm.descriptionAr}
                onChange={(e) => setEditForm((prev) => ({ ...prev, descriptionAr: e.target.value }))}
                disabled={saving}
                className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              />
            </div>

            {/* English description */}
            <div>
              <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                {t('Pages.Content.english_desc_label')}
              </label>
              <textarea
                dir="ltr"
                rows={5}
                value={editForm.descriptionEn}
                onChange={(e) => setEditForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                disabled={saving}
                className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              />
            </div>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={handleCloseEdit} disabled={saving} variant="outlined" color="inherit">
            {t('Global.Action.cancel') || 'إلغاء'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {saving ? '...' : t('Pages.Content.save_changes')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
