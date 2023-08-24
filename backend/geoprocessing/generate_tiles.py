import os
from raster_tile_generator import reproject_raster, generate_tiles, convert_to_8bit

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_raster = os.path.join(script_dir, '..', 'static', 'sample_raster.tif')
    reprojected_raster_path = os.path.join(script_dir, '..', 'static', 'sample_raster_3857.tif')
    raster_8bit_path = os.path.join(script_dir, '..', 'static', 'sample_raster_8bit.tif')
    target_epsg = 'EPSG:3857'
    output_tiles = os.path.join(script_dir, '..', 'static', 'tiles')
    min_zoom = '8'
    max_zoom = '14'
    print(input_raster, reprojected_raster_path )
    # Reproject the input raster to EPSG 3857
    reprojected_raster = reproject_raster(input_raster, reprojected_raster_path, target_epsg)
    raster_convert = convert_to_8bit(reprojected_raster, raster_8bit_path )

    # Generate tiles from the reprojected raster
    generate_tiles(raster_convert, output_tiles, min_zoom, max_zoom)

if __name__ == '__main__':
    main() 