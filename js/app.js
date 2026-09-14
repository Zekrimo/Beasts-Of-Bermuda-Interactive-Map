import { createMap } from './map.js';
import { createMarkerLayers, addLegendHoverEffects } from './markers.js';
import { setupControls } from './controls.js';

/**
 * Loads waypoint data and initializes the map application.
 *
 * @async
 * @function start
 * @returns {Promise<void>} Resolves after the map and controls are initialized.
 */
async function start() {
  const response = await fetch('data/waypoints.json');
  if (!response.ok) throw new Error(`Could not load waypoint data (${response.status})`);
  const { categories } = await response.json();
  const { map, setMap } = createMap();
  const layers = createMarkerLayers(map, categories);
  setupControls(map, layers, categories, setMap);
  addLegendHoverEffects(layers);
}

start().catch(error => {
  console.error(error);
  document.body.insertAdjacentHTML('beforeend', '<p class="map-error">The map data could not be loaded. Check the browser console for details.</p>');
});
