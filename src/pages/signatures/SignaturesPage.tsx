import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { PageContent } from '@/pages/signatures/components/PageContent';
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
      if (!openSavedSession(id, 999)) return;
      navigate("/signatures/edit");
    },
    [navigate, openSavedSession]
  );

  return (
    <PageContent
      items={savedLibrary}
      onCreateNew={handleCreateNew}
      onOpenSaved={handleOpenSaved}
      onDeleteSaved={deleteSavedItem}
    />
  );
}
