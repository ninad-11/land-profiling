import numpy as np
import rasterio
import matplotlib.pyplot as plt

from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "outputs"

OUTPUT_DIR.mkdir(exist_ok=True)


def visualize_terrain(pre_path=None, post_path=None, output_path=None):

    if pre_path is None:
        pre_path = DATA_DIR / "pre_dem.tif"

    if post_path is None:
        post_path = DATA_DIR / "post_dem.tif"

    pre_path = Path(pre_path)
    post_path = Path(post_path)

    # Read PRE and POST DEM
    with rasterio.open(pre_path) as pre_src:
        pre = pre_src.read(1, masked=True)
        transform = pre_src.transform

    with rasterio.open(post_path) as post_src:
        post = post_src.read(1, masked=True)

    if pre.shape != post.shape:
        raise ValueError("DEM dimensions do not match.")

    difference = pre - post

    # Calculate valid overlapping pixels
    valid = (
        ~np.ma.getmaskarray(pre)
        & ~np.ma.getmaskarray(post)
    )

    if not np.any(valid):
        raise ValueError("No valid overlapping pixels.")

    # Mask invalid cells in difference map
    difference = np.ma.array(
        difference,
        mask=~valid
    )

    # Calculate common elevation range
    elevation_values = np.concatenate([
        pre.compressed(),
        post.compressed()
    ])

    min_elevation = float(np.min(elevation_values))
    max_elevation = float(np.max(elevation_values))

    # Calculate map extent
    rows, cols = pre.shape

    x_min = transform.c
    y_max = transform.f

    x_max = x_min + cols * transform.a
    y_min = y_max + rows * transform.e

    extent = [x_min, x_max, y_min, y_max]

    # Create three-panel visualization
    fig, axes = plt.subplots(
        1, 3,
        figsize=(18, 6)
    )

    # PRE terrain
    image1 = axes[0].imshow(
        pre,
        cmap="terrain",
        extent=extent,
        vmin=min_elevation,
        vmax=max_elevation
    )

    axes[0].set_title("PRE-WORK TERRAIN")
    axes[0].set_xlabel("X Coordinate (m)")
    axes[0].set_ylabel("Y Coordinate (m)")

    fig.colorbar(
        image1,
        ax=axes[0],
        label="Elevation (m)"
    )

    # POST terrain
    image2 = axes[1].imshow(
        post,
        cmap="terrain",
        extent=extent,
        vmin=min_elevation,
        vmax=max_elevation
    )

    axes[1].set_title("POST-WORK TERRAIN")
    axes[1].set_xlabel("X Coordinate (m)")
    axes[1].set_ylabel("Y Coordinate (m)")

    fig.colorbar(
        image2,
        ax=axes[1],
        label="Elevation (m)"
    )

    # Difference map
    max_difference = float(
        np.max(np.abs(difference.compressed()))
    )

    if max_difference == 0:
        max_difference = 1.0

    image3 = axes[2].imshow(
        difference,
        cmap="RdBu_r",
        extent=extent,
        vmin=-max_difference,
        vmax=max_difference
    )

    axes[2].set_title("CUT / FILL DIFFERENCE")
    axes[2].set_xlabel("X Coordinate (m)")
    axes[2].set_ylabel("Y Coordinate (m)")

    fig.colorbar(
        image3,
        ax=axes[2],
        label="PRE - POST Elevation (m)"
    )

    fig.suptitle(
        "3D Terrain Profiling - Synthetic Demonstration",
        fontsize=15
    )

    plt.tight_layout()

    if output_path is None:
        output_path = OUTPUT_DIR / "terrain_comparison.png"
    else:
        output_path = Path(output_path)

    plt.savefig(
        output_path,
        dpi=300,
        bbox_inches="tight"
    )

    plt.close(fig)

    return str(output_path)


if __name__ == "__main__":

    result = visualize_terrain()

    print("TERRAIN VISUALIZATION COMPLETED")
    print("--------------------------------")
    print("Output:", result)