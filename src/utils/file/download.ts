import { message } from 'ant-design-vue';

export interface DownloadParams {
  url: string;
  fileName?: string;
}

export function downloadByUrl({ url, fileName }: DownloadParams): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || '';
  link.click();
  link.remove();
}

export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart): void {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }
}