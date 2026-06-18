'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

export const invalidatePath = async (pathName: string) => {
  revalidatePath(pathName);
};

export const invalidateTag = async (tag: string) => {
  revalidateTag(tag);
};
