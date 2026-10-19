
async function loadMessages() {
  const r = await fetch('/api/messages');
  const xs = await r.json();

  document.querySelector('#messages').innerHTML = xs.map(x =>
    `<article class="message">
      <b>${escapeHtml(x.name)}</b>
      <p>${escapeHtml(x.message)}</p>
      <div class="meta">#${x.id}</div>
    </article>`
  ).join('');
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// 文字数カウント機能
const messageInput = document.querySelector('#message');
const charCount = document.querySelector('#char-count');

function updateCharCount() {
  charCount.textContent = `${messageInput.value.length} / 300文字`;
}

messageInput.addEventListener('input', updateCharCount);
updateCharCount();

// 投稿処理
document.querySelector('#form').addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.querySelector('#name').value;
  const message = messageInput.value;

  const r = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, message })
  });

  document.querySelector('#status').textContent =
    r.ok ? '投稿しました' : '投稿に失敗しました';

  if (r.ok) {
    messageInput.value = '';
    updateCharCount();
    await loadMessages();
  }
});

loadMessages();
