import './style.css';
//import TileLayer from 'ol/layer/Tile';
import 'ol/ol.css';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Polygon from 'ol/geom/Polygon';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import Circle from 'ol/geom/Circle';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile, Vector as VectorLayer} from 'ol/layer';



const styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

// here would be where we call the Flask app to populate the givenData variable
let givenData;
let coordinates;
let type;

await fetch('http://localhost:5000/geojson/', { 
                headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            })
              .then(res => res.json())
              .then(data => givenData = data)
              

console.log("givenData: ",givenData)
coordinates = givenData.coordinates
type = givenData.type



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
        'type': type,
        'coordinates': [coordinates]
      },
    }
  ]
  }



  const source = new VectorSource({
    features: new GeoJSON().readFeatures(geojsonObject),
  });

  
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
    zoom: 10
  })
});


const aoiLayer = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    url: 'http://localhost:5000/geojson/',
    format: new ol.format.GeoJSON()
  }),
  visible: true,
  title: "AoI"
})

map.addLayer(aoiLayer)
