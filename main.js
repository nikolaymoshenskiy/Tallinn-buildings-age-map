import 'ol/ol.css';
import Map from 'ol/Map.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import { fromLonLat, transformExtent } from 'ol/proj.js'; 
import { Style, Fill, Stroke } from 'ol/style.js';
import MVT from 'ol/format/MVT.js';

// Extent for Estonia 
const estoniaExtent = transformExtent(
  [21.058, 57.459, 28.212, 59.948], 
  'EPSG:4326', 
  'EPSG:3857' 
);

// Layers URLs
const basemapURL = 'https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png';
const vectorTileURL = 'https://api.maptiler.com/tiles/2b2cc23c-1515-4076-a57a-a4f081b3a008/{z}/{x}/{y}.pbf?key=gJfVWwcKW9bgsU1HFlxD';

// Year color stops
const yearColorStops = [
  { year: 1250, color: '#3e007c' },
  { year: 1700, color: '#3e007c' },
  { year: 1800, color: '#000ac9' },
  { year: 1900, color: '#2bace8' },
  { year: 1970, color: '#ba0000' },
  { year: 2024, color: '#f1e260' }
];

// Create basemap layer
const basemapLayer = new TileLayer({
  source: new XYZ({
    url: basemapURL,
  }),
});

// Create vector tile layer
const vectorTileLayer = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVT(),
    url: vectorTileURL,
  }),
  style: function (feature) {
    const year = feature.get('year');
    const startYear = parseFloat(document.getElementById('start-year-label').textContent);
    const endYear = parseFloat(document.getElementById('end-year-label').textContent);

    if (year >= startYear && year <= endYear) {
      const fillColor = getFillColor(year);
      return new Style({
        fill: new Fill({
          color: fillColor,
        }),
        stroke: new Stroke({
          color: 'transparent',
          width: 0,
        }),
      });
    } else {
      return new Style({
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0)',
        }),
        stroke: new Stroke({
          color: 'transparent',
          width: 0,
        }),
      });
    }
  },
});

// Create the map with both layers
const map = new Map({
  target: 'map',
  view: new View({
    center: fromLonLat([24.7536, 59.437]),
    zoom: 12,
    minzoom:7,
    maxzomm:18,
    extent: estoniaExtent, 
  }),
  layers: [basemapLayer, vectorTileLayer],
});


// Event listener to enforce the extent
map.getView().on('change:center', function () {
  const currentCenter = map.getView().getCenter();
  if (!isWithinExtent(currentCenter, estoniaExtent)) {
    map.getView().setCenter(getClosestPoint(currentCenter, estoniaExtent));
  }
});

function isWithinExtent(point, extent) {
  return point[0] >= extent[0] && point[0] <= extent[2] &&
         point[1] >= extent[1] && point[1] <= extent[3];
}

function getClosestPoint(point, extent) {
  return [
    Math.max(extent[0], Math.min(extent[2], point[0])),
    Math.max(extent[1], Math.min(extent[3], point[1]))
  ];
}

// Interpolate between colors
function interpolateColor(color1, color2, factor) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);
  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Get fill color based on year
function getFillColor(year) {
  for (let i = 0; i < yearColorStops.length - 1; i++) {
    const start = yearColorStops[i];
    const end = yearColorStops[i + 1];
    if (year >= start.year && year <= end.year) {
      const factor = (year - start.year) / (end.year - start.year);
      return interpolateColor(start.color, end.color, factor);
    }
  }
  return 'rgba(0, 0, 0, 0)'; 
}


// Create an information panel
const infoContent = document.getElementById('info-content');
infoContent.innerHTML = `<strong>When was built?</strong>Hover over a building to get info`;

// Update info panel on map pointer move
map.on('pointermove', function (evt) {
  const pixel = evt.pixel;

  let featureFound = false;

  map.forEachFeatureAtPixel(pixel, function (feature) {
    const properties = feature.getProperties();
    const address = properties.address || 'No info';
    const year = properties.year === -1 ? 'No info' : properties.year;
    infoContent.innerHTML = `Address: ${address}<br>Year of construction: ${year}`;
    featureFound = true;
  }, {
    layerFilter: function (layer) {
      return layer === vectorTileLayer; 
    }
  });

  if (!featureFound) {
    infoContent.innerHTML = `<strong>When was built?</strong>Hover over a building to get info`;
  }
});

// Update the map based on slider values
window.updateMap = function (startYear, endYear) {
  vectorTileLayer.setStyle(function (feature) {
    const year = feature.get('year');

    if (year >= startYear && year <= endYear) {
      const fillColor = getFillColor(year);
      return new Style({
        fill: new Fill({
          color: fillColor,
        }),
        stroke: new Stroke({
          color: 'transparent',
          width: 0,
        }),
      });
    } else {
      return new Style({
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0)',
        }),
        stroke: new Stroke({
          color: 'transparent',
          width: 0,
        }),
      });
    }
  });
};
