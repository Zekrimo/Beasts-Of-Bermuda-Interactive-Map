// --- MAP INITIALIZATION ---

// Size of the main map image (width, height)
const imageSize = [900, 1000];

// Create the Leaflet map using a simple CRS (coordinate reference system)
const map = L.map('map', {
  crs: L.CRS.Simple, // Use simple pixel coordinates
  minZoom: 0,
  maxZoom: 3,
  zoomSnap: 0.1, // Allow smooth zooming
  maxBounds: [[0, 0], [imageSize[0], imageSize[1]]], // Restrict panning to image bounds
  maxBoundsViscosity: 1.0 // Prevent panning outside bounds
});

// Bounds for overlays: main map and outer background
const bounds = [[0, 0], [imageSize[0], imageSize[1]]];
const outerBounds = [[0, 0], [1080, 1980]];

// --- MAP OVERLAYS ---

// Underwater background overlay (always visible)
const underwaterUnderlay = L.imageOverlay('WaterBackgroundUnderlay2.png', outerBounds).addTo(map);

// Main map overlay (default view)
const baseMapOverlay = L.imageOverlay('LandMapOverlay.png', bounds).addTo(map);

// Overlay for underwater tunnels (used in underwater view)
const underwaterTunnelsOverlay = L.imageOverlay('LandMapTransparent65Overlay.png', bounds);

// Overlay for tunnels (used in tunnel view)
const tunnelOverlay = L.imageOverlay('Tunnels.png', bounds);

// Overlay for regions (used in region view)
const regionOverlay = L.imageOverlay('Zones.png', bounds);

// Overlay for event zones (used in zone view)
const zoneOverlay = L.imageOverlay('LandMapEventzoneOverlay.png', bounds);


// Fit the map to the outer bounds and restrict panning
map.fitBounds(outerBounds);
map.setMaxBounds(outerBounds);

/**
 * Switches the visible overlays based on the selected view.
 * Only the relevant overlays are shown for each view.
 * @param {string} view - The selected map view ('default', 'tunnels', 'underwater', 'regions', 'zone')
 */

function setMap(view) {
  // Remove all overlays except the underwater underlay
  map.removeLayer(baseMapOverlay);
  map.removeLayer(underwaterTunnelsOverlay);
  map.removeLayer(tunnelOverlay);
  map.removeLayer(zoneOverlay);
  map.removeLayer(regionOverlay);

  // Add overlays based on selected view
  if (view === 'underwater') {
    underwaterTunnelsOverlay.addTo(map);
  } else if (view === 'tunnels') {
    tunnelOverlay.addTo(map);
  } else if (view === 'regions') {
    baseMapOverlay.addTo(map);
    regionOverlay.addTo(map);
  } else if (view === 'zone') {
    baseMapOverlay.addTo(map);
    zoneOverlay.addTo(map);
  } else if (view === 'default') {
    baseMapOverlay.addTo(map);
  }
}

// --- MARKER LAYER GROUPS ---

/**
 * Each marker category (e.g., landshrines_redShrines) gets its own Leaflet LayerGroup.
 * This allows toggling visibility of all markers in a category at once.
 */
const layers = {
  landshrines_redShrines: L.layerGroup().addTo(map),
  landshrines_blueShrines: L.layerGroup().addTo(map),
  landshrines_greenShrines: L.layerGroup().addTo(map),
  watershrines_redShrines: L.layerGroup().addTo(map),
  watershrines_blueShrines: L.layerGroup().addTo(map),
  watershrines_greenShrines: L.layerGroup().addTo(map),
  portal_1: L.layerGroup().addTo(map),
  portal_2: L.layerGroup().addTo(map),
  portal_3: L.layerGroup().addTo(map),
  portal_4: L.layerGroup().addTo(map)
};

/**
 * Marker data for each category.
 * Each entry contains a list of marker objects with a name and coordinates.
 */
