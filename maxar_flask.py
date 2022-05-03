from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
	return 'Hello, World!'


@app.route('/geojson')
def get_geoJSON():
	return 'geojson test'
