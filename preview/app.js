const railButtons = document.querySelectorAll('.rail-btn[data-view]');
const views = document.querySelectorAll('.view');

railButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.getAttribute('data-view');
    document.querySelectorAll('.rail-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    views.forEach(v => {
      if (v.id === `view-${view}`) v.setAttribute('data-active', '');
      else v.removeAttribute('data-active');
    });
  });
});

// Simple tabs for Brand view
const tabs = document.querySelectorAll('.tab');
const tabpanes = document.querySelectorAll('.tabpane');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const key = tab.getAttribute('data-tab');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    tabpanes.forEach(p => {
      if (p.getAttribute('data-tabpane') === key) p.setAttribute('data-active', '');
      else p.removeAttribute('data-active');
    });
  });
});