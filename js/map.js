/**
 * Creates the Leaflet map, background, and selectable map overlays.
 *
 * @function createMap
 * @param {Object} mapConfig - Map bounds and zoom configuration.
 * @param {Array<Object>} views - Map view definitions and their overlay files.
 * @returns {{map: L.Map, setMap: function(string): void}} The Leaflet map and overlay switcher.
 */
export function createMap(mapConfig, views) {
  const { imageBounds, outerBounds, minZoom, maxZoom, zoomSnap } = mapConfig;
  const map = L.map('map', { crs: L.CRS.Simple, minZoom, maxZoom, zoomSnap, maxBounds: outerBounds, maxBoundsViscosity: 1 });
  L.imageOverlay('assets/maps/WaterBackgroundUnderlay2.png', outerBounds).addTo(map);
  map.fitBounds(outerBounds);
  const overlayLayers = Object.fromEntries(views.map(view => [view.id, view.overlays.map(file => L.imageOverlay(`assets/maps/${file}`, imageBounds))]));
  let activeOverlays = [];

  /**
   * Displays the overlays belonging to a named map view.
   *
   * @function setMap
   * @param {string} view - View name: default, tunnels, underwater, regions, or zone.
   * @returns {void}
   */
  function setMap(view) {
    activeOverlays.forEach(overlay => map.removeLayer(overlay));
    activeOverlays = overlayLayers[view] || overlayLayers.default;
    activeOverlays.forEach(overlay => overlay.addTo(map));
  }
  setMap('default');
  return { map, setMap };
}
