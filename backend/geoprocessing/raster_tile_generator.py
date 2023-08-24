import subprocess
import os
import sys
from osgeo import gdal

def reproject_raster(input_raster, output_raster, target_epsg):
    gdal.Warp(output_raster, input_raster, dstSRS=target_epsg)
    return output_raster

def convert_to_8bit(input_raster, output_raster):
    input_ds = gdal.Open(input_raster)
    options = [
        '-ot', 'Byte',        # Output data type is Byte (8-bit)
        '-scale',             # Scale pixel values to fit 8-bit range
        '-of', 'GTiff'        # Output format is GeoTIFF
    ]
    gdal.Translate(output_raster, input_ds, options=options)
    input_ds = None

def generate_tiles(input_tif, output_directory, min_zoom, max_zoom):
    # Provide the full path to gdal2tiles.py
    gdal2tiles_path = os.path.join(sys.prefix, 'Lib', 'site-packages', 'osgeo_utils', 'gdal2tiles.py')

    subprocess.run([
        sys.executable,
        gdal2tiles_path,
        '-z', f'{min_zoom}-{max_zoom}',
        input_tif, output_directory
    ])