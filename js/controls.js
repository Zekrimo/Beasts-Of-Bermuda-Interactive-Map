/**
 * Connects map-view buttons and marker visibility checkboxes to their handlers.
 *
 * @function setupControls
 * @param {L.Map} map - Leaflet map whose layers are toggled.
 * @param {Object.<string, L.LayerGroup>} layers - Marker layers keyed by category.
 * @param {Object.<string, Object>} categories - Waypoint category definitions.
 * @param {function(string): void} setMap - Function that switches the active map view.
 * @param {Array<Object>} views - Map view definitions used to build the view buttons.
 * @param {Array<Object>} groups - Marker group definitions used to build the legend.
 * @returns {void}
 */
export function setupControls(map, layers, categories, setMap, views, groups) {
  renderControls(categories, views, groups);
  renderCategoryLabels(categories);
  document.querySelectorAll('[data-map-view]').forEach(button => button.addEventListener('click', () => setMap(button.dataset.mapView)));
  document.querySelectorAll('input[data-group]').forEach(input => input.addEventListener('change', () => toggleGroup(map, layers, categories, input.dataset.group, input.checked)));
  document.querySelectorAll('[data-category] input').forEach(input => input.addEventListener('change', () => toggleCategory(map, layers, categories, input.closest('[data-category]').dataset.category, input.checked)));
}

/**
 * Generates map-view buttons and marker-group controls from application data.
 *
 * @function renderControls
 * @param {Object.<string, Object>} categories - Waypoint category definitions.
 * @param {Array<Object>} views - Map view definitions.
 * @param {Array<Object>} groups - Marker group definitions.
 * @returns {void}
 */
function renderControls(categories, views, groups) {
  const viewContainer = document.querySelector('[data-map-views]');
  views.forEach(view => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.mapView = view.id;
    button.textContent = view.label;
    viewContainer.appendChild(button);
  });

  const groupContainer = document.querySelector('[data-marker-groups]');
  groups.forEach(group => {
    const groupLabel = document.createElement('label');
    groupLabel.innerHTML = `<input type="checkbox" data-group="${group.id}" checked> ${group.label}`;
    groupContainer.appendChild(groupLabel);

    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'marker-subcategories';
    group.categories.forEach(categoryId => {
      const category = categories[categoryId];
      const categoryLabel = document.createElement('label');
      categoryLabel.dataset.category = categoryId;
      categoryLabel.dataset.group = group.id;
      categoryLabel.innerHTML = `<input type="checkbox" checked><img src="${category.icon}" alt="${category.type}" width="16" height="16"><span data-category-label>${category.label || category.type}</span>`;
      categoryContainer.appendChild(categoryLabel);
    });
    groupContainer.appendChild(categoryContainer);
  });
}

/**
 * Renders category descriptions from waypoint data into the legend.
 *
 * @function renderCategoryLabels
 * @param {Object.<string, Object>} categories - Waypoint category definitions.
 * @returns {void}
 */
function renderCategoryLabels(categories) {
  document.querySelectorAll('[data-category]').forEach(label => {
    const category = categories[label.dataset.category];
    const description = label.querySelector('[data-category-label]');
    if (category && description) description.textContent = category.label || category.type;
  });
}

/**
 * Shows or hides one waypoint category and synchronizes its parent checkbox.
 *
 * @function toggleCategory
 * @param {L.Map} map - Leaflet map whose layer is toggled.
 * @param {Object.<string, L.LayerGroup>} layers - Marker layers keyed by category.
 * @param {Object.<string, Object>} categories - Waypoint category definitions.
 * @param {string} category - Category key to toggle.
 * @param {boolean} visible - Whether the category should be visible.
 * @returns {void}
 */
function toggleCategory(map, layers, categories, category, visible) {
  if (visible) layers[category].addTo(map); else map.removeLayer(layers[category]);
  const group = categories[category].group;
  const children = document.querySelectorAll(`[data-category][data-group="${group}"] input`);
  document.querySelector(`[data-group="${group}"]`).checked = [...children].some(input => input.checked);
}

/**
 * Shows or hides every waypoint category in a marker group.
 *
 * @function toggleGroup
 * @param {L.Map} map - Leaflet map whose layers are toggled.
 * @param {Object.<string, L.LayerGroup>} layers - Marker layers keyed by category.
 * @param {Object.<string, Object>} categories - Waypoint category definitions.
 * @param {string} group - Group name: landshrines, watershrines, or portals.
 * @param {boolean} visible - Whether the group should be visible.
 * @returns {void}
 */
function toggleGroup(map, layers, categories, group, visible) {
  document.querySelectorAll(`[data-category][data-group="${group}"] input`).forEach(input => {
    input.checked = visible;
    toggleCategory(map, layers, categories, input.closest('[data-category]').dataset.category, visible);
  });
}
