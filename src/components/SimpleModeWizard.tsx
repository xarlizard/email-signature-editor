import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Copy, Library, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TemplatePickerGrid } from '@/components/TemplatePickerGrid';
import { cn } from '@/lib/utils';
import type { SignatureValues } from '@/types';

const fieldConfig = [
  { key: 'NAME' as const, labelKey: 'name' as const },
  { key: 'POSITION' as const, labelKey: 'position' as const },
  { key: 'COMPANY' as const, labelKey: 'company' as const },
  { key: 'LINKEDIN_URL' as const, labelKey: 'linkedinUrl' as const },
  { key: 'PHONE' as const, labelKey: 'phone' as const },
  { key: 'EMAIL' as const, labelKey: 'email' as const },
  { key: 'WEBSITE' as const, labelKey: 'website' as const },
  { key: 'IMAGE' as const, labelKey: 'image' as const },
  { key: 'DISCLAIMER' as const, labelKey: 'disclaimer' as const },
] as const;

const FIELD_STEPS = fieldConfig.length;
/** Step index 0 = template picker; 1..FIELD_STEPS = fields; last = review */
const STEP_TEMPLATE = 0;
const REVIEW_STEP = FIELD_STEPS + 1;
const TOTAL_STEPS = FIELD_STEPS + 2;

/** Step index for the review / preview step (after template + all field steps). */
export const SIMPLE_REVIEW_STEP = REVIEW_STEP;

interface SimpleModeWizardProps {
  values: SignatureValues;
  onUpdate: (key: keyof SignatureValues, value: string) => void;
  resolvedHtml: string;
  onCopyHtml: () => void;
  onCopyPreview: () => void;
  copiedHtml: boolean;
  copiedPreview: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onIframeLoad: () => void;
  initialStep?: number;
  onBackToLibrary: () => void;
  onSave: () => void;
  saveSuccess: boolean;
  selectedTemplateId: string;
  onTemplateApply: (templateId: string) => void;
}

export function SimpleModeWizard({
  values,
  onUpdate,
  resolvedHtml,
  onCopyHtml,
  onCopyPreview,
  copiedHtml,
  copiedPreview,
  iframeRef,
  onIframeLoad,
  initialStep = 0,
  onBackToLibrary,
  onSave,
  saveSuccess,
  selectedTemplateId,
  onTemplateApply,
}: SimpleModeWizardProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(initialStep);

  const isTemplateStep = step === STEP_TEMPLATE;
  const isReview = step === REVIEW_STEP;
  const fieldStepIndex = step - 1;
  const isFieldStep = step >= 1 && step <= FIELD_STEPS;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const handlePickTemplate = (templateId: string) => {
    onTemplateApply(templateId);
    setStep(1);
  };

  const advanceStep = () => {
    if (isTemplateStep) {
      setStep(1);
    } else {
      setStep((s) => Math.min(REVIEW_STEP, s + 1));
    }
  };

  const handleFieldInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    advanceStep();
  };

  return (
    <div
      className={cn(
        'mx-auto flex w-full flex-1 flex-col justify-center gap-6 py-6',
        isTemplateStep ? 'max-w-7xl' : 'max-w-lg'
      )}
    >
      <div className="flex justify-start">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBackToLibrary}
          className="gap-1.5 text-muted-foreground"
        >
          <Library className="size-4" />
          {t('simpleMode.backToLibrary')}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {t('simpleMode.step', { current: step + 1, total: TOTAL_STEPS })}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isTemplateStep ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold">{t('simpleMode.chooseTemplate')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('simpleMode.chooseTemplateDescription')}
            </p>
          </div>
          <TemplatePickerGrid
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handlePickTemplate}
          />
        </div>
      ) : (
        <Card className="border shadow-sm">
          <CardContent className="space-y-6 pt-6">
            {isFieldStep ? (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor={`wizard-${fieldConfig[fieldStepIndex].key}`}
                    className="text-base font-medium"
                  >
                    {t(`fields.${fieldConfig[fieldStepIndex].labelKey}`)}
                  </Label>
                  {fieldConfig[fieldStepIndex].key === 'DISCLAIMER' ? (
                    <Textarea
                      id={`wizard-${fieldConfig[fieldStepIndex].key}`}
                      value={values.DISCLAIMER}
                      onChange={(e) =>
                        onUpdate('DISCLAIMER', e.target.value)
                      }
                      rows={5}
                      className="min-h-[120px] text-base"
                      placeholder={t('fields.disclaimerPlaceholder')}
                      autoFocus
                    />
                  ) : (
                    <Input
                      id={`wizard-${fieldConfig[fieldStepIndex].key}`}
                      type={
                        fieldConfig[fieldStepIndex].key === 'EMAIL'
                          ? 'email'
                          : fieldConfig[fieldStepIndex].key === 'PHONE'
                            ? 'tel'
                            : fieldConfig[fieldStepIndex].key === 'IMAGE' ||
                                fieldConfig[fieldStepIndex].key === 'LINKEDIN_URL' ||
                                fieldConfig[fieldStepIndex].key === 'WEBSITE'
                              ? 'url'
                              : 'text'
                      }
                      value={values[fieldConfig[fieldStepIndex].key]}
                      onChange={(e) =>
                        onUpdate(fieldConfig[fieldStepIndex].key, e.target.value)
                      }
                      onKeyDown={handleFieldInputKeyDown}
                      className="h-11 text-base"
                      autoFocus
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {fieldConfig[fieldStepIndex].key === 'DISCLAIMER'
                    ? t('simpleMode.fieldHintDisclaimer')
                    : t('simpleMode.fieldHint')}
                </p>
              </>
            ) : isReview ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold">{t('simpleMode.reviewTitle')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('simpleMode.reviewDescription')}
                  </p>
                </div>
                <div className="overflow-hidden rounded-lg border bg-[oklch(0.98_0.005_0)]">
                  <iframe
                    ref={iframeRef}
                    title="Signature preview"
                    className="block min-h-[200px] w-full border-0"
                    onLoad={onIframeLoad}
                    srcDoc={
                      '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:16px;font-family:Arial,sans-serif;}</style></head><body>' +
                      resolvedHtml +
                      '</body></html>'
                    }
                    sandbox="allow-same-origin"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onCopyPreview}
                    className="gap-1.5"
                  >
                    <Copy className="size-3.5" />
                    {copiedPreview ? t('actions.copied') : t('simpleMode.copyForGmail')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCopyHtml}
                    className="gap-1.5"
                  >
                    <Copy className="size-3.5" />
                    {copiedHtml ? t('actions.copied') : t('simpleMode.copyHtml')}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onSave}
                    className="gap-1.5"
                  >
                    <Save className="size-3.5" />
                    {saveSuccess ? t('simpleMode.saved') : t('simpleMode.save')}
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep((s) => Math.max(STEP_TEMPLATE, s - 1))}
          disabled={step === STEP_TEMPLATE}
          className="gap-1"
        >
          <ChevronLeft className="size-4" />
          {t('simpleMode.back')}
        </Button>
        {!isReview ? (
          <Button
            type="button"
            onClick={advanceStep}
            className="gap-1"
          >
            {isTemplateStep
              ? t('simpleMode.next')
              : step === FIELD_STEPS
                ? t('simpleMode.review')
                : t('simpleMode.next')}
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
              className="gap-1"
            >
              {t('simpleMode.editAgain')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
