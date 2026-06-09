import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { SIMPLE_REVIEW_STEP } from '@/pages/signatures-edit/components/SignatureWizard';
import { SimpleModeLibrary } from '@/pages/signatures/components/SimpleModeLibrary';
import { useUserContext } from '@/contexts/UserContext';

export default function SignaturesPage() {
  const navigate = useNavigate();
  const { beginCreateSession, deleteSavedItem, openSavedSession, savedLibrary } =
    useUserContext();

  const handleCreateNew = useCallback(() => {
    beginCreateSession();
    navigate("/signatures/edit");
  }, [beginCreateSession, navigate]);

  const handleOpenSaved = useCallback(
    (id: string) => {
      if (!openSavedSession(id, SIMPLE_REVIEW_STEP)) return;
      navigate("/signatures/edit");
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
