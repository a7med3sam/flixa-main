'use client';
import { useMemo, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function useQuery<TQuery extends string>(
  queries: TQuery[],
  replace = false,
  scroll = false
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const values = useMemo(() => {
    return queries.reduce(
      (acc, cur) => {
        acc[cur] = searchParams.get(cur);
        return acc;
      },
      {} as Record<TQuery, string | null>
    );
  }, [queries, searchParams]);

  const setPathname = useCallback(
    (value: string, closeReplace = false) => {
      if (closeReplace != undefined ? closeReplace : replace) {
        router.replace(value, { scroll });
      } else {
        router.push(value, { scroll });
      }
    },
    [replace, router, scroll]
  );

  const clear = useCallback(
    (closeReplace = false) => {
      setPathname(pathname, closeReplace);
    },
    [pathname, setPathname]
  );

  const setQueries = useCallback(
    (items: Partial<Record<TQuery, string | null>>, closeReplace = false) => {
      const params = new URLSearchParams();
      for (const name in items) {
        const value = items[name];
        if (value) {
          params.set(name, value);
        } else if (params.has(name)) {
          params.delete(name);
        }
      }
      setPathname(`${pathname}?${params.toString()}`, closeReplace);
    },
    [pathname, setPathname]
  );

  const changeQueries = useCallback(
    (items: Partial<Record<TQuery, string | null>>, closeReplace = false) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const name in items) {
        const value = items[name];
        if (value) {
          params.set(name, value);
        } else if (params.has(name)) {
          params.delete(name);
        }
      }
      setPathname(`${pathname}?${params.toString()}`, closeReplace);
    },
    [pathname, searchParams, setPathname]
  );

  return { values, clear, setQueries, changeQueries };
}
