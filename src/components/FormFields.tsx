import React from 'react';

export function Field({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

export const inputCls =
  'w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 ' +
  'transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 ' +
  'dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 ' +
  'dark:focus:border-blue-400 dark:focus:bg-zinc-900 dark:focus:ring-blue-400/20';