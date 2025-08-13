"use strict";
const byId = (id) => document.getElementById(id);
function switchView(next) {
    document.querySelectorAll('.view').forEach(v => {
        if (v.id === `view-${next}`)
            v.setAttribute('data-active', '');
        else
            v.removeAttribute('data-active');
    });
    document.querySelectorAll('.rail-btn[data-view]').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-view') === next);
    });
}
function setupRail() {
    document.querySelectorAll('.rail-btn[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            if (view)
                switchView(view);
        });
    });
}
function setupBrandTabs() {
    const tabs = document.querySelectorAll('.tab');
    const panes = document.querySelectorAll('.tabpane');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const key = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            panes.forEach(p => {
                p.toggleAttribute('data-active', p.getAttribute('data-tabpane') === key);
            });
        });
    });
}
function showToast(message, kind = 'info') {
    const toaster = byId('toaster');
    if (!toaster)
        return;
    const toast = document.createElement('div');
    toast.className = `toast ${kind}`;
    toast.textContent = message;
    toaster.appendChild(toast);
    setTimeout(() => toast.classList.add('leave'), 2400);
    setTimeout(() => toast.remove(), 3000);
}
function setupComposer() {
    const postBtn = byId('btn-post');
    const previewBtn = byId('btn-preview');
    const input = byId('composer-input');
    const typing = byId('typing-indicator');
    let typingTimer = null;
    input?.addEventListener('input', () => {
        if (!typing)
            return;
        typing.hidden = false;
        if (typingTimer)
            window.clearTimeout(typingTimer);
        typingTimer = window.setTimeout(() => (typing.hidden = true), 1200);
    });
    previewBtn?.addEventListener('click', () => showToast('Preview not implemented in preview build', 'warn'));
    postBtn?.addEventListener('click', () => {
        const text = input?.value?.trim();
        if (!text) {
            showToast('Write something before posting', 'warn');
            input?.focus();
            return;
        }
        showToast('Posted to Announcements ✅', 'success');
        if (input)
            input.value = '';
    });
}
function setupCompactToggle() {
    const btn = byId('btn-compact');
    btn?.addEventListener('click', () => {
        document.body.classList.toggle('compact');
        const compact = document.body.classList.contains('compact');
        if (btn)
            btn.textContent = compact ? 'Comfortable' : 'Compact';
        showToast(compact ? 'Compact mode on' : 'Compact mode off', 'info');
    });
}
function setupCommandPalette() {
    const modal = byId('cmdk');
    const input = byId('cmdk-input');
    const list = byId('cmdk-list');
    if (!modal || !input || !list)
        return;
    const modalEl = modal;
    const inputEl = input;
    const listEl = list;
    const commands = [
        { id: 'v-home', label: 'Go to Home', run: () => switchView('home') },
        { id: 'v-discovery', label: 'Go to Discovery', run: () => switchView('discovery') },
        { id: 'v-brand', label: 'Go to Brand', run: () => switchView('brand') },
        { id: 'v-analytics', label: 'Go to Analytics', run: () => switchView('analytics') },
        { id: 'toggle-compact', label: 'Toggle Compact Mode', run: () => byId('btn-compact')?.click() },
        { id: 'focus-search', label: 'Focus Global Search', run: () => byId('global-search')?.focus() },
    ];
    let filtered = commands.slice();
    let selectedIndex = 0;
    function render() {
        listEl.innerHTML = '';
        filtered.forEach((cmd, i) => {
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.setAttribute('id', cmd.id);
            li.textContent = cmd.label;
            if (i === selectedIndex)
                li.setAttribute('aria-selected', 'true');
            li.addEventListener('click', () => run(cmd));
            listEl.appendChild(li);
        });
    }
    function run(cmd) {
        close();
        cmd.run();
        showToast(`Ran: ${cmd.label}`, 'info');
    }
    function open() {
        modalEl.setAttribute('data-open', '');
        modalEl.setAttribute('aria-hidden', 'false');
        selectedIndex = 0;
        filtered = commands.slice();
        render();
        setTimeout(() => inputEl.focus(), 0);
    }
    function close() {
        modalEl.removeAttribute('data-open');
        modalEl.setAttribute('aria-hidden', 'true');
        inputEl.value = '';
    }
    modalEl.addEventListener('click', (e) => {
        const target = e.target;
        if (target.hasAttribute('data-close'))
            close();
    });
    inputEl.addEventListener('input', () => {
        const q = inputEl.value.toLowerCase();
        filtered = commands.filter(c => c.label.toLowerCase().includes(q));
        selectedIndex = 0;
        render();
    });
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
            render();
            e.preventDefault();
        }
        if (e.key === 'ArrowUp') {
            selectedIndex = Math.max(selectedIndex - 1, 0);
            render();
            e.preventDefault();
        }
        if (e.key === 'Enter') {
            const cmd = filtered[selectedIndex];
            if (cmd)
                run(cmd);
        }
        if (e.key === 'Escape') {
            close();
        }
    });
    // Global shortcuts
    window.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toLowerCase().includes('mac');
        if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (modalEl.hasAttribute('data-open'))
                close();
            else
                open();
        }
        if (e.key === '/') {
            const activeEl = document.activeElement;
            const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
            if (!isTyping) {
                const search = byId('global-search');
                if (search) {
                    e.preventDefault();
                    search.focus();
                }
            }
        }
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
            if (e.key === '1')
                switchView('home');
            if (e.key === '2')
                switchView('discovery');
            if (e.key === '3')
                switchView('brand');
            if (e.key === '4')
                switchView('analytics');
        }
    });
}
function simulatePresence() {
    const el = byId('active-now');
    if (!el)
        return;
    let value = parseInt(el.textContent || '0', 10) || 0;
    setInterval(() => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3..+3
        value = Math.max(0, value + delta);
        el.textContent = value.toString();
    }, 2000);
}
function setupMisc() {
    byId('btn-notify')?.addEventListener('click', () => {
        showToast('No new notifications', 'info');
    });
    byId('btn-create')?.addEventListener('click', () => {
        showToast('Create: Coming soon in this preview', 'warn');
    });
}
function main() {
    setupRail();
    setupBrandTabs();
    setupComposer();
    setupCompactToggle();
    setupCommandPalette();
    simulatePresence();
    setupMisc();
}
document.addEventListener('DOMContentLoaded', main);
