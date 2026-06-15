import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { TEMPLATES } from '@/lib/templates';
import { PageContent } from '@/pages/templates/components/PageContent';
import { useUserContext } from '@/contexts/UserContext';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const {
    deleteTemplateItem,
    duplicateTemplate,
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

  const handleDuplicateTemplate = useCallback(
    (id: string) => {
      if (!duplicateTemplate(id)) return;
      navigate("/templates/edit");
    },
    [duplicateTemplate, navigate]
  );

  return (
    <PageContent
      defaultTemplates={TEMPLATES}
      savedTemplates={savedTemplates}
      onOpenTemplate={handleOpenSaved}
      onDuplicateTemplate={handleDuplicateTemplate}
      onDeleteSaved={deleteTemplateItem}
    />
  );
}
