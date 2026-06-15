import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  ArrowRight,
  Code2,
  Copy,
  Eye,
  Globe,
  Layers,
  LayoutTemplate,
  MousePointerClick,
  Palette,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TEMPLATES } from '@/lib/templates';

const FEATURE_ICONS = [LayoutTemplate, MousePointerClick, Eye, Code2, Copy, Globe] as const;

const STEP_ICONS = [LayoutTemplate, Sparkles, Copy] as const;

function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="w-72 shrink-0 gap-3 py-5 sm:w-80">
      <CardHeader className="gap-3 px-5">
        <div className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
          <Icon className="size-4" />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function FeaturesMarquee({
  features,
}: {
  features: { title: string; description: string }[];
}) {
  const track = useMemo(
    () =>
      [...features, ...features].map((feature, index) => ({
        ...feature,
        key: `${feature.title}-${index}`,
        icon: FEATURE_ICONS[index % FEATURE_ICONS.length] ?? Layers,
      })),
    [features]
  );

  return (
    <div
      className="relative w-full overflow-hidden py-2"
      aria-label="Product features"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20" />

      <div className="home-features-marquee flex w-max gap-6 sm:gap-8">
        {track.map((feature) => (
          <FeatureCard
            key={feature.key}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
}

export function HomeLandingSections() {
  const { t } = useTranslation();

  const steps = t('home.steps.items', { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  const features = t('home.features.items', { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  return (
    <div className="flex w-full flex-col gap-16 pb-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4">
      <section className="space-y-8" aria-labelledby="home-how-it-works">
        <div className="space-y-2 text-center sm:text-left">
          <h2 id="home-how-it-works" className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t('home.howItWorksTitle')}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            {t('home.howItWorksSubtitle')}
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Sparkles;
            return (
              <li key={step.title}>
                <Card className="h-full gap-4 py-5">
                  <CardHeader className="gap-3 px-5">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                </Card>
              </li>
            );
          })}
        </ol>
      </section>
      </div>

      <section className="space-y-8" aria-labelledby="home-features">
        <div className="mx-auto max-w-5xl space-y-2 px-4 text-center sm:text-left">
          <h2 id="home-features" className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t('home.featuresTitle')}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            {t('home.featuresSubtitle')}
          </p>
        </div>

        <FeaturesMarquee features={features} />
      </section>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4">
      <section className="space-y-6" aria-labelledby="home-templates">
        <div className="space-y-2 text-center sm:text-left">
          <h2 id="home-templates" className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t('home.templatesTitle')}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            {t('home.templatesSubtitle')}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {TEMPLATES.map((template) => (
            <Card key={template.id} className="gap-0 py-0">
              <CardContent className="flex items-start gap-3 px-4 py-4">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Palette className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="font-medium leading-none">{template.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t(`home.templateDescriptions.${template.id}`)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="rounded-xl border border-border bg-muted/40 px-6 py-8 text-center sm:text-left"
        aria-labelledby="home-cta-bottom"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 id="home-cta-bottom" className="text-lg font-semibold tracking-tight sm:text-xl">
              {t('home.ctaTitle')}
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              {t('home.ctaSubtitle')}
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0 gap-2 self-center sm:self-auto">
            <Link to="/signatures">
              {t('home.createSignature')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
      </div>
    </div>
  );
}
