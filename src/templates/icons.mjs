// Shared line icons keep navigation and section markers visually consistent.
const sectionIconPaths = {
  domaines: '<rect x="4" y="6" width="16" height="15" rx="2"/><path d="M9 6V3h6v3M8 11h8M8 15h5"/>',
  'double-expertise': '<path d="M4 7h15l-4-4M20 17H5l4 4M19 7l-4 4M5 17l4-4"/>',
  techno: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
  'bases-de-donnees':
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  societe:
    '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-6h4v6"/>',
  secteurs:
    '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  methode: '<path d="m3 6 2 2 4-4m-6 9 2 2 4-4m-6 9 2 2 4-4M13 6h8M13 13h8M13 20h8"/>',
};
export const sectionIcon = (id) =>
  '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
  (sectionIconPaths[id] || '') +
  '</svg>';
