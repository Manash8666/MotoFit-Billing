/**
 * Cross-platform download and export utility.
 * Normalizes file downloads across Desktop and Mobile (Android TWA / WebViews).
 * 
 * - Mobile: Uses Web Share API (navigator.share) so users can save directly to Google Drive or local storage.
 * - Desktop: Uses a DOM-attached <a> tag with explicit download attributes and a 60-second revocation delay
 *   to ensure Chrome/Edge assigns the correct filename rather than falling back to an internal Blob UUID.
 */

export interface DownloadOptions {
  title?: string;
}

export async function downloadBlob(
  blob: Blob,
  filename: string,
  options?: DownloadOptions
): Promise<void> {
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Mobile Web Share flow (essential for TWA / WebViews)
  if (
    isMobile &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function'
  ) {
    const file = new File([blob], filename, {
      type: blob.type || 'application/octet-stream',
    });

    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: options?.title || filename,
          files: [file],
        });
        return;
      } catch (err: any) {
        // User closed or dismissed the share sheet
        if (err.name === 'AbortError') return;
        console.warn('Mobile Web Share failed, falling back to direct download:', err);
      }
    }
  }

  // Desktop or fallback direct download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.setAttribute('download', filename);

  document.body.appendChild(link);
  link.click();
  link.remove();

  // 60-second delay so background download engines can finish reading metadata
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000);
}

/**
 * Downloads a jsPDF document instance using the cross-platform download pipeline.
 */
export async function downloadJsPDF(
  doc: { output: (type: 'blob') => Blob },
  filename: string,
  options?: DownloadOptions
): Promise<void> {
  const pdfBlob = doc.output('blob');
  const blob = new Blob([pdfBlob], { type: 'application/pdf' });
  const finalName = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
  await downloadBlob(blob, finalName, options);
}

/**
 * Exports data as a CSV file with UTF-8 BOM encoding for Excel/Drive compatibility.
 */
export async function downloadCSV(
  csvContent: string,
  filename: string,
  options?: DownloadOptions
): Promise<void> {
  // UTF-8 BOM (\uFEFF) ensures proper character encoding in Excel
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const finalName = filename.toLowerCase().endsWith('.csv') ? filename : `${filename}.csv`;
  await downloadBlob(blob, finalName, options);
}
