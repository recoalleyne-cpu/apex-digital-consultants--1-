import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../utils/cn';

type AdminSettingsAccordionProps = {
  title: string;
  description?: string;
  isOpen: boolean;
  onToggle: () => void;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  collapsedSummary?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  toggleLabels?: {
    open: string;
    closed: string;
  };
};

const DEFAULT_TOGGLE_LABELS = {
  open: 'Collapse',
  closed: 'Expand'
};

export const AdminSettingsAccordion = ({
  title,
  description,
  isOpen,
  onToggle,
  actions,
  badge,
  children,
  collapsedSummary,
  className,
  contentClassName,
  toggleLabels = DEFAULT_TOGGLE_LABELS
}: AdminSettingsAccordionProps) => {
  return (
    <section className={cn('rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-8', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-apple-gray-500">{title}</h3>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm sm:text-base leading-7 text-apple-gray-300">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {badge}
          {actions}
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
          >
            {isOpen ? toggleLabels.open : toggleLabels.closed}
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className={cn('mt-4', contentClassName)}>{children}</div>
      ) : collapsedSummary ? (
        <div className="mt-3">{collapsedSummary}</div>
      ) : null}
    </section>
  );
};
