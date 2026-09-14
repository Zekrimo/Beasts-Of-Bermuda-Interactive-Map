let tooltip;
let connectionLine;

/**
 * Builds a Leaflet layer group and marker for every waypoint category.
 *
 * @function createMarkerLayers
 * @param {L.Map} map - Leaflet map that receives the marker layers.
 * @param {Object.<string, Object>} categories - Waypoint category definitions loaded from JSON.
 * @returns {Object.<string, L.LayerGroup>} Marker layers keyed by category name.
 */
export function createMarkerLayers(map, categories) {
  const layers = {};
  Object.entries(categories).forEach(([category, definition]) => {
    layers[category] = L.layerGroup().addTo(map);
    definition.points.forEach(point => {
      const icon = L.icon({ iconUrl: point.big ? definition.bigIcon : definition.icon, iconSize: point.big ? [50, 50] : [35, 35], iconAnchor: point.big ? [25, 25] : [17.5, 17.5], popupAnchor: point.big ? [0, -25] : [0, -17.5] });
      const description = point.description || definition.description;
      const popup = `<b>${point.name}</b>${description ? `<br><span>${description}</span>` : ''}`;
      const marker = L.marker(point.coords, { icon }).bindPopup(popup);
      marker.on('mouseover', event => { if (!marker.getPopup()?.isOpen()) showTooltip(event.originalEvent, point.name, definition); });
      marker.on('mouseout', hideTooltip);
      marker.on('mousemove', event => updateTooltip(event.originalEvent));
      if (category.startsWith('portal_')) {
        marker.on('mouseover', () => showPortalConnection(map, layers, categories, category, marker.getLatLng()));
        marker.on('mouseout', () => hidePortalConnection(map, layers));
      }
      marker.addTo(layers[category]);
    });
  });
  return layers;
}

/**
 * Displays a marker tooltip beside the pointer.
 *
 * @function showTooltip
 * @param {MouseEvent} event - Pointer event used to position the tooltip.
 * @param {string} name - Waypoint name shown in the tooltip.
 * @param {Object} definition - Category metadata, including type and color.
 * @returns {void}
 */
function showTooltip(event, name, definition) {
  hideTooltip();
  tooltip = document.createElement('div');
  tooltip.className = 'icon-hover-tooltip';
  tooltip.innerHTML = `<div style="color: ${definition.color}; font-weight: bold">${definition.type}</div><div>${name}</div>`;
  document.body.appendChild(tooltip);
  updateTooltip(event);
}

/**
 * Moves the active marker tooltip to the pointer position.
 *
 * @function updateTooltip
 * @param {MouseEvent} event - Pointer event containing viewport coordinates.
 * @returns {void}
 */
function updateTooltip(event) {
  if (tooltip) { tooltip.style.left = `${event.clientX + 10}px`; tooltip.style.top = `${event.clientY - 10}px`; }
}

/**
 * Removes the active marker tooltip.
 *
 * @function hideTooltip
 * @returns {void}
 */
function hideTooltip() { tooltip?.remove(); tooltip = null; }

/**
 * Draws a temporary line from a hovered portal to its linked portal.
 *
 * @function showPortalConnection
 * @param {L.Map} map - Leaflet map that receives the connection line.
 * @param {Object.<string, L.LayerGroup>} layers - Marker layers keyed by category.
 * @param {Object.<string, Object>} categories - Waypoint category definitions.
 * @param {string} category - Portal category containing the hovered waypoint.
 * @param {L.LatLng} hoveredCoords - Coordinates of the hovered portal.
 * @returns {void}
 */
function showPortalConnection(map, layers, categories, category, hoveredCoords) {
  hidePortalConnection(map, layers);
  const points = categories[category]?.points;
  if (!points || points.length !== 2) return;
  const other = points.find(point => L.latLng(point.coords).distanceTo(hoveredCoords) > 1);
  if (!other) return;
  connectionLine = L.polyline([hoveredCoords, other.coords], { color: '#fff', weight: 3, opacity: 0.8, dashArray: '10, 10', className: 'portal-connection-line' }).addTo(map);
  layers[category].eachLayer(marker => { if (marker.getLatLng().distanceTo(other.coords) < 1) marker.getElement()?.classList.add('icon-glow'); });
}

/**
 * Removes the temporary portal line and connected-marker highlight.
 *
 * @function hidePortalConnection
 * @param {L.Map} map - Leaflet map containing the connection line.
 * @param {Object.<string, L.LayerGroup>} layers - Marker layers keyed by category.
 * @returns {void}
 */
function hidePortalConnection(map, layers) {
  if (connectionLine) map.removeLayer(connectionLine);
  connectionLine = null;
  Object.keys(layers).filter(key => key.startsWith('portal_')).forEach(key => layers[key].eachLayer(marker => marker.getElement()?.classList.remove('icon-glow')));
}

/**
 * Adds hover highlighting from legend entries to their marker layers.
 *
 * @function addLegendHoverEffects
 * @param {Object.<string, L.LayerGroup>} layers - Marker layers keyed by category.
 * @returns {void}
 */
export function addLegendHoverEffects(layers) {
  document.querySelectorAll('[data-category]').forEach(label => {
    const category = label.dataset.category;
    label.addEventListener('mouseenter', () => { if (label.querySelector('input').checked) layers[category].eachLayer(marker => marker.getElement()?.classList.add('icon-glow')); });
    label.addEventListener('mouseleave', () => layers[category].eachLayer(marker => marker.getElement()?.classList.remove('icon-glow')));
  });
}
