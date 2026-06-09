import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  deleteSavedSignature,
  loadSavedSignatures,
  upsertSavedSignature,
  type SavedSignature,
} from '@/lib/savedSignatures';
import { TEMPLATES, resolveTemplate } from '@/lib/templates';
import { DEFAULT_SIGNATURE_VALUES, type SignatureValues } from '@/types/types';

interface UserContextValue {
  selectedTemplateId: string;
  templateHtml: string;
  values: SignatureValues;
  resolvedHtml: string;
  savedLibrary: SavedSignature[];
  editingSavedId: string | null;
  saveSuccess: boolean;
  darkMode: boolean;
  layoutVertical: boolean;
  simpleStep: number;
  handleTemplateChange: (templateId: string) => void;
  applyTemplateWithDefaults: (templateId: string) => void;
  updateValue: (key: keyof SignatureValues, value: string) => void;
  setTemplateHtml: (value: string) => void;
  setSimpleStep: (step: number) => void;
  toggleTheme: () => void;
  toggleLayout: () => void;
  refreshSavedLibrary: () => void;
  beginCreateSession: () => void;
  openSavedSession: (id: string, initialStep: number) => boolean;
  saveSignature: () => void;
  deleteSavedItem: (id: string) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

function getInitialTemplate() {
  return TEMPLATES[0];
}

export function UserProvider({ children }: { children: ReactNode }) {
  const initialTemplate = getInitialTemplate();
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    initialTemplate?.id ?? 'default'
  );
  const [templateHtml, setTemplateHtmlState] = useState(initialTemplate?.html ?? '');
  const [values, setValues] = useState<SignatureValues>(() => ({
    ...DEFAULT_SIGNATURE_VALUES,
    ...initialTemplate?.defaultValues,
  }));
  const [editingSavedId, setEditingSavedId] = useState<string | null>(null);
  const [savedLibrary, setSavedLibrary] = useState<SavedSignature[]>(() =>
    typeof window !== 'undefined' ? loadSavedSignatures() : []
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [layoutVertical, setLayoutVertical] = useState(false);
  const [simpleStep, setSimpleStep] = useState(0);
  const [editMode, setEditMode] = useState<'simple' | 'advanced'>('simple');

  const resolvedHtml = useMemo(
    () => resolveTemplate(templateHtml, values),
    [templateHtml, values]
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      return;
    }
    document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    if (!saveSuccess) return;
    const timer = window.setTimeout(() => setSaveSuccess(false), 2000);
    return () => window.clearTimeout(timer);
  }, [saveSuccess]);

  const refreshSavedLibrary = useCallback(() => {
    setSavedLibrary(loadSavedSignatures());
  }, []);

  const handleTemplateChange = useCallback((templateId: string) => {
    const template = TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;
    setSelectedTemplateId(template.id);
    setTemplateHtmlState(template.html);
  }, []);

  const applyTemplateWithDefaults = useCallback((templateId: string) => {
    const template = TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;
    setSelectedTemplateId(template.id);
    setTemplateHtmlState(template.html);
    setValues({ ...DEFAULT_SIGNATURE_VALUES, ...template.defaultValues });
  }, []);

  const updateValue = useCallback((key: keyof SignatureValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const beginCreateSession = useCallback(() => {
    const template =
      TEMPLATES.find((item) => item.id === selectedTemplateId) ?? TEMPLATES[0];
    if (!template) return;
    setSelectedTemplateId(template.id);
    setTemplateHtmlState(template.html);
    setValues({ ...DEFAULT_SIGNATURE_VALUES, ...template.defaultValues });
    setEditingSavedId(null);
    setSimpleStep(0);
  }, [selectedTemplateId]);

  const openSavedSession = useCallback(
    (id: string, initialStep: number) => {
      const saved = loadSavedSignatures().find((item) => item.id === id);
      if (!saved) return false;
      const template =
        TEMPLATES.find((item) => item.id === saved.templateId) ?? TEMPLATES[0];
      if (!template) return false;
      setSelectedTemplateId(template.id);
      setTemplateHtmlState(template.html);
      setValues({ ...DEFAULT_SIGNATURE_VALUES, ...saved.values });
      setEditingSavedId(saved.id);
      setSimpleStep(initialStep);
      return true;
    },
    []
  );

  const saveSignature = useCallback(() => {
    const saved = upsertSavedSignature({
      id: editingSavedId ?? undefined,
      templateId: selectedTemplateId,
      values,
    });
    setEditingSavedId(saved.id);
    setSaveSuccess(true);
    refreshSavedLibrary();
  }, [editingSavedId, refreshSavedLibrary, selectedTemplateId, values]);

  const deleteSavedItem = useCallback(
    (id: string) => {
      deleteSavedSignature(id);
      refreshSavedLibrary();
      if (editingSavedId === id) {
        setEditingSavedId(null);
      }
    },
    [editingSavedId, refreshSavedLibrary]
  );

  const value = useMemo<UserContextValue>(
    () => ({
      selectedTemplateId,
      templateHtml,
      values,
      resolvedHtml,
      savedLibrary,
      editingSavedId,
      saveSuccess,
      darkMode,
      layoutVertical,
      simpleStep,
      handleTemplateChange,
      applyTemplateWithDefaults,
      updateValue,
      setTemplateHtml: setTemplateHtmlState,
      setSimpleStep,
      toggleTheme: () => setDarkMode((prev) => !prev),
      toggleLayout: () => setLayoutVertical((prev) => !prev),
      refreshSavedLibrary,
      beginCreateSession,
      openSavedSession,
      saveSignature,
      deleteSavedItem,
    }),
    [
      selectedTemplateId,
      templateHtml,
      values,
      resolvedHtml,
      savedLibrary,
      editingSavedId,
      saveSuccess,
      darkMode,
      layoutVertical,
      simpleStep,
      handleTemplateChange,
      applyTemplateWithDefaults,
      updateValue,
      refreshSavedLibrary,
      beginCreateSession,
      openSavedSession,
      saveSignature,
      deleteSavedItem,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
