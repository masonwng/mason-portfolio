import { normalize } from './core.js';
import { el, itemImage } from './ui.js';
export function searchItems(items, query, excluded = []) {
  const q = normalize(query);
  return items.filter(i => !excluded.includes(i.id) && (!q || normalize(i.name).includes(q) || i.name.split(/\s+/).map(w => w[0]).join('').toLowerCase() === q))
    .sort((a, b) => Number(normalize(b.name).startsWith(q)) - Number(normalize(a.name).startsWith(q)) || a.name.localeCompare(b.name)).slice(0, 8);
}
export function attachSearch(input, list, getItems, getExcluded = () => [], imageFactory = itemImage) {
  let matches = [], active = -1;
  input.removeAttribute('list'); input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list'); input.setAttribute('aria-controls', list.id); input.setAttribute('aria-expanded', 'false');
  list.setAttribute('role', 'listbox'); list.hidden = true;
  function close() { list.hidden = true; active = -1; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); }
  function select(item) { input.value = item.name; close(); input.focus(); }
  function render() {
    matches = searchItems(getItems(), input.value, getExcluded()); active = -1; list.replaceChildren();
    for (const [index, item] of matches.entries()) {
      const option = el('div', undefined, 'search-option'); option.id = `${list.id}-${index}`; option.setAttribute('role', 'option'); option.setAttribute('aria-selected', 'false');
      option.append(imageFactory(item), el('span', item.name)); option.onpointerdown = event => { event.preventDefault(); select(item); }; list.append(option);
    }
    if (!matches.length) list.append(el('p', 'No matching items. Try another name.', 'search-empty'));
    list.hidden = false; input.setAttribute('aria-expanded', 'true'); input.removeAttribute('aria-activedescendant');
  }
  input.addEventListener('input', render); input.addEventListener('focus', render); input.addEventListener('blur', close);
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') return close();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); if (list.hidden) render(); if (!matches.length) return;
      active = (active + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length;
      [...list.children].forEach((node, i) => node.setAttribute('aria-selected', String(i === active)));
      input.setAttribute('aria-activedescendant', `${list.id}-${active}`); list.children[active].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && !list.hidden && active >= 0) { event.preventDefault(); select(matches[active]); }
  });
  return close;
}
