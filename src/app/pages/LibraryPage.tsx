import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { SIMPLE_REVIEW_STEP } from '@/components/SimpleModeWizard';
import { SimpleModeLibrary } from '@/components/SimpleModeLibrary';
import { useUserContext } from '@/app/contexts/UserContext';
import { EDIT_ROUTE } from '@/app/routes/paths';

export function LibraryPage() {
  const navigate = useNavigate();
  const { beginCreateSession, deleteSavedItem, openSavedSession, savedLibrary } =
    useUserContext();

  const handleCreateNew = useCallback(() => {
    beginCreateSession();
    navigate(EDIT_ROUTE);
  }, [beginCreateSession, navigate]);

  const handleOpenSaved = useCallback(
    (id: string) => {
      if (!openSavedSession(id, SIMPLE_REVIEW_STEP)) return;
      navigate(EDIT_ROUTE);
    },
    [navigate, openSavedSession]
  );

  return (
    <SimpleModeLibrary
      items={savedLibrary}
      onCreateNew={handleCreateNew}
      onOpenSaved={handleOpenSaved}
      onDeleteSaved={deleteSavedItem}
    />
  );
}
