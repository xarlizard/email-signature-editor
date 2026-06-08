import { useTranslation } from 'react-i18next';
import { LayoutGrid, LayoutList, Moon, SlidersHorizontal, Sparkles, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Template } from '@/types';

const LANGUAGES = [
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
  { value: 'fr', label: 'FR' },
  { value: 'de', label: 'DE' },
  { value: 'it', label: 'IT' },
  { value: 'nl', label: 'NL' },
  { value: 'ca', label: 'CA' },
  { value: 'ru', label: 'RU' },
  { value: 'zh', label: 'ZH' },
] as const;

type SupportedLang = (typeof LANGUAGES)[number]['value'];
const SUPPORTED_VALUES = new Set<SupportedLang>(LANGUAGES.map((l) => l.value));

function normalizeLanguage(lang: string): SupportedLang {
  if (SUPPORTED_VALUES.has(lang as SupportedLang)) return lang as SupportedLang;
  const base = lang.split('-')[0] as SupportedLang;
  return SUPPORTED_VALUES.has(base) ? base : 'en';
}

interface AppHeaderProps {
  templates: Template[];
  selectedTemplateId: string;
  onTemplateChange: (id: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  darkMode: boolean;
  onThemeToggle: () => void;
  layoutVertical: boolean;
  onLayoutToggle: () => void;
  advancedMode: boolean;
  onAdvancedModeToggle: () => void;
}

export function AppHeader({
  templates,
  selectedTemplateId,
  onTemplateChange,
  language,
  onLanguageChange,
  darkMode,
  onThemeToggle,
  layoutVertical,
  onLayoutToggle,
  advancedMode,
  onAdvancedModeToggle,
}: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4">
      <div className="flex items-center gap-1">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          {t('app.title')}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {advancedMode && (
          <div className="flex items-center gap-2">
            <Label htmlFor="template" className="sr-only">
              {t('labels.template')}
            </Label>
            <Select value={selectedTemplateId} onValueChange={onTemplateChange}>
              <SelectTrigger
                id="template"
                className="h-8 w-[130px] border-0 bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover dark:bg-primary dark:hover:bg-primary-hover [&_svg]:text-primary-foreground [&_svg]:opacity-100"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((tmpl) => (
                  <SelectItem key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Select value={normalizeLanguage(language)} onValueChange={onLanguageChange}>
          <SelectTrigger
            className="h-8 w-[72px] border-0 bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover dark:bg-primary dark:hover:bg-primary-hover [&_svg]:text-primary-foreground [&_svg]:opacity-100"
            aria-label={t('language')}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={onAdvancedModeToggle}
                aria-label={
                  advancedMode ? t('actions.switchToSimple') : t('actions.switchToAdvanced')
                }
                className="h-8 gap-1.5 px-2.5"
              >
                {advancedMode ? (
                  <>
                    <Sparkles className="size-4" />
                    <span className="hidden sm:inline">{t('actions.simple')}</span>
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="size-4" />
                    <span className="hidden sm:inline">{t('actions.advanced')}</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {advancedMode ? t('actions.switchToSimple') : t('actions.switchToAdvanced')}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="icon"
                onClick={onThemeToggle}
                aria-label={darkMode ? t('actions.lightMode') : t('actions.darkMode')}
                className="size-8"
              >
                {darkMode ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {darkMode ? t('actions.lightMode') : t('actions.darkMode')}
            </TooltipContent>
          </Tooltip>

          {advancedMode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  onClick={onLayoutToggle}
                  aria-label={
                    layoutVertical
                      ? t('actions.layoutHorizontal')
                      : t('actions.layoutVertical')
                  }
                  className="size-8"
                >
                  {layoutVertical ? (
                    <LayoutGrid className="size-4" />
                  ) : (
                    <LayoutList className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {layoutVertical
                  ? t('actions.layoutHorizontal')
                  : t('actions.layoutVertical')}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
}
