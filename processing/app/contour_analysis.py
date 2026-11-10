import numpy as np
import rasterio
import matplotlib.pyplot as plt

from pathlib import Path


# Project directories
BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "outputs"

OUTPUT_DIR.mkdir(exist_ok=True)

def create_contour_visualization(
    pre_path=None,
    post_path=None,
    output_path=None
):

    if pre_path is None:
        pre_path = DATA_DIR / "pre_dem.tif"

    if post_path is None:
        post_path = DATA_DIR / "post_dem.tif"

    pre_path = Path(pre_path)
    post_path = Path(post_path)

    # Read PRE DEM
    with rasterio.open(pre_path) as src:
        pre = src.read(1, masked=True)
        transform = src.transform

    # Read POST DEM
    with rasterio.open(post_path) as src:
        post = src.read(1, masked=True)

    # Validate DEM dimensions
    if pre.shape != post.shape:
        raise ValueError("PRE and POST DEM dimensions do not match.")

    # Ensure the current implementation uses north-up grids
    if not np.isclose(transform.b, 0) or not np.isclose(transform.d, 0):
        raise ValueError("Rotated DEM grids are not supported.")

    rows, cols = pre.shape

    # Generate pixel-centre coordinates
    x = transform.c + (np.arange(cols) + 0.5) * transform.a
    y = transform.f + (np.arange(rows) + 0.5) * transform.e

    X, Y = np.meshgrid(x, y)

    # Find common elevation range
    valid_values = np.concatenate([
        pre.compressed(),
        post.compressed()
    ])

    if len(valid_values) == 0:
        raise ValueError("No valid elevation values found.")

    min_elevation = float(np.min(valid_values))
    max_elevation = float(np.max(valid_values))

    # Contour interval
    contour_interval = 0.25

    start_level = (
        np.floor(min_elevation / contour_interval)
        * contour_interval
    )

    end_level = (
        np.ceil(max_elevation / contour_interval)
        * contour_interval
    )

    levels = np.arange(
        start_level,
        end_level + contour_interval * 0.5,
        contour_interval
    )

    # Common valid overlapping area
    valid = (
        ~np.ma.getmaskarray(pre)
        & ~np.ma.getmaskarray(post)
    )

    pre_common = np.ma.array(pre, mask=~valid)
    post_common = np.ma.array(post, mask=~valid)

    # Create three-panel figure
    fig, axes = plt.subplots(
        1, 3,
        figsize=(19, 6)
    )

    # PRE contours
    contour1 = axes[0].contour(
        X, Y, pre_common,
        levels=levels,
        cmap="terrain"
    )

    axes[0].clabel(
        contour1,
        inline=True,
        fontsize=7,
        fmt="%.2f"
    )

    axes[0].set_title("PRE-WORK CONTOURS")
    axes[0].set_xlabel("X Coordinate (m)")
    axes[0].set_ylabel("Y Coordinate (m)")

    # POST contours
    contour2 = axes[1].contour(
        X, Y, post_common,
        levels=levels,
        cmap="viridis"
    )

    axes[1].clabel(
        contour2,
        inline=True,
        fontsize=7,
        fmt="%.2f"
    )

    axes[1].set_title("POST-WORK CONTOURS")
    axes[1].set_xlabel("X Coordinate (m)")
    axes[1].set_ylabel("Y Coordinate (m)")

    # Combined comparison
    axes[2].contour(
        X, Y, pre_common,
        levels=levels,
        colors="blue",
        linewidths=0.9
    )

    axes[2].contour(
        X, Y, post_common,
        levels=levels,
        colors="red",
        linewidths=0.9,
        linestyles="dashed"
    )

    axes[2].set_title("PRE vs POST CONTOUR COMPARISON")
    axes[2].set_xlabel("X Coordinate (m)")
    axes[2].set_ylabel("Y Coordinate (m)")

    # Legend
    from matplotlib.lines import Line2D

    legend_items = [
        Line2D([0], [0], color="blue", label="PRE contours"),
        Line2D([0], [0], color="red", linestyle="--",
               label="POST contours")
    ]

    axes[2].legend(handles=legend_items)

    fig.suptitle(
        "Terrain Contour Analysis - Synthetic Demonstration",
        fontsize=15
    )

    plt.tight_layout()

    if output_path is None:
        output_path = OUTPUT_DIR / "contour_comparison.png"
    else:
        output_path = Path(output_path)

    plt.savefig(
        output_path,
        dpi=300,
        bbox_inches="tight"
    )

    plt.close(fig)

    return {
        "output": str(output_path),
        "contour_interval_m": contour_interval,
        "minimum_elevation_m": round(min_elevation, 3),
        "maximum_elevation_m": round(max_elevation, 3),
        "contour_levels": len(levels)
    }


if __name__ == "__main__":

    result = generate_contours()

    print("\nCONTOUR GENERATION COMPLETED")
    print("--------------------------------")

    for key, value in result.items():
        print(f"{key}: {value}")