const IMAGE_BOUNDS = [[0, 0], [900, 1000]];
const OUTER_BOUNDS = [[0, 0], [1080, 1980]];

/**
 * Creates the Leaflet map, background, and selectable map overlays.
 *
 * @function createMap
 * @returns {{map: L.Map, setMap: function(string): void}} The Leaflet map and overlay switcher.
 */
export function createMap() {
  const map = L.map('map', { crs: L.CRS.Simple, minZoom: 0, maxZoom: 3, zoomSnap: 0.1, maxBounds: OUTER_BOUNDS, maxBoundsViscosity: 1 });
  L.imageOverlay('assets/maps/WaterBackgroundUnderlay2.png', OUTER_BOUNDS).addTo(map);
  map.fitBounds(OUTER_BOUNDS);
  const overlays = {
    default: ['LandMapOverlay.png'], tunnels: ['Tunnels.png'], underwater: ['LandMapTransparent65Overlay.png'],
    regions: ['LandMapOverlay.png', 'Zones.png'], zone: ['LandMapOverlay.png', 'LandMapEventzoneOverlay.png']
  };
  const overlayLayers = Object.fromEntries(Object.entries(overlays).map(([view, files]) => [view, files.map(file => L.imageOverlay(`assets/maps/${file}`, IMAGE_BOUNDS))]));
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
