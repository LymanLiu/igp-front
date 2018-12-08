export function download({ data, filename }) {
    const blob = new Blob([data], {type: 'application/octet-stream'});
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}