


async function loadMessages() {
  const r = await fetch('/api/messages');
  const xs = await r.json();

  const keyword = document.querySelector('#search').value
    .trim()
    .toLowerCase();

  const filtered = xs.filter(x =>
    x.name.toLowerCase().includes(keyword) ||
    x.message.toLowerCase().includes(keyword)
  );

  document.querySelector('#messages').innerHTML = filtered
    .map(x => `
      <article class="message">
        <b>${escapeHtml(x.name)}</b>
        <p>${escapeHtml(x.message)}</p>
        <div class="meta">#${x.id}</div>
        <button type="button" onclick="deleteMessage(${x.id})">
          削除
        </button>
        <button type="button" onclick="likeMessage(${x.id})">
          👍 いいね ${x.likes ?? 0}
        </button>
      </article>
    `)
    .join('');
}

// HTMLに表示する文字を安全に変換
function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// 投稿処理
document.querySelector('#form').addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const message = document.querySelector('#message').value.trim();

  if (!name || !message) {
    document.querySelector('#status').textContent =
      '名前と投稿内容を入力してください';
    return;
  }

  const r = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, message })
  });

  document.querySelector('#status').textContent =
    r.ok ? '投稿しました' : '投稿に失敗しました';

  if (r.ok) {
    document.querySelector('#message').value = '';
    document.querySelector('#name').value = '';
    document.querySelector('#char-count').textContent = '0 / 300文字';
    await loadMessages();
  }
});

// 投稿削除
async function deleteMessage(id) {
  if (!confirm('この投稿を削除しますか？')) return;

  const r = await fetch(`/api/messages/${id}`, {
    method: 'DELETE'
  });

  if (r.ok) {
    await loadMessages();
  } else {
    alert('削除に失敗しました');
  }
}

// いいね
async function likeMessage(id) {
  const r = await fetch(`/api/messages/${id}/like`, {
    method: 'POST'
  });

  if (r.ok) {
    await loadMessages();
  }
}

// 文字数表示
const messageInput = document.querySelector('#message');

messageInput.addEventListener('input', () => {
  document.querySelector('#char-count').textContent =
    `${messageInput.value.length} / 300文字`;
});

// 検索
document.querySelector('#search').addEventListener('input', loadMessages);

// 初期表示
loadMessages();
