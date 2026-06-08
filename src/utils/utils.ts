export function htmlToPlainText(html: string): string {
	const parsed = new DOMParser().parseFromString(html, 'text/html');
	return parsed.body.textContent ?? '';
}

export async function copyTextToClipboard(text: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(text);
		return;
	} catch {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
	}
}

export async function copyRichHtmlToClipboard(html: string): Promise<void> {
	try {
		await navigator.clipboard.write([
			new ClipboardItem({
				'text/html': new Blob([html], { type: 'text/html' }),
				'text/plain': new Blob([htmlToPlainText(html)], { type: 'text/plain' }),
			}),
		]);
	} catch {
		await copyTextToClipboard(html);
	}
}

export function copyFromIframeSelection(
	iframe: HTMLIFrameElement | null
): boolean {
	const doc = iframe?.contentDocument;
	if (!doc) return false;

	try {
		iframe?.contentWindow?.focus();
		const selection = doc.defaultView?.getSelection();
		if (!selection) return false;
		selection.removeAllRanges();
		const range = doc.createRange();
		range.selectNodeContents(doc.body);
		selection.addRange(range);
		doc.execCommand('copy');
		selection.removeAllRanges();
		return true;
	} catch {
		return false;
	}
}

export async function copyPreviewForGmail(
	iframe: HTMLIFrameElement | null,
	html: string
): Promise<void> {
	if (copyFromIframeSelection(iframe)) return;
	await copyRichHtmlToClipboard(html);
}
