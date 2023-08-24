from flask import Blueprint
from geoprocessing.geojson_processing import get_geojson

geojson_blueprint = Blueprint('geojson', __name__)

@geojson_blueprint.route('/get_geojson', methods=['GET'])
def serve_geojson():
    generated_geojson = get_geojson()
    return generated_geojson