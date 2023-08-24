from flask import Flask
from flask_cors import CORS
from blueprints.raster_blueprint import raster_blueprint
from blueprints.geojson_blueprint import geojson_blueprint

app = Flask(__name__, static_folder='static')
CORS(app)

app.register_blueprint(raster_blueprint, url_prefix='/raster')
app.register_blueprint(geojson_blueprint, url_prefix='/geojson')

if __name__ == '__main__':
    app.run(debug=True)