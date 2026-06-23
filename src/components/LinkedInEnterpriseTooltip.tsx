import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LinkedInEnterpriseTooltipProps {
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function LinkedInEnterpriseTooltip({
  children,
  side = 'bottom',
}: LinkedInEnterpriseTooltipProps) {
  const { t } = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex w-fit">{children}</span>
      </TooltipTrigger>
      <TooltipContent side={side} sideOffset={6} className="max-w-xs text-center">
        {t('linkedin.enterpriseRequired')}
      </TooltipContent>
    </Tooltip>
  );
}
