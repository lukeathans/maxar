import './style.css';
import 'ol/ol.css';


var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
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
