'use client';
import { usePathname, useSearchParams } from 'next/navigation';

// ----------------------------------------------------------------------

type ReturnType = boolean;

const isSearchParamsEqual = (...[first, second]: [URLSearchParams, URLSearchParams]) => {
  const isBothEmpty = first.size === 0 && second.size === 0;

  if (isBothEmpty) return true;

  const firstEntries = Array.from(first.entries());
  const secondEntries = Array.from(second.entries());

  return (
    firstEntries.every(([key, value]) => {
      return second.get(key) === value;
    }) &&
    secondEntries.every(([key, value]) => {
      return first.get(key) === value;
    })
  );
};

export function useActiveLink(path: string, deep = true): ReturnType {
  const pathname = usePathname().slice(3);
  const searchParams = useSearchParams();

  const checkPath = path.startsWith('#');

  const currentPath = path === '/' ? '/' : `${path}/`;

  const pathSearchParams = new URLSearchParams(path.split('?')[1]);

  const normalActive =
    !checkPath &&
    pathname === currentPath.split('?')[0] &&
    isSearchParamsEqual(searchParams, pathSearchParams);

  const deepActive = !checkPath && pathname.includes(currentPath);

  return deep ? deepActive : normalActive;
}
