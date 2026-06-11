import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LibraryCardProps {
  /** The main content of the card (e.g., an iframe preview) */
  content: React.ReactNode;
  /** The primary title shown on the card */
  title: string;
  /** Optional subtitle for additional context (e.g., creation date or status) */
  subtitle?: string;
  /** Actions to be displayed in the footer of the card, such as buttons */
  footerActions?: React.ReactNode;
  /** Click handler for the entire card */
  onClick?: () => void;
  /** Keyboard event handler for accessibility (e.g., Enter/Space to trigger onClick) */
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function LibraryCard({
  content,
  title,
  subtitle,
  footerActions,
  onClick,
  onKeyDown,
}: LibraryCardProps) {
  return (
    <li className="min-w-0">
      <Card
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className="flex h-full cursor-pointer flex-col gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md"
      >
        {content}
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium leading-snug">{title}</p>
              {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {footerActions}
            </div>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}