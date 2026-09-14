Copyright © 2025 Zekrimo

All rights reserved.

This project, including all source code, assets, art and design, is provided for viewing and usage via the deployed GitHub Pages website only.

You are NOT permitted to copy, modify, redistribute, or use the source code or assets in any form, including for commercial use, without explicit written permission from the author.
Contribution can be made to this repository so all BoB community members can benefit from, and enjoy this map.

For inquiries or licensing, contact: sonnyselten@gmail.com
For Feedback or contribution, contact: sonnyselten@gmail.com

I am not part of the BoB development team

## Access the map

The live map is available here:

<https://zekrimo.github.io/Beasts-Of-Bermuda-Interactive-Map/>

It provides map views for the default map, tunnels, underwater areas, regions, and event zones. You can also toggle land shrines, water shrines, and portals independently.

## Contributing

Community contributions are welcome, subject to the license terms above. Please contact `sonnyselten@gmail.com` before submitting modified code, assets, or a pull request so that the contribution can be approved.

Useful contribution types include:

- Correcting a waypoint name or coordinate.
- Adding a missing shrine or portal.
- Reporting an incorrect map layer or icon.
- Suggesting usability, accessibility, or mobile improvements.

When reporting a waypoint issue, include the category, waypoint name, correct coordinates if known, and a screenshot or clear description of its location. For code changes, explain what was changed and test the map locally before sharing it.

## Project structure

- `index.html` contains the map controls and page shell.
- `style.css` contains the page, controls, and marker styling.
- `js/app.js` loads the data and starts the application.
- `js/map.js` owns Leaflet setup and map overlay switching.
- `js/markers.js` creates markers and handles tooltips and portal connections.
- `js/controls.js` handles marker visibility controls.
- `data/waypoints.json` contains the map configuration, view definitions, group labels, waypoint names, coordinates, icons, and categories.
- `assets/maps/` contains the map layers and water background.
- `assets/maps/reference/` contains preserved images that are not currently used by the app.
- `assets/icons/` contains shrine and portal SVG icons.

## Data-driven map configuration

Most of the map interface is generated from `data/waypoints.json`. This keeps map content separate from application behavior and means common content changes do not require editing JavaScript or HTML.

The JSON file contains:

- `map`: image bounds and zoom settings.
- `views`: map view labels and the map overlay files used by each view.
- `groups`: marker group labels and the categories shown inside each group.
- `categories`: category labels, descriptions, colors, icons, and waypoint lists.
- `points`: waypoint names, coordinates, and optional `big` marker settings.

To add or move a waypoint, edit the relevant `points` list. Coordinates use Leaflet's simple map format as `[y, x]`, matching the coordinate order used by the existing map. To rename a legend entry, update its category `label`. To change the popup explanation for a category, update its `description`; a point can also have its own optional `description` to override the category description. To add a new category, add its definition under `categories` and its key to the appropriate group's `categories` list.

Keep the JSON valid after editing. A syntax error or a missing asset path will prevent the map data from loading.

The site is configured for the GitHub Pages URL `https://zekrimo.github.io/Beasts-Of-Bermuda-Interactive-Map/`. If the deployment URL changes, update the canonical URL, Open Graph URL, `robots.txt`, and `sitemap.xml` together.
