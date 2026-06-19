'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { _contentDetail } from 'src/_mock/_dashboard-content';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

interface Props {
  slug: string;
}

const PAGE_META: Record<string, { ar: string; en: string; icon: string; color: string }> = {
  'about-us': {
    ar: 'عن التطبيق',
    en: 'About Us',
    icon: 'mdi:information-outline',
    color: '#2065D1',
  },
  'terms-conditions': {
    ar: 'الشروط والأحكام',
    en: 'Terms & Conditions',
    icon: 'mdi:file-document-outline',
    color: '#7A0C2E',
  },
  'privacy-policy': {
    ar: 'سياسة الخصوصية',
    en: 'Privacy Policy',
    icon: 'mdi:shield-account-outline',
    color: '#118D57',
  },
};

// ----------------------------------------------------------------------

export default function ContentEditView({ slug }: Props) {
  const router = useRouter();
  const t = useTranslations();
  const detail = _contentDetail(slug);
  const meta = PAGE_META[slug] || PAGE_META['about-us'];

  const [title, setTitle] = useState(detail.title);
  const [content, setContent] = useState(detail.content);
  const [metaDescription, setMetaDescription] = useState(detail.metaDescription);
  const [metaKeywords, setMetaKeywords] = useState(detail.metaKeywords);
  const [status, setStatus] = useState(detail.status);
  const [dirty, setDirty] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
      setDirty(true);
    };

  const handleSave = () => {
    setSnackbar({ open: true, message: t('Pages.Content.save_success'), severity: 'success' });
    setDirty(false);
  };

  const handlePublishToggle = () => {
    const newStatus = status === 'published' ? 'draft' : 'published';
    setStatus(newStatus);
    setSnackbar({
      open: true,
      message:
        newStatus === 'published'
          ? t('Pages.Content.publish_success')
          : t('Pages.Content.draft_success'),
      severity: 'success',
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6">
        <CustomBreadcrumbs
          heading={meta.ar}
          links={[{ name: t('Pages.Content.manage_content'), href: '/content' }, { name: meta.ar }]}
          sx={{ mb: 3 }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Content Card */}
            <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-solid border-grey-200 dark:border-grey-700">
                <h3 className="text-sm font-bold text-[#263238] dark:text-white">
                  {t('Pages.Content.basic_content')}
                </h3>
              </div>
              <div className="px-6 py-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                    {t('Pages.Content.page_title_label')}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={handleChange(setTitle)}
                    className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                    {t('Pages.Content.page_content')}
                  </label>
                  <div className="p-2 rounded-xl border border-solid border-grey-200 dark:border-grey-700 bg-grey-50 dark:bg-grey-900">
                    <textarea
                      value={content}
                      onChange={handleChange(setContent)}
                      rows={18}
                      placeholder={t('Pages.Content.content_placeholder')}
                      className="w-full bg-white dark:bg-[#212B36] text-sm text-grey-800 dark:text-grey-200 leading-relaxed px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                      style={{ fontFamily: '"Cairo", sans-serif' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Card */}
            <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-solid border-grey-200 dark:border-grey-700">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-warning/10">
                  <Iconify
                    icon="mdi:search-web"
                    className="w-5 h-5 text-warning-dark dark:text-warning-light"
                  />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#263238] dark:text-white">
                    {t('Pages.Content.seo_title')}
                  </h3>
                  <p className="text-xs text-grey-500 dark:text-grey-400">
                    {t('Pages.Content.seo_subtitle')}
                  </p>
                </div>
              </div>
              <div className="px-6 py-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                    {t('Pages.Content.meta_description')}
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={handleChange(setMetaDescription)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                  />
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-xs text-grey-500 dark:text-grey-400">
                      {t('Pages.Content.meta_description_hint')}
                    </span>
                    <span
                      className={`text-xs ${
                        metaDescription.length > 160
                          ? 'font-bold text-error-dark dark:text-error-light'
                          : 'text-grey-500 dark:text-grey-400'
                      }`}
                    >
                      {t('Pages.Content.char_count', { count: metaDescription.length })}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1.5">
                    {t('Pages.Content.meta_keywords')}
                  </label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={handleChange(setMetaKeywords)}
                    placeholder={t('Pages.Content.meta_keywords_placeholder')}
                    className="w-full px-4 py-2.5 rounded-xl border border-solid border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                  <p className="text-xs text-grey-500 dark:text-grey-400 mt-1.5">
                    {t('Pages.Content.meta_keywords_hint')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Page Info Card */}
            <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-solid border-grey-200 dark:border-grey-700">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                  <Iconify
                    icon={meta.icon}
                    className="w-5 h-5 text-primary-dark dark:text-primary-light"
                  />
                </span>
                <h3 className="text-sm font-bold text-[#263238] dark:text-white">
                  {t('Pages.Content.page_info')}
                </h3>
              </div>
              <div className="divide-y divide-solid divide-grey-200 dark:divide-grey-700">
                <div className="flex items-center gap-4 px-6 py-3.5">
                  <span className="text-sm text-grey-500 dark:text-grey-400 w-24 shrink-0">
                    {t('Pages.Content.status_label')}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      status === 'published'
                        ? 'bg-success/10 text-success-dark dark:text-success-light border border-solid border-success/30'
                        : 'bg-warning/10 text-warning-dark dark:text-warning-light border border-solid border-warning/30'
                    }`}
                  >
                    {status === 'published'
                      ? t('Pages.Content.published')
                      : t('Pages.Content.draft')}
                  </span>
                </div>

                <div className="flex items-center gap-4 px-6 py-3.5">
                  <span className="text-sm text-grey-500 dark:text-grey-400 w-24 shrink-0">
                    {t('Pages.Content.language_label')}
                  </span>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-dark dark:text-primary-light border border-solid border-primary/30">
                    {t('Pages.Content.arabic')}
                  </span>
                </div>

                <div className="flex items-center gap-4 px-6 py-3.5">
                  <span className="text-sm text-grey-500 dark:text-grey-400 w-24 shrink-0">
                    {t('Pages.Content.url_label')}
                  </span>
                  <span className="text-xs font-mono text-primary-dark dark:text-primary-light ltr">
                    /{slug}
                  </span>
                </div>

                <div className="flex items-center gap-4 px-6 py-3.5">
                  <span className="text-sm text-grey-500 dark:text-grey-400 w-24 shrink-0">
                    {t('Pages.Content.views_label')}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-grey-600 dark:text-grey-300">
                    <Iconify icon="mdi:eye-outline" className="w-4 h-4 text-grey-400" />
                    {detail.views.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Publishing Info Card */}
            <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-solid border-grey-200 dark:border-grey-700">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-success/10">
                  <Iconify
                    icon="mdi:cloud-upload-outline"
                    className="w-5 h-5 text-success-dark dark:text-success-light"
                  />
                </span>
                <h3 className="text-sm font-bold text-[#263238] dark:text-white">
                  {t('Pages.Content.publishing')}
                </h3>
              </div>
              <div className="divide-y divide-solid divide-grey-200 dark:divide-grey-700">
                <div className="flex items-center gap-4 px-6 py-3.5">
                  <span className="text-sm text-grey-500 dark:text-grey-400 w-24 shrink-0">
                    {t('Pages.Content.last_updated_label')}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-grey-600 dark:text-grey-300">
                    <Iconify icon="mdi:clock-outline" className="w-4 h-4 text-grey-400" />
                    {fDate(detail.lastUpdated, 'dd/MM/yyyy، hh:mm a')}
                  </span>
                </div>

                <div className="flex items-center gap-4 px-6 py-3.5">
                  <span className="text-sm text-grey-500 dark:text-grey-400 w-24 shrink-0">
                    {t('Pages.Content.updated_by')}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-grey-600 dark:text-grey-300">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold">
                      {detail.updatedBy.charAt(0)}
                    </span>
                    {detail.updatedBy}
                  </span>
                </div>

                <div className="flex items-center gap-4 px-6 py-3.5">
                  <span className="text-sm text-grey-500 dark:text-grey-400 w-24 shrink-0">
                    {t('Pages.Content.publish_date')}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-grey-600 dark:text-grey-300">
                    <Iconify icon="mdi:calendar-outline" className="w-4 h-4 text-grey-400" />
                    {fDate(detail.publishedAt, 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-solid border-grey-200 dark:border-grey-700">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-grey-100 dark:bg-grey-800">
                  <Iconify
                    icon="mdi:lightning-bolt-outline"
                    className="w-5 h-5 text-grey-600 dark:text-grey-300"
                  />
                </span>
                <h3 className="text-sm font-bold text-[#263238] dark:text-white">
                  {t('Pages.Content.actions_title')}
                </h3>
              </div>
              <div className="px-6 py-5 space-y-3">
                <button
                  onClick={handleSave}
                  disabled={!dirty}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm transition-colors"
                >
                  <Iconify icon="mdi:content-save" className="w-4 h-4" />
                  {t('Pages.Content.save_changes')}
                </button>

                <button
                  onClick={handlePublishToggle}
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors ${
                    status === 'published'
                      ? 'border-2 border-solid border-warning/30 text-warning-dark dark:text-warning-light hover:bg-warning/10'
                      : 'bg-success hover:bg-success-light text-white'
                  }`}
                >
                  <Iconify
                    icon={status === 'published' ? 'mdi:eye-off-outline' : 'mdi:eye-check-outline'}
                    className="w-4 h-4"
                  />
                  {status === 'published'
                    ? t('Pages.Content.unpublish')
                    : t('Pages.Content.publish_page')}
                </button>

                <button
                  onClick={() => router.push('/content')}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-solid border-error/30 text-error-dark dark:text-error-light hover:bg-error/10 text-sm font-bold transition-colors"
                >
                  <Iconify icon="mdi:arrow-right" className="w-4 h-4" />
                  {t('Pages.Content.back_to_list')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {snackbar.open && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${
              snackbar.severity === 'success'
                ? 'bg-success-dark'
                : snackbar.severity === 'error'
                  ? 'bg-error-dark'
                  : 'bg-warning-dark'
            }`}
          >
            <Iconify
              icon={
                snackbar.severity === 'success'
                  ? 'mdi:check-circle'
                  : snackbar.severity === 'error'
                    ? 'mdi:alert-circle'
                    : 'mdi:alert'
              }
              className="w-5 h-5 shrink-0"
            />
            <span>{snackbar.message}</span>
            <button
              onClick={() => setSnackbar((prev) => ({ ...prev, open: false }))}
              className="mr-2 p-0.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <Iconify icon="mdi:close" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
