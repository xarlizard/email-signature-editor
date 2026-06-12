import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { TEMPLATES } from '@/lib/templates';
import { PageContent } from '@/pages/templates/components/PageContent';
import { useUserContext } from '@/contexts/UserContext';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const {
    deleteTemplateItem,
    openTemplateEditor,
    savedTemplates,
  } = useUserContext();

  const handleOpenSaved = useCallback(
    (id: string) => {
      if (!openTemplateEditor(id)) return;
      navigate("/templates/edit");
    },
    [navigate, openTemplateEditor]
  );

  return (
    <PageContent
      defaultTemplates={TEMPLATES}
      savedTemplates={savedTemplates}
      onOpenTemplate={handleOpenSaved}
      onDeleteSaved={deleteTemplateItem}
    />
  );
}
