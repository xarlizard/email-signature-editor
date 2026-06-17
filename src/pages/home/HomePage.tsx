import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { FaLinkedin } from 'react-icons/fa';
import { ArrowRight, Import, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HomeLandingSections } from '@/pages/home/components/HomeLandingSections';
import { SignatureShowcaseCarousel } from '@/pages/home/components/SignatureShowcaseCarousel';

export default function HomePage() {
  const { t } = useTranslation();

  const handleImportFromLinkedin = useCallback(() => {
    // LinkedIn import flow to be implemented
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col gap-12 py-6">
      <header className="mx-auto w-full max-w-5xl space-y-2 px-4 text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t('app.title')}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t('app.subtitle')}
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <SignatureShowcaseCarousel />

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/signatures">
              {t('home.createSignature')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={handleImportFromLinkedin}
          >
            <Import className="size-4" />
            <FaLinkedin className="size-4" />
            {t('signatures.importFromLinkedin')}
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/templates">
              <LayoutTemplate className="size-4" />
              {t('home.browseTemplates')}
            </Link>
          </Button>
        </div>
      </div>

      <HomeLandingSections />
    </div>
  );
}
