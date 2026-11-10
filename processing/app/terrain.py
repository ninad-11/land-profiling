import numpy as np
import rasterio
from rasterio.transform import from_origin
from pathlib import Path


# Project directories
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "outputs"

DATA_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)


def generate_terrain():

    # Terrain dimensions
    rows = 50
    cols = 50
    resolution = 1.0  # Each pixel represents 1m x 1m

    # Generate local coordinate grid
    x = np.arange(cols)
    y = np.arange(rows)

    X, Y = np.meshgrid(x, y)

    # PRE-WORK TERRAIN
    # Synthetic natural terrain with a gentle slope
    pre = (
        100
        + 0.03 * X
        + 0.02 * Y
        + 0.15 * np.sin(X / 6)
        + 0.10 * np.cos(Y / 7)
    )

    # POST-WORK TERRAIN
    post = pre.copy()

    # Simulate excavation (cut)
    cut = 1.5 * np.exp(
        -((X - 15) ** 2 + (Y - 25) ** 2) / 50
    )

    # Simulate soil filling
    fill = 1.0 * np.exp(
        -((X - 35) ** 2 + (Y - 25) ** 2) / 50
    )

    post = pre - cut + fill

    # Calculate elevation differences
    difference = pre - post

    # Calculate cut and fill depths
    cut_depth = np.maximum(difference, 0)
    fill_depth = np.maximum(-difference, 0)

    # Pixel area in square metres
    pixel_area = resolution * resolution

    # Calculate volumes
    cut_volume = np.sum(cut_depth) * pixel_area
    fill_volume = np.sum(fill_depth) * pixel_area
    net_cut_volume = cut_volume - fill_volume

    # Save DEM files
    transform = from_origin(
        0, rows * resolution, resolution, resolution
    )

    def save_dem(filename, elevation):
        output_path = DATA_DIR / filename

        with rasterio.open(
            output_path,
            "w",
            driver="GTiff",
            height=rows,
            width=cols,
            count=1,
            dtype="float32",
            transform=transform,
            nodata=None
        ) as dataset:

            dataset.write(
                elevation.astype(np.float32),
                1
            )

            dataset.update_tags(
                data_status="SYNTHETIC DEM - NOT SURVEY DATA",
                coordinate_system="LOCAL GRID",
                cell_size_m=resolution
            )

        return output_path

    pre_path = save_dem("pre_dem.tif", pre)
    post_path = save_dem("post_dem.tif", post)

    # Return results
    return {
        "pre_dem": str(pre_path),
        "post_dem": str(post_path),
        "cut_volume_m3": round(float(cut_volume), 3),
        "fill_volume_m3": round(float(fill_volume), 3),
        "net_cut_volume_m3": round(float(net_cut_volume), 3)
    }


if __name__ == "__main__":

    result = generate_terrain()

    print("\nTERRAIN GENERATION COMPLETED")
    print("--------------------------------")

    for key, value in result.items():
        print(f"{key}: {value}")