

async function loadMessages() {
  const r = await fetch('/api/messages');
  const xs = await r.json();

  document.querySelector('#messages').innerHTML = xs.map(x => `
    <article class="message">
      <b>${escapeHtml(x.name)}</b>
      <p>${escapeHtml(x.message)}</p>
      <div class="meta">#${x.id}</div>
      #${x.id}
        <!-- 削除ボタン（クラス: btn-delete） -->
        <button onclick="deleteMessage(${x.id})" class="btn-delete">削除</button>
      </div>
      <button type="button" onclick="likeMessage(${x.id})">
        👍 いいね ${x.likes ?? 0}
      </button>
    </article>
  `).join('');
}

// 投稿削除用関数
async function deleteMessage(id) {
  if (!confirm('この投稿を削除しますか？')) {
    return;
  }

  const r = await fetch(`/api/messages/${id}`, {
    method: 'DELETE'
  });

  if (r.ok) {
    await loadMessages();
  } else {
    alert('削除に失敗しました');
  }
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// 空欄の投稿を防ぐ
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

// いいねを増やす
async function likeMessage(id) {
  const r = await fetch(`/api/messages/${id}/like`, {
    method: 'POST'
  });

  if (r.ok) {
    await loadMessages();
  }
}

// 入力文字数を表示する
const messageInput = document.querySelector('#message');
const charCount = document.querySelector('#char-count');

messageInput.addEventListener('input', () => {
  charCount.textContent =
    `${messageInput.value.length} / 300文字`;
});

loadMessages();

