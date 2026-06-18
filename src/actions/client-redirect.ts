'use server';

import { redirect } from 'next/navigation';

export const clientRedirect = async (path: string) => {
  return redirect(path);
};
