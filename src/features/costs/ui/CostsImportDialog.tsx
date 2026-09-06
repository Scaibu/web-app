'use client';

import React from 'react';
import { Upload, FileJson, X, AlertCircle, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../../../components/primitives/Dialog';
import { Button } from '../../../components/primitives/Button';
import { cn } from '../../../lib/utils/cn';

export interface CostsImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pastedJson: string;
  parseError: string | null;
  parseSuccess: boolean;
  onPastedJsonChange: (value: string) => void;
  onFileSelected: (file: File) => void;
  onConfirm: () => void;
  onClear: () => void;
}

export function CostsImportDialog({
  open,
  onOpenChange,
  pastedJson,
  parseError,
  parseSuccess,
  onPastedJsonChange,
  onFileSelected,
  onConfirm,
  onClear,
}: CostsImportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg flex flex-col gap-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
            <FileJson className="w-4 h-4 text-[hsl(var(--primary))]" />
            Import Cost Snapshot
          </DialogTitle>
          <DialogDescription>
            Paste or upload a JSON cost export to compare against live data.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wide text-[hsl(var(--muted-foreground))]">
            Paste JSON
          </span>
          <textarea
            id="costs-import-json-textarea"
            rows={8}
            value={pastedJson}
            onChange={(e) => onPastedJsonChange(e.target.value)}
            placeholder={'[\n  { "provider": "OpenAI", "model": "gpt-4o", "cost_usd": 850, "token_count": 14200000, "pct_of_total": 59.8 }\n]'}
            className={cn(
              'w-full rounded-[var(--radius-lg)] border border-[hsl(var(--input))] bg-[hsl(var(--background))]',
              'px-3 py-2 text-xs font-mono text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]',
              'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]',
              'resize-none transition-all duration-[var(--motion-duration-fast)]',
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[hsl(var(--border))]" />
          <span className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase font-bold">or</span>
          <div className="flex-1 h-px bg-[hsl(var(--border))]" />
        </div>

        <label
          htmlFor="costs-import-file"
          className={cn(
            'flex flex-col items-center gap-2 py-6 rounded-[var(--radius-lg)]',
            'border-2 border-dashed border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/.5)]',
            'cursor-pointer transition-colors duration-[var(--motion-duration-fast)]',
          )}
        >
          <Upload className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Click to upload a .json file</span>
          <input
            id="costs-import-file"
            type="file"
            accept=".json"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelected(file);
            }}
          />
        </label>

        {parseError && (
          <div className="flex items-center gap-2 p-2.5 rounded-[var(--radius-lg)] bg-[hsl(var(--destructive)/.1)] border border-[hsl(var(--destructive)/.3)]">
            <AlertCircle className="w-3.5 h-3.5 text-[hsl(var(--destructive))] shrink-0" />
            <span className="text-xs text-[hsl(var(--destructive))]">{parseError}</span>
          </div>
        )}

        {parseSuccess && !parseError && (
          <div className="flex items-center gap-2 p-2.5 rounded-[var(--radius-lg)] bg-[hsl(var(--severity-good)/.1)] border border-[hsl(var(--severity-good)/.3)]">
            <CheckCircle className="w-3.5 h-3.5 text-[hsl(var(--severity-good))] shrink-0" />
            <span className="text-xs text-[hsl(var(--severity-good))]">JSON parsed successfully. Ready to compare.</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            id="costs-import-confirm"
            variant="default"
            size="sm"
            className="flex-1"
            disabled={!parseSuccess}
            onClick={onConfirm}
          >
            Apply Snapshot
          </Button>
          <Button
            id="costs-import-clear"
            variant="outline"
            size="sm"
            onClick={onClear}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
          <DialogClose asChild>
            <Button id="costs-import-cancel" variant="ghost" size="sm">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
