export function openModal(html) {
  const dialog = document.createElement('dialog');

  const dialogCloseButton = document.createElement('button');
  dialogCloseButton.classList.add('button');
  dialogCloseButton.innerText = 'OK';

  const actionFooter = document.createElement('div');
  actionFooter.classList.add('dialog-actions');
  actionFooter.appendChild(dialogCloseButton);

  const dialogForm = document.createElement('form');
  dialogForm.method = 'dialog';
  dialogForm.innerHTML = html;
  dialogForm.appendChild(actionFooter);

  document.body.appendChild(dialog);
  dialog.appendChild(dialogForm);
  dialog['showModal']();
}
