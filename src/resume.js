import { linkHref } from './links.js';

export function openResumePreview({ dialog, content, name, url, base = location.href }) {
  const href = linkHref(url, 'web', base);
  content.replaceChildren();
  dialog.classList.add('resume-dialog');
  const heading = document.createElement('h2');
  heading.id = 'detail-title';
  heading.textContent = 'Résumé preview';
  content.append(heading);
  if (href) {
    const frame = document.createElement('iframe');
    frame.className = 'resume-frame';
    frame.title = `Résumé of ${name}`;
    frame.src = href;
    frame.referrerPolicy = 'no-referrer';
    content.append(frame);
    const actions = document.createElement('div');
    actions.className = 'resume-actions';
    const download = document.createElement('a');
    download.className = 'primary';
    download.textContent = 'Download résumé';
    download.href = href;
    download.download = 'Zaki-Boongaling-Resume.pdf';
    const open = document.createElement('a');
    open.className = 'text-button';
    open.textContent = 'Open in a new tab';
    open.href = href;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    actions.append(download, open);
    content.append(actions);
    const hint = document.createElement('p');
    hint.className = 'small';
    hint.textContent = 'If the preview does not display on your device, open it in a new tab or download the PDF.';
    content.append(hint);
  } else {
    const message = document.createElement('p');
    message.className = 'resume-empty';
    message.textContent = 'The résumé will be available here soon.';
    content.append(message);
  }
  dialog.showModal();
}