const categoryPoints = {
  // Landshrines: red, blue, green
  landshrines_redShrines: [
    { name: "Red Shrine 1", coords: [803, 822] },
    { name: "Red Shrine 2", coords: [570, 460] },
    { name: "Big Red Shrine", coords: [340, 728] },
    { name: "Red Shrine 3", coords: [202, 739] },
    { name: "Red Shrine 4", coords: [102, 729] },
    { name: "Red Shrine 5", coords: [295, 611] },
    { name: "Red Shrine 6", coords: [384, 420] },
    { name: "Red Shrine 7", coords: [668, 147] }
  ],
  landshrines_blueShrines: [
    { name: "Blue Shrine 1", coords: [795, 729] },
    { name: "Blue Shrine 2", coords: [710, 565] },
    { name: "Blue Shrine 3", coords: [409, 775] },
    { name: "Blue Shrine 4", coords: [122, 674] },
    { name: "Blue Shrine 5", coords: [128, 520] },
    { name: "Blue Shrine 6", coords: [580, 347] },
    { name: "Big Blue Shrine", coords: [510, 373] },
    { name: "Blue Shrine 7", coords: [315, 457] },
    { name: "Blue Shrine 8", coords: [605, 182] }
  ],
  landshrines_greenShrines: [
    { name: "Green Shrine 1", coords: [768, 615] },
    { name: "Green Shrine 2", coords: [668, 620] },
    { name: "Green Shrine 3", coords: [242, 772] },
    { name: "Green Shrine 4", coords: [118, 794] },
    { name: "Green Shrine 5", coords: [220, 580] },
    { name: "Green Shrine 6", coords: [428, 280] },
    { name: "Green Shrine 7", coords: [542, 325] },
    { name: "Big Green Shrine", coords: [277, 374] },
    { name: "Green Shrine 8", coords: [639, 73] }
  ],
  // Watershrines: red, blue, green
  watershrines_redShrines: [
    { name: "Red WaterShrine 1", coords: [825, 644] },
    { name: "Red WaterShrine 2", coords: [564, 694] },
    { name: "Red WaterShrine 3", coords: [520, 550] },
    { name: "Red WaterShrine 4", coords: [62, 650] },
    { name: "Red WaterShrine 5", coords: [634, 133] },
    { name: "Red WaterShrine 6", coords: [332, 366] },
    { name: "Big Red WaterShrine", coords: [245, 330] }
  ],
  watershrines_blueShrines: [
    { name: "Blue WaterShrine 1", coords: [697, 798] },
    { name: "Big Blue WaterShrine", coords: [239, 675] },
    { name: "Blue WaterShrine 2", coords: [238, 520] },
    { name: "Blue WaterShrine 3", coords: [130, 450] },
    { name: "Blue WaterShrine 4", coords: [122, 618] },
    { name: "Blue WaterShrine 5", coords: [412, 612] },
    { name: "Blue WaterShrine 6", coords: [589, 167] }
  ],
  watershrines_greenShrines: [
    { name: "Green WaterShrine 1", coords: [818, 802] },
    { name: "Big Green Water Shrine", coords: [339, 440] },
    { name: "Green WaterShrine 2", coords: [652, 63] },
    { name: "Green WaterShrine 3", coords: [202, 790] },
    { name: "Green WaterShrine 4", coords: [380, 298] },
    { name: "Green WaterShrine 5", coords: [492, 630] },
    { name: "Green WaterShrine 6", coords: [185, 495] }
  ],
  // Portals: 4 types
  portal_1: [
    { name: "Ashen Island / Jungle Highlands", coords: [818, 752] },
    { name: "Ashen Island / Jungle Highlands", coords: [342, 400] }
  ],
  portal_2: [
    { name: "Velo pond / Spiral Island", coords: [440, 535] },
    { name: "Velo pond / Spiral Island", coords: [162, 695] }
  ],
  portal_3: [
    { name: "Palm Pond / Big survival water shrine", coords: [200, 500] },
    { name: "Palm Pond / Big survival water shrine", coords: [229, 675] }
  ],
  portal_4: [
    { name: "Tranquil Landbridge / Cypresss Portal", coords: [340, 300] },
    { name: "Tranquil Landbridge / Cypresss Portal", coords: [575, 138] }
  ]
};

