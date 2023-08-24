import os
import json
import numpy as np
import rasterio
from shapely.geometry import shape
from rasterio.features import geometry_mask
from flask import jsonify

def create_rasterized_geojson(input_geojson_path, raster_path, output_geojson_path):
    with open(input_geojson_path, 'r') as geojson_file:
        input_geojson_data = json.load(geojson_file)

    with rasterio.open(raster_path) as src:
        raster_crs = src.crs
        raster_transform = src.transform

        for feature in input_geojson_data["features"]:
            geom = shape(feature["geometry"])
            if geom.is_valid and not geom.is_empty:
                mask = geometry_mask([geom], out_shape=src.shape, transform=src.transform, invert=True)
                values = src.read(1, masked=True)[mask]

                if np.ma.is_masked(values):
                    if values.count() > 0:
                        mean_value = round(values.mean(), 4)
                    else:
                        mean_value = None
                else:
                    mean_value = round(float(values), 4)

                coordinates = [
                    round(coord, 4) for coord in feature["geometry"]["coordinates"]
                ]
                feature["properties"]["raster_value"] = mean_value
                feature["geometry"]["coordinates"] = coordinates

    os.makedirs(os.path.dirname(output_geojson_path), exist_ok=True)
    with open(output_geojson_path, 'w') as output_geojson_file:
        json.dump(input_geojson_data, output_geojson_file, indent=2)

def get_geojson():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_geojson_path = os.path.join(script_dir, '..', 'static', 'buildings_points.geojson')
    raster_path = os.path.join(script_dir, '..', 'static', 'sample_raster.tif')
    output_geojson_path = os.path.join(script_dir, '..', 'static', 'output', 'bld_pts.geojson')

    create_rasterized_geojson(input_geojson_path, raster_path, output_geojson_path)

    with open(output_geojson_path, 'r') as output_geojson_file:
        generated_geojson = json.load(output_geojson_file)

    return jsonify(generated_geojson)
