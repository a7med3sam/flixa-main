'use client';

import type { CreateEmployeePayload, UpdateEmployeePayload } from 'src/types/employee';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';
import { useRef, useState, useEffect } from 'react';
import { useEmployee } from 'src/hooks/useEmployee';
import { FORM_GENDER_OPTIONS } from './employee.utils';

interface EmployeeFormProps {
  mode: 'create' | 'edit';
  employeeId?: string;
}

interface FormState {
  name: string;
  email: string;
  phoneNumber: string;
  userGender: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function AvatarPreview({ src, name, size = 80 }: { src?: string | null; name?: string; size?: number }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Preview'}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      <Iconify icon="mdi:camera-plus" style={{ width: size * 0.45, height: size * 0.45 }} />
    </div>
  );
}

export default function EmployeeForm({ mode, employeeId }: EmployeeFormProps) {
  const router = useRouter();
  const t = useTranslations('');
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    employee: initialData,
    loading: fetchLoading,
    isCreating,
    isUpdating,
    handleCreate,
    handleUpdate,
  } = useEmployee(employeeId);

  const isSubmitting = mode === 'create' ? isCreating : isUpdating;
  const loading = mode === 'edit' ? fetchLoading : false;

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phoneNumber: '',
    userGender: '',
    password: '',
    confirmPassword: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        userGender: initialData.userGender || '',
        password: '',
        confirmPassword: '',
        isActive: initialData.isActive ?? true,
      });
    }
  }, [mode, initialData]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      enqueueSnackbar('يرجى اختيار ملف صورة صالح (jpg, png, gif, webp)', { variant: 'error' });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      enqueueSnackbar('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', { variant: 'error' });
      return;
    }

    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setProfileImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'الاسم مطلوب';
    if (!form.email.trim()) {
      errs.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'البريد الإلكتروني غير صالح';
    }
    if (!form.phoneNumber.trim()) errs.phoneNumber = 'رقم الهاتف مطلوب';
    if (!form.userGender) errs.userGender = 'الجنس مطلوب';
    if (mode === 'create') {
      if (!form.password) {
        errs.password = 'كلمة المرور مطلوبة';
      } else if (form.password.length < 6) {
        errs.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      }
      if (form.password !== form.confirmPassword) {
        errs.confirmPassword = 'كلمة المرور غير متطابقة';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'create') {
      const payload: CreateEmployeePayload = {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        userGender: form.userGender,
        password: form.password,
        confirmPassword: form.confirmPassword,
        isActive: true,
        profileImage: profileImage ?? null,
      };
      await handleCreate(payload);
    } else if (employeeId) {
      const { password, confirmPassword, ...rest } = form;
      const payload: UpdateEmployeePayload = {
        ...rest,
        profileImage: profileImage ?? null,
      };
      await handleUpdate(payload);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-grey-500">{t('Global.Label.loading')}</p>
        </div>
      </div>
    );
  }

  const displaySrc = previewUrl || (mode === 'edit' ? initialData?.profileImage : null);

  return (
    <div className="min-h-screen bg-grey-50 dark:bg-[#1a1a1a] p-4 md:p-6">
      <div className="w-full">
        <div className="bg-white dark:bg-[#212B36] rounded-2xl shadow-card dark:shadow-cardDark overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-grey-200 dark:border-grey-700">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-grey-100 dark:hover:bg-grey-800 transition"
            aria-label="Go back"
          >
            <Iconify icon="mdi:arrow-right" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#263238] dark:text-white">
              {mode === 'create' ? 'إضافة موظف جديد' : 'تعديل بيانات الموظف'}
            </h1>
            <p className="text-sm text-grey-500 dark:text-grey-400 mt-0.5">
              {mode === 'create'
                ? 'أدخل بيانات الموظف الجديد'
                : `تعديل بيانات: ${initialData?.name || ''}`}
            </p>
          </div>
        </div>
        <div className="p-6">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center gap-3 pb-6 border-b border-grey-200 dark:border-grey-700">
            <div className="relative">
              <div className="ring-4 ring-white dark:ring-[#212B36] rounded-full shadow-lg">
                <AvatarPreview
                  src={displaySrc}
                  name={form.name || initialData?.name}
                  size={104}
                />
              </div>
              {profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition"
                >
                  <Iconify icon="mdi:close" className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              className="hidden"
              id="profile-image-input"
            />
            <label
              htmlFor="profile-image-input"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-solid border-grey-300 dark:border-grey-600 text-sm font-medium text-grey-700 dark:text-grey-200 hover:bg-grey-100 dark:hover:bg-grey-800 cursor-pointer transition"
            >
              <Iconify icon="mdi:camera" className="w-4 h-4" />
              {displaySrc ? t('Global.Label.update_photo') : t('Global.Label.upload_photo')}
            </label>
            <p className="text-xs text-grey-400">jpg, png, gif, webp — حد أقصى 5 ميجابايت</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldWrapper label={t('Global.Label.name')} error={errors.name} required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={isSubmitting}
                className={inputClass(errors.name)}
                placeholder={t('Pages.Messages.enter_name')}
              />
            </FieldWrapper>
            <FieldWrapper label={t('Global.Label.email')} error={errors.email} required>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={isSubmitting}
                className={inputClass(errors.email)}
                placeholder={t('Pages.Messages.enter_email')}
              />
            </FieldWrapper>
            <FieldWrapper label={t('Global.Label.phone')} error={errors.phoneNumber} required>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                disabled={isSubmitting}
                className={inputClass(errors.phoneNumber)}
                placeholder={t('Pages.Messages.enter_phone')}
              />
            </FieldWrapper>
            <FieldWrapper label={t('Global.Label.gender')} error={errors.userGender} required>
              <select
                value={form.userGender}
                onChange={(e) => setForm({ ...form, userGender: e.target.value })}
                disabled={isSubmitting}
                className={inputClass(errors.userGender)}
              >
                <option value="">{t('Pages.Messages.select_gender')}</option>
                {FORM_GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FieldWrapper>
            {mode === 'create' && (
              <>
                <FieldWrapper label={t('Global.Label.password')} error={errors.password} required>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    disabled={isSubmitting}
                    className={inputClass(errors.password)}
                    placeholder={t('Pages.Messages.enter_password')}
                  />
                </FieldWrapper>
                <FieldWrapper
                  label={t('Global.Label.confirm_password')}
                  error={errors.confirmPassword}
                  required
                >
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    disabled={isSubmitting}
                    className={inputClass(errors.confirmPassword)}
                    placeholder={t('Pages.Messages.confirm_password')}
                  />
                </FieldWrapper>
              </>
            )}
          </div>
          {mode === 'edit' && (
            <div className="flex items-center gap-3 pt-2">
              <label className="text-sm font-medium text-grey-700 dark:text-grey-300">
                {t('Global.Label.status')}
              </label>
              <button
                type="button"
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  form.isActive ? 'bg-[#2ecc71]' : 'bg-[#c4ccd4]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                    form.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${form.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {form.isActive ? t('Global.Label.active') : t('Global.Label.inactive')}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 pt-4 border-t border-grey-200 dark:border-grey-700">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-grey-700 dark:text-grey-200 border border-solid border-grey-300 dark:border-grey-600 hover:bg-grey-100 dark:hover:bg-grey-800 transition disabled:opacity-60"
            >
              {t('Global.Action.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {mode === 'create' ? t('Global.Action.create') : t('Global.Action.update')}
            </button>
          </div>
        </form>
        </div>
        </div>
      </div>
    </div>
  );
}

function FieldWrapper({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-grey-700 dark:text-grey-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(error?: string): string {
  const base =
    'w-full px-4 py-2.5 rounded-xl border border-solid bg-white dark:bg-grey-800 text-sm text-grey-800 dark:text-grey-200 focus:outline-none focus:ring-2 transition disabled:opacity-60';
  const border = error
    ? 'border-red-500 focus:ring-red-300'
    : 'border-grey-300 dark:border-grey-700 focus:ring-primary/30';
  return `${base} ${border}`;
}