// --- ADD MARKERS TO LAYER GROUPS ---

/**
 * For each category, create circle markers for each point and add to the corresponding LayerGroup.
 * Marker color is determined by category.
 */
Object.entries(categoryPoints).forEach(([category, points]) => {
  points.forEach(p => {

    let marker;
    
    // Check if this is a portal category
    if (category.startsWith('portal_')) {

      // Use custom SVG icons for portals
      const portalIcons = {
        portal_1: 'svg/portal-purple.svg',
        portal_2: 'svg/portal-orange.svg',
        portal_3: 'svg/portal-yellow.svg',
        portal_4: 'svg/portal-brown.svg'
      };
      
      // Create portal icon based on category
      const portalIcon = L.icon({
        iconUrl: portalIcons[category],
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
      
      marker = L.marker(p.coords, { icon: portalIcon }).bindPopup(`<b>${p.name}</b>`);
      
      // Add portal hover effects for connection lines
      marker.on('mouseover', function() {
        showPortalConnection(category, this.getLatLng());
      });
      
      marker.on('mouseout', function() {
        hidePortalConnection();
      });
      
    } else {

      // Use custom SVG icons for shrines
      const shrineIcons = {
        landshrines_redShrines: 'svg/shrine-red.svg',
        landshrines_blueShrines: 'svg/shrine-blue.svg',
        landshrines_greenShrines: 'svg/shrine-green.svg',
        watershrines_redShrines: 'svg/water-shrine-red.svg',
        watershrines_blueShrines: 'svg/water-shrine-blue.svg',
        watershrines_greenShrines: 'svg/water-shrine-green.svg'
      };
      
      // Create shrine icon based on category
      const shrineIcon = L.icon({
        iconUrl: shrineIcons[category],
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });

      marker = L.marker(p.coords, { icon: shrineIcon }).bindPopup(`<b>${p.name}</b>`);
    }

    // Add hover tooltip functionality to all markers
    addMarkerHoverEffects(marker, p.name, category);

    if (layers[category]) {
      marker.addTo(layers[category]);
      console.log(`Added marker: ${p.name} to layer ${category}`);
    } else {
      console.error(`Layer not found: ${category}`);
    }
  });
});

// --- MARKER TOGGLING FUNCTIONS ---

/**
 * Toggles visibility of a single marker category (LayerGroup) based on checkbox state.
 * Also updates the parent group checkbox if all subcategories are unchecked.
 * @param {string} category - The category key (e.g., 'landshrines_redShrines')
 */
function toggleCategory(category) {
  const checkbox = event.target;
  if (checkbox.checked) {
    layers[category].addTo(map);
    console.log(`Added layer: ${category}`);
  } else {
    map.removeLayer(layers[category]);
    console.log(`Removed layer: ${category}`);
  }

  // Update parent checkbox state for landshrines and watershrines
  const group = category.split('_')[0];
  if (group === 'landshrines' || group === 'watershrines') {
    const checkboxes = document.querySelectorAll(`input.${group}`);
    const parentCheckbox = document.getElementById(group);
    // Parent is checked if any subcategory is checked
    parentCheckbox.checked = Array.from(checkboxes).some(cb => cb.checked);
  }
}

 /**
 * Toggles visibility of all marker categories in a group (e.g., all landshrines).
 * Sets all subcategory checkboxes to match the group checkbox.
 * @param {string} groupName - The group key ('landshrines', 'watershrines', 'portals')
 */
function toggleGroup(groupName) {
  const mainCheckbox = document.getElementById(groupName);
  const subCheckboxes = document.querySelectorAll(`input.${groupName}`);

  if (groupName === 'portals') {
    // Portals have 4 subcategories
    const portalLayers = ['portal_1', 'portal_2', 'portal_3', 'portal_4'];
    subCheckboxes.forEach((cb, index) => {
      cb.checked = mainCheckbox.checked;
      cb.disabled = false; // Always enable subcheckboxes
      const layerKey = portalLayers[index];
      if (mainCheckbox.checked) {
        layers[layerKey].addTo(map);
        console.log(`Added layer: ${layerKey}`);
      } else {
        map.removeLayer(layers[layerKey]);
        console.log(`Removed layer: ${layerKey}`);
      }
    });
  } else {
    // Landshrines and watershrines have red, blue, green subcategories
    const categories = ['redShrines', 'blueShrines', 'greenShrines'];
    subCheckboxes.forEach((cb, index) => {
      cb.checked = mainCheckbox.checked;
      cb.disabled = false; // Always enable subcheckboxes
      const layerKey = `${groupName}_${categories[index]}`;
      if (mainCheckbox.checked) {
        layers[layerKey].addTo(map);
        console.log(`Added layer: ${layerKey}`);
      } else {
        map.removeLayer(layers[layerKey]);
        console.log(`Removed layer: ${layerKey}`);
      }
    });
  }
}

// Add hover effects for legend items
function addLegendHoverEffects() {
  // Map of category patterns to layer names
  const categoryMap = {
    'landshrines_redShrines': /red.*shrine/i,
    'landshrines_blueShrines': /blue.*shrine/i,
    'landshrines_greenShrines': /green.*shrine/i,
    'watershrines_redShrines': /red.*shrine/i,
    'watershrines_blueShrines': /blue.*shrine/i,
    'watershrines_greenShrines': /green.*shrine/i,
    'portal_1': /ashen island/i,
    'portal_2': /velo pond/i,
    'portal_3': /palm pond/i,
    'portal_4': /tranquil landbridge/i
  };

  // Get all checkboxes with onchange attributes
  const checkboxes = document.querySelectorAll('input[type="checkbox"][onchange]');
  
  checkboxes.forEach(checkbox => {
    const onchangeStr = checkbox.getAttribute('onchange');
    const match = onchangeStr.match(/toggleCategory\('([^']+)'\)/);
    
    if (match) {
      const category = match[1];
      const label = checkbox.closest('label');
      
      if (layers[category] && label) {
        label.addEventListener('mouseenter', () => {
          if (checkbox.checked) {
            layers[category].eachLayer(marker => {
              const element = marker.getElement();
              if (element) {
                element.classList.add('icon-glow');
              }
            });
          }
        });
        
        label.addEventListener('mouseleave', () => {
          layers[category].eachLayer(marker => {
            const element = marker.getElement();
            if (element) {
              element.classList.remove('icon-glow');
            }
          });
        });
      }
    }
  });
}

// Initialize hover effects after markers are added
setTimeout(addLegendHoverEffects, 100);

// Marker hover effects and tooltips
let currentTooltip = null;

function addMarkerHoverEffects(marker, name, category) {
  marker.on('mouseover', function(e) {
    // Don't show tooltip if popup is open
    if (marker.getPopup() && marker.getPopup().isOpen()) return;
    
    showHoverTooltip(e.originalEvent, name, category);
  });
  
  marker.on('mouseout', function(e) {
    hideHoverTooltip();
  });
  
  marker.on('mousemove', function(e) {
    updateTooltipPosition(e.originalEvent);
  });
}

function showHoverTooltip(mouseEvent, name, category) {
  hideHoverTooltip(); // Remove any existing tooltip
  
  // Get category type and color info
  const categoryInfo = getCategoryInfo(category);
  
  // Create tooltip element
  currentTooltip = document.createElement('div');
  currentTooltip.className = 'icon-hover-tooltip';
  currentTooltip.innerHTML = `
    <div style="color: ${categoryInfo.color}; font-weight: bold;">${categoryInfo.type}</div>
    <div>${name}</div>
  `;
  
  // Position tooltip
  currentTooltip.style.left = (mouseEvent.clientX + 10) + 'px';
  currentTooltip.style.top = (mouseEvent.clientY - 10) + 'px';
  
  // Add to document
  document.body.appendChild(currentTooltip);
}

function hideHoverTooltip() {
  if (currentTooltip) {
    document.body.removeChild(currentTooltip);
    currentTooltip = null;
  }
}

function updateTooltipPosition(mouseEvent) {
  if (currentTooltip) {
    currentTooltip.style.left = (mouseEvent.clientX + 10) + 'px';
    currentTooltip.style.top = (mouseEvent.clientY - 10) + 'px';
  }
}

function getCategoryInfo(category) {
  const categoryMap = {
    landshrines_redShrines: { type: 'Red Land Shrine', color: '#EF4444' },
    landshrines_blueShrines: { type: 'Blue Land Shrine', color: '#3B82F6' },
    landshrines_greenShrines: { type: 'Green Land Shrine', color: '#22C55E' },
    watershrines_redShrines: { type: 'Red Water Shrine', color: '#F472B6' },
    watershrines_blueShrines: { type: 'Blue Water Shrine', color: '#38BDF8' },
    watershrines_greenShrines: { type: 'Green Water Shrine', color: '#34D399' },
    portal_1: { type: 'Portal', color: '#8B5CF6' },
    portal_2: { type: 'Portal', color: '#F97316' },
    portal_3: { type: 'Portal', color: '#EAB308' },
    portal_4: { type: 'Portal', color: '#A16207' }
  };
  
  return categoryMap[category] || { type: 'Unknown', color: '#ffffff' };
}

// Portal connection functionality
let currentConnectionLine = null;

function showPortalConnection(portalCategory, hoveredPortalCoords) {
  // Hide any existing connection line
  hidePortalConnection();
  
  // Get all portals in this category
  const portalPoints = categoryPoints[portalCategory];
  if (!portalPoints || portalPoints.length !== 2) return;
  
  // Find the other portal (not the one being hovered)
  const otherPortal = portalPoints.find(portal => {
    const portalLatLng = L.latLng(portal.coords);
    return portalLatLng.distanceTo(hoveredPortalCoords) > 1; // Not the same portal
  });
  
  if (!otherPortal) return;
  
  // Create connection line
  const lineCoords = [hoveredPortalCoords, otherPortal.coords];
  
  // Create polyline with animated dashed style
  currentConnectionLine = L.polyline(lineCoords, {
    color: '#ffffff',
    weight: 3,
    opacity: 0.8,
    dashArray: '10, 10',
    className: 'portal-connection-line'
  }).addTo(map);
  
  // Add glow effect to the connected portal
  layers[portalCategory].eachLayer(marker => {
    const markerLatLng = marker.getLatLng();
    const otherPortalLatLng = L.latLng(otherPortal.coords);
    
    // If this marker is the connected portal (not the hovered one)
    if (markerLatLng.distanceTo(otherPortalLatLng) < 1) {
      const element = marker.getElement();
      if (element) {
        element.classList.add('icon-glow');
      }
    }
  });
}

function hidePortalConnection() {
  // Remove connection line
  if (currentConnectionLine) {
    map.removeLayer(currentConnectionLine);
    currentConnectionLine = null;
  }
  
  // Remove glow from all portal markers
  Object.keys(layers).forEach(layerKey => {
    if (layerKey.startsWith('portal_')) {
      layers[layerKey].eachLayer(marker => {
        const element = marker.getElement();
        if (element) {
          element.classList.remove('icon-glow');
        }
      });
    }
  });
}
