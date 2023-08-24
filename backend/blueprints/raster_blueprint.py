import os
from flask import Blueprint, send_file

raster_blueprint = Blueprint('raster', __name__)

@raster_blueprint.route('/tiles/<int:z>/<int:x>/<int:y>.png')
def serve_tile(z, x, y):
    zoom_level_folder = f'z{z}'
    tile_path = os.path.join(raster_blueprint.static_folder, 'tiles', zoom_level_folder, str(x), f'{y}.png')

    return send_file(tile_path, mimetype='image/png')

@raster_blueprint.route('/get_tiles', methods=['GET'])
def get_tiles_info():
    return "Tiles service is running."
