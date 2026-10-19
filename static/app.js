
async function loadMessages() {
  const r = await fetch('/api/messages');
  const xs = await r.json();

  document.querySelector('#messages').innerHTML = xs.map(x =>
    `<article class="message">
      <b>${escapeHtml(x.name)}</b>
      <p>${escapeHtml(x.message)}</p>
      <div class="meta">#${x.id}</div>
      #${x.id}
        <!-- 削除ボタン（クラス: btn-delete） -->
        <button onclick="deleteMessage(${x.id})" class="btn-delete">削除</button>
      </div>
    </article>`
  ).join('');
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
