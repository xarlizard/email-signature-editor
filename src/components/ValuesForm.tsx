import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
] as const;

interface ValuesFormProps {
  values: SignatureValues;
  onUpdate: (key: keyof SignatureValues, value: string) => void;
}

export function ValuesForm({ values, onUpdate }: ValuesFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="border values-card">
      <CardContent className="py-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {fieldConfig.map(({ key, labelKey }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={key} className="text-xs text-muted-foreground">
                {t(`fields.${labelKey}`)}
              </Label>
              <Input
                id={key}
                type={
                  key === 'EMAIL'
                    ? 'email'
                    : key === 'PHONE'
                      ? 'tel'
                      : key === 'IMAGE' ||
                          key === 'LINKEDIN_URL' ||
                          key === 'WEBSITE'
                        ? 'url'
                        : 'text'
                }
                value={values[key]}
                onChange={(e) => onUpdate(key, e.target.value)}
                className="h-8 text-sm bg-background text-foreground dark:bg-background"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
