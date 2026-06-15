import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { HtmlPanel } from '@/pages/templates-edit/components/HtmlPanel';
import { PreviewPanel } from '@/pages/templates-edit/components/PreviewPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserContext } from '@/contexts/UserContext';
import { buildTemplateHtmlFromSchema } from '@/lib/templates/builder';
import {
  applyFieldTextPatch,
  createTemplateRowField,
  isRowFieldTextCustomized,
  isRowFieldTextPropertyCustomized,
  normalizeTemplateRows,
  TEMPLATE_TEXT_DEFAULT_OPTION,
} from '@/lib/templateRows';
import { cn } from '@/lib/utils';
import {
  DEFAULT_NEW_TEMPLATE,
  DEFAULT_SIGNATURE_VALUES,
  TEMPLATE_BUILDER_FIELDS,
  type NewTemplate,
  type TemplateBuilderField,
  type TemplateTextConfig,
} from '@/types/types';
import {
  copyPreviewForGmail,
  copyTextToClipboard,
} from '@/utils/utils';

export default function TemplateEditPage() {
  const {
    resolvedHtml,
    saveTemplate,
    selectedTemplate,
    setTemplateHtml,
    templateHtml,
  } = useUserContext();

  const [builderTemplate, setBuilderTemplate] = useState<NewTemplate>(() => ({
    id: `builder-${Date.now()}`,
    name: 'Untitled Template',
    html: '',
    config: DEFAULT_NEW_TEMPLATE.config,
    rows: DEFAULT_NEW_TEMPLATE.rows,
  }));
  const [activeSection, setActiveSection] = useState<'attributes' | 'rows'>('attributes');
  const [selectedField, setSelectedField] = useState<{
    rowIndex: number;
    fieldIndex: number;
  } | null>(null);

  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const [copiedSection, setCopiedSection] = useState<'html' | 'preview' | null>(null);

  const selectedRowField =
    selectedField === null
      ? null
      : builderTemplate.rows[selectedField.rowIndex]?.[selectedField.fieldIndex] ?? null;

  const generatedHtml = useMemo(() => buildTemplateHtmlFromSchema(builderTemplate), [builderTemplate]);

  useEffect(() => {
    setBuilderTemplate({
      ...selectedTemplate,
      config: {
        ...selectedTemplate.config,
        image: {
          ...selectedTemplate.config.image,
          url: selectedTemplate.config.image.url === '{{IMAGE}}'
            ? DEFAULT_SIGNATURE_VALUES.IMAGE
            : selectedTemplate.config.image.url,
        },
        text: { ...selectedTemplate.config.text },
      },
      rows: normalizeTemplateRows(
        selectedTemplate.rows,
        selectedTemplate.config.text
      ),
    });
    setSelectedField(null);
  }, [selectedTemplate]);

  useEffect(() => {
    setTemplateHtml(generatedHtml);
  }, [generatedHtml, setTemplateHtml]);

  const onSaveTemplate = useCallback(() => {
    saveTemplate({
      ...builderTemplate,
      html: generatedHtml,
    });
  }, [builderTemplate, generatedHtml, saveTemplate]);

  const markCopied = useCallback((section: 'html' | 'preview') => {
    setCopiedSection(section);
    window.setTimeout(() => setCopiedSection(null), 2000);
  }, []);

  const copyToClipboard = useCallback(async (text: string, section: 'html' | 'preview') => {
    await copyTextToClipboard(text);
    markCopied(section);
  }, [markCopied]);

  const copyPreviewAsRichHtml = useCallback(async () => {
    await copyPreviewForGmail(previewIframeRef.current, resolvedHtml);
    markCopied('preview');
  }, [markCopied, resolvedHtml]);


  const addRow = useCallback(() => {
    setBuilderTemplate((prev) => ({
      ...prev,
      rows: [...prev.rows, [createTemplateRowField('text')]],
    }));
    setSelectedField(null);
  }, []);

  const removeRow = useCallback((rowIndex: number) => {
    setBuilderTemplate((prev) => {
      if (prev.rows.length <= 1) return prev;
      return {
        ...prev,
        rows: prev.rows.filter((_, index) => index !== rowIndex),
      };
    });
    setSelectedField((current) =>
      current?.rowIndex === rowIndex ? null : current
    );
  }, []);

  const addFieldToRow = useCallback((rowIndex: number, field: TemplateBuilderField) => {
    setBuilderTemplate((prev) => {
      const nextRows = prev.rows.map((row, index) =>
        index === rowIndex
          ? [...row, createTemplateRowField(field)]
          : row
      );
      const fieldIndex = nextRows[rowIndex].length - 1;
      queueMicrotask(() => setSelectedField({ rowIndex, fieldIndex }));
      return { ...prev, rows: nextRows };
    });
  }, []);

  const removeFieldFromRow = useCallback((rowIndex: number, fieldIndex: number) => {
    setBuilderTemplate((prev) => ({
      ...prev,
      rows: prev.rows.map((row, index) => {
        if (index !== rowIndex) return row;
        const next = row.filter((_, i) => i !== fieldIndex);
        return next.length > 0
          ? next
          : [createTemplateRowField('text')];
      }),
    }));
    setSelectedField((current) => {
      if (!current) return null;
      if (current.rowIndex !== rowIndex) return current;
      if (current.fieldIndex === fieldIndex) return null;
      if (current.fieldIndex > fieldIndex) {
        return { rowIndex, fieldIndex: current.fieldIndex - 1 };
      }
      return current;
    });
  }, []);

  const updateSelectedFieldText = useCallback(
    (patch: Partial<TemplateTextConfig>) => {
      if (!selectedField) return;
      setBuilderTemplate((prev) => ({
        ...prev,
        rows: prev.rows.map((row, rowIndex) =>
          rowIndex !== selectedField.rowIndex
            ? row
            : row.map((field, fieldIndex) =>
                fieldIndex !== selectedField.fieldIndex
                  ? field
                  : {
                      ...field,
                      text: applyFieldTextPatch(
                        field.text,
                        patch,
                        prev.config.text
                      ),
                    }
              )
        ),
      }));
    },
    [selectedField]
  );

  const resetSelectedFieldText = useCallback(() => {
    if (!selectedField) return;
    setBuilderTemplate((prev) => ({
      ...prev,
      rows: prev.rows.map((row, rowIndex) =>
        rowIndex !== selectedField.rowIndex
          ? row
          : row.map((field, fieldIndex) =>
              fieldIndex !== selectedField.fieldIndex
                ? field
                : { ...field, text: {} }
            )
      ),
    }));
  }, [selectedField]);

  const updateSelectedFieldLabel = useCallback(
    (label: TemplateBuilderField) => {
      if (!selectedField) return;
      setBuilderTemplate((prev) => ({
        ...prev,
        rows: prev.rows.map((row, rowIndex) =>
          rowIndex !== selectedField.rowIndex
            ? row
            : row.map((field, fieldIndex) =>
                fieldIndex !== selectedField.fieldIndex
                  ? field
                  : { ...field, label }
              )
        ),
      }));
    },
    [selectedField]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
      <div className="flex w-full flex-col gap-4 lg:w-[400px] lg:shrink-0">
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-4 py-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Template editor</h2>
            <p className="text-sm text-muted-foreground">Edit the template name, image, text and rows.</p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onSaveTemplate}
            className="gap-1.5"
          >
            <Save className="size-3.5" />
            Save
          </Button>
        </div>

        <Card className="border values-card">
          <CardContent className="space-y-5 py-4">
            <div className="flex items-center gap-2 rounded-md border border-border bg-card p-1">
              <Button
                type="button"
                variant={activeSection === 'attributes' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setActiveSection('attributes')}
              >
                Template attributes
              </Button>
              <Button
                type="button"
                variant={activeSection === 'rows' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setActiveSection('rows')}
              >
                Template rows
              </Button>
            </div>

            {activeSection === 'attributes' ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="template-name" className="text-sm font-semibold">Template name</Label>
                  <Input
                    id="template-name"
                    value={builderTemplate.name}
                    onChange={(e) =>
                      setBuilderTemplate((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Untitled Template"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="image-url" className="text-sm font-semibold">Image URL</Label>
                    <Input
                      id="image-url"
                      value={builderTemplate.config.image.url}
                      onChange={(e) =>
                        setBuilderTemplate((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            image: { ...prev.config.image, url: e.target.value },
                          },
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-placement" className="text-sm font-semibold">Image placement</Label>
                    <Select
                      value={builderTemplate.config.image.placement}
                      onValueChange={(value) =>
                        setBuilderTemplate((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            image: { ...prev.config.image, placement: value as NewTemplate['config']['image']['placement'] },
                          },
                        }))
                      }
                    >
                      <SelectTrigger id="image-placement" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="top">Top</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-size" className="text-sm font-semibold">Image size</Label>
                    <Select
                      value={builderTemplate.config.image.size}
                      onValueChange={(value) =>
                        setBuilderTemplate((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            image: { ...prev.config.image, size: value as NewTemplate['config']['image']['size'] },
                          },
                        }))
                      }
                    >
                      <SelectTrigger id="image-size" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xs">Extra small</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-shape" className="text-sm font-semibold">Image shape</Label>
                    <Select
                      value={builderTemplate.config.image.shape}
                      onValueChange={(value) =>
                        setBuilderTemplate((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            image: { ...prev.config.image, shape: value as NewTemplate['config']['image']['shape'] },
                          },
                        }))
                      }
                    >
                      <SelectTrigger id="image-shape" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="circle">Circle</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text-font" className="text-sm font-semibold">Text font</Label>
                    <Input
                      id="text-font"
                      value={builderTemplate.config.text.font}
                      onChange={(e) =>
                        setBuilderTemplate((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            text: { ...prev.config.text, font: e.target.value },
                          },
                        }))
                      }
                      placeholder="Arial, sans-serif"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text-color" className="text-sm font-semibold">Text color</Label>
                    <Input
                      id="text-color"
                      value={builderTemplate.config.text.color}
                      onChange={(e) =>
                        setBuilderTemplate((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            text: { ...prev.config.text, color: e.target.value },
                          },
                        }))
                      }
                      placeholder="#222222"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text-size" className="text-sm font-semibold">Text size</Label>
                    <Select
                      value={builderTemplate.config.text.size}
                      onValueChange={(value) =>
                        setBuilderTemplate((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            text: { ...prev.config.text, size: value as NewTemplate['config']['text']['size'] },
                          },
                        }))
                      }
                    >
                      <SelectTrigger id="text-size" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xs">Extra small</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text-shape" className="text-sm font-semibold">Text style</Label>
                    <Select
                      value={builderTemplate.config.text.shape}
                      onValueChange={(value) =>
                        setBuilderTemplate((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            text: { ...prev.config.text, shape: value as NewTemplate['config']['text']['shape'] },
                          },
                        }))
                      }
                    >
                      <SelectTrigger id="text-shape" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="italic">Italic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Template Rows</Label>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={addRow}>
                    <Plus className="size-3.5" />
                    Add row
                  </Button>
                </div>

                <div className="space-y-3">
                  {builderTemplate.rows.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="rounded-md border border-border bg-card p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Row {rowIndex + 1}
                          </span>

                          <Select onValueChange={(value) => addFieldToRow(rowIndex, value as TemplateBuilderField)}>
                            <SelectTrigger className="h-8 w-[180px] border border-input bg-secondary text-xs">
                              <SelectValue placeholder="Add field" />
                            </SelectTrigger>
                            <SelectContent>
                              {TEMPLATE_BUILDER_FIELDS.map((field) => (
                                <SelectItem key={field} value={field}>
                                  {field}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeRow(rowIndex)}
                          disabled={builderTemplate.rows.length === 1}
                          aria-label="Delete row"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {row.map((field, fieldIndex) => {
                          const isSelected =
                            selectedField?.rowIndex === rowIndex &&
                            selectedField.fieldIndex === fieldIndex;
                          const isCustomized = isRowFieldTextCustomized(field);

                          return (
                            <div
                              key={`${rowIndex}-${fieldIndex}`}
                              className={cn(
                                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs',
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted',
                                isCustomized && !isSelected && 'ring-1 ring-primary/40'
                              )}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedField({ rowIndex, fieldIndex })
                                }
                                className="font-medium"
                              >
                                {field.label}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  removeFieldFromRow(rowIndex, fieldIndex)
                                }
                                aria-label="Remove field"
                                className="opacity-70 hover:opacity-100"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedRowField && selectedField && (
                  <div className="space-y-4 rounded-md border border-border bg-muted/30 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <Label className="text-sm font-semibold">Field style</Label>
                        <p className="text-xs text-muted-foreground">
                          Override the template default text style for this field.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={resetSelectedFieldText}
                        disabled={!isRowFieldTextCustomized(selectedRowField)}
                      >
                        Reset to default
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="field-label" className="text-sm font-semibold">
                          Field
                        </Label>
                        <Select
                          value={selectedRowField.label}
                          onValueChange={(value) =>
                            updateSelectedFieldLabel(value as TemplateBuilderField)
                          }
                        >
                          <SelectTrigger id="field-label" className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TEMPLATE_BUILDER_FIELDS.map((field) => (
                              <SelectItem key={field} value={field}>
                                {field}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="field-text-font" className="text-sm font-semibold">
                          Font
                        </Label>
                        <Input
                          id="field-text-font"
                          value={
                            isRowFieldTextPropertyCustomized(
                              selectedRowField,
                              'font'
                            )
                              ? selectedRowField.text.font ?? ''
                              : ''
                          }
                          onChange={(e) =>
                            updateSelectedFieldText({
                              font:
                                e.target.value === ''
                                  ? builderTemplate.config.text.font
                                  : e.target.value,
                            })
                          }
                          placeholder={builderTemplate.config.text.font}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="field-text-color" className="text-sm font-semibold">
                          Color
                        </Label>
                        <Input
                          id="field-text-color"
                          value={
                            isRowFieldTextPropertyCustomized(
                              selectedRowField,
                              'color'
                            )
                              ? selectedRowField.text.color ?? ''
                              : ''
                          }
                          onChange={(e) =>
                            updateSelectedFieldText({
                              color:
                                e.target.value === ''
                                  ? builderTemplate.config.text.color
                                  : e.target.value,
                            })
                          }
                          placeholder={builderTemplate.config.text.color}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="field-text-size" className="text-sm font-semibold">
                          Size
                        </Label>
                        <Select
                          value={
                            isRowFieldTextPropertyCustomized(
                              selectedRowField,
                              'size'
                            )
                              ? selectedRowField.text.size!
                              : TEMPLATE_TEXT_DEFAULT_OPTION
                          }
                          onValueChange={(value) =>
                            updateSelectedFieldText({
                              size:
                                value === TEMPLATE_TEXT_DEFAULT_OPTION
                                  ? builderTemplate.config.text.size
                                  : (value as TemplateTextConfig['size']),
                            })
                          }
                        >
                          <SelectTrigger id="field-text-size" className="h-10">
                            <SelectValue placeholder="Default" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TEMPLATE_TEXT_DEFAULT_OPTION}>
                              Default
                            </SelectItem>
                            <SelectItem value="xs">Extra small</SelectItem>
                            <SelectItem value="sm">Small</SelectItem>
                            <SelectItem value="md">Medium</SelectItem>
                            <SelectItem value="lg">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="field-text-shape" className="text-sm font-semibold">
                          Style
                        </Label>
                        <Select
                          value={
                            isRowFieldTextPropertyCustomized(
                              selectedRowField,
                              'shape'
                            )
                              ? selectedRowField.text.shape!
                              : TEMPLATE_TEXT_DEFAULT_OPTION
                          }
                          onValueChange={(value) =>
                            updateSelectedFieldText({
                              shape:
                                value === TEMPLATE_TEXT_DEFAULT_OPTION
                                  ? builderTemplate.config.text.shape
                                  : (value as TemplateTextConfig['shape']),
                            })
                          }
                        >
                          <SelectTrigger id="field-text-shape" className="h-10">
                            <SelectValue placeholder="Default" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TEMPLATE_TEXT_DEFAULT_OPTION}>
                              Default
                            </SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                            <SelectItem value="italic">Italic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <PreviewPanel
            resolvedHtml={resolvedHtml}
            onCopy={copyPreviewAsRichHtml}
            copied={copiedSection === 'preview'}
            iframeRef={previewIframeRef}
          />
        </div>

        <div className="flex min-h-[24rem] flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <HtmlPanel
            value={templateHtml}
            onChange={setTemplateHtml}
            onCopy={() => copyToClipboard(resolvedHtml, 'html')}
            copied={copiedSection === 'html'}
          />
        </div>
      </div>
    </div>
  );
}
