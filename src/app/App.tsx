import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AppHeader } from '@/components/AppHeader';
import { GitHubFooter } from '@/components/GitHubFooter';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useUserContext } from '@/app/contexts/UserContext';
import {
  EDIT_ADVANCED_ROUTE,
  EDIT_ROUTE,
} from '@/app/routes/paths';
import { TEMPLATES } from '@/templates';

export default function App() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    darkMode,
    handleTemplateChange,
    layoutVertical,
    selectedTemplateId,
    toggleLayout,
    toggleTheme,
  } = useUserContext();

  const mode =
    location.pathname === EDIT_ADVANCED_ROUTE
      ? 'advanced'
      : location.pathname === EDIT_ROUTE
        ? 'simple'
        : 'library';

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-background">
        <AppHeader
          templates={TEMPLATES}
          selectedTemplateId={selectedTemplateId}
          onTemplateChange={handleTemplateChange}
          language={i18n.language || 'en'}
          onLanguageChange={(value) => i18n.changeLanguage(value)}
          darkMode={darkMode}
          onThemeToggle={toggleTheme}
          layoutVertical={layoutVertical}
          onLayoutToggle={toggleLayout}
          mode={mode}
          onModeToggle={
            mode === 'library'
              ? undefined
              : () => navigate(mode === 'advanced' ? EDIT_ROUTE : EDIT_ADVANCED_ROUTE)
          }
        />

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4">
          <Outlet />
        </div>
        <GitHubFooter />
      </div>
    </TooltipProvider>
  );
}
