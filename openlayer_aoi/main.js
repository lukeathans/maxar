import './style.css';
//import TileLayer from 'ol/layer/Tile';
import 'ol/ol.css';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import Circle from 'ol/geom/Circle';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile, Vector as VectorLayer} from 'ol/layer';

const styles = {
  'MultiPolygon': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)',
    }),
  }),
  'Circle': new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(0,0,255,0.2)',
    }),
  }),
};

const styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

// here would be where we call the Flask app to populate the givenData variable
let givenData = fetch('http://localhost:5000/geojson/', { 
                headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
})
              .then(function (response) {
                return response.json();
              });
              // .then(function (text) {
              //   console.log('GET response: ');
              //   console.log(text)
              // });
console.log("givenData: ",givenData)
const coordinatesVec = givenData.coordinates

const geojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:3857',
    },
  },
  'features': [
    {
      'type': 'Feature',
      'geometry': { 
        'type': givenData.type,
        'coordinates': [givenData.coordinates ]
      },
    }
  ]
  }
// response = fetch('/geojson')
// console.log(response)

  const source = new VectorSource({
    features: new GeoJSON().readFeatures(geojsonObject),
  });

  source.addFeature(new Feature(new Circle([19460000,-5050000], 25000)));

  console.log("source: ", source)
  
  const vectorLayer = new VectorLayer({
    source: source,
    style: styleFunction,
  });

var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    vectorLayer
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([174.7787, -41.2924]),
    zoom: 11
  })
});

// Add tile layer over map with data from given file as source

// var layer = new ol.layer.TileLayer({
//   opacity: 1,
//   zIndex: 100,
//   source: [[174.990241669,-41.396484377]]
// });
// map.addLayer(layer);









// // ** defualt populated map from tutorial **
// const map = new Map({
//   target: 'map',
//   layers: [
//     new TileLayer({
//       source: new OSM()
//     })
//   ],
//   view: new View({
//     center: [0, 0],
//     zoom: 2
//   })
// });
