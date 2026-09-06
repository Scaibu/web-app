'use client';

import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils/cn';

export interface CostsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  resultCount?: number;
}

export function CostsSearchBar({
  value,
  onChange,
  placeholder = 'Search by provider or model…',
  isLoading = false,
  resultCount,
}: CostsSearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center w-full max-w-sm">
        {isLoading ? (
          <Loader2 className="absolute left-3 w-3.5 h-3.5 text-[hsl(var(--muted-foreground))] animate-spin pointer-events-none" />
        ) : (
          <Search className="absolute left-3 w-3.5 h-3.5 text-[hsl(var(--muted-foreground))] pointer-events-none" aria-hidden />
        )}
        <input
          id="costs-search-bar"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search provider or model"
          className={cn(
            'w-full pl-8 py-1.5 text-xs',
            value ? 'pr-8' : 'pr-3',
            'rounded-[var(--radius-lg)]',
            'border border-[hsl(var(--input))] bg-[hsl(var(--card))]',
            'text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]',
            'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))]',
            'transition-all duration-[var(--motion-duration-fast)]',
          )}
        />
        {value && !isLoading && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="absolute right-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-[var(--motion-duration-fast)]"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      {value && resultCount !== undefined && (
        <span className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] whitespace-nowrap shrink-0">
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
