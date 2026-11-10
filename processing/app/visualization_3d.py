import numpy as np
import rasterio
import plotly.graph_objects as go

from pathlib import Path


# Project directories
BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "outputs"

OUTPUT_DIR.mkdir(exist_ok=True)


def create_3d_visualization(
    pre_path=None,
    post_path=None,
    comparison_path=None,
    difference_path=None
):

    # DEM file paths
    if pre_path is None:
        pre_path = DATA_DIR / "pre_dem.tif"

    if post_path is None:
        post_path = DATA_DIR / "post_dem.tif"

    pre_path = Path(pre_path)
    post_path = Path(post_path)

    # Read PRE terrain
    with rasterio.open(pre_path) as src:
        pre = src.read(1)
        transform = src.transform

    # Read POST terrain
    with rasterio.open(post_path) as src:
        post = src.read(1)

    # Check dimensions
    if pre.shape != post.shape:
        raise ValueError("PRE and POST DEM dimensions do not match.")

    rows, cols = pre.shape

    # Generate coordinate grids
    x = np.arange(cols)
    y = np.arange(rows)

    X, Y = np.meshgrid(x, y)

    # Calculate elevation difference
    difference = pre - post

    # Create 3D visualization
    fig = go.Figure()

    # PRE terrain surface
    fig.add_trace(
        go.Surface(
            x=X,
            y=Y,
            z=pre,
            colorscale="Earth",
            name="PRE Terrain",
            colorbar=dict(
                title="Elevation (m)",
                x=1.02
            ),
            showscale=True,
            opacity=0.95
        )
    )

    # POST terrain surface
    fig.add_trace(
        go.Surface(
            x=X,
            y=Y,
            z=post,
            colorscale="Viridis",
            name="POST Terrain",
            opacity=0.75,
            showscale=False
        )
    )

    fig.update_layout(
        title="3D Terrain Profiling - PRE and POST Comparison",

        autosize=True,

        scene=dict(
            xaxis_title="X Coordinate (m)",
            yaxis_title="Y Coordinate (m)",
            zaxis_title="Elevation (m)",

            aspectmode="manual",
            aspectratio=dict(
                x=1,
                y=1,
                z=0.4
            ),

            camera=dict(
                eye=dict(
                    x=1.5,
                    y=1.5,
                    z=1.1
                ),
                center=dict(
                    x=0,
                    y=0,
                    z=0
                ),
                projection=dict(
                    type="perspective"
                )
            )
        ),

        margin=dict(
            l=10,
            r=100,
            b=10,
            t=70
        ),

        paper_bgcolor="white",
        plot_bgcolor="white"
    )

    # Save PRE and POST comparison
    if comparison_path is None:
        comparison_path = OUTPUT_DIR / "terrain_3d_comparison.html"
    else:
        comparison_path = Path(comparison_path)

    fig.write_html(
        comparison_path,
        config={
            "responsive": True,
            "displayModeBar": True,
            "scrollZoom": True
        }
    )

    # Create difference surface
    difference_fig = go.Figure(
        data=[
            go.Surface(
                x=X,
                y=Y,
                z=difference,
                colorscale="RdBu",
                colorbar=dict(
                    title="PRE - POST (m)"
                )
            )
        ]
    )

    difference_fig.update_layout(
        title="3D Cut and Fill Difference Surface",

        autosize=True,

        scene=dict(
            xaxis_title="X Coordinate (m)",
            yaxis_title="Y Coordinate (m)",
            zaxis_title="Elevation Difference (m)",

            aspectmode="manual",
            aspectratio=dict(
                x=1,
                y=1,
                z=0.4
            ),

            camera=dict(
                eye=dict(
                    x=1.5,
                    y=1.5,
                    z=1.1
                ),
                center=dict(
                    x=0,
                    y=0,
                    z=0
                ),
                projection=dict(
                    type="perspective"
                )
            )
        ),

        margin=dict(
            l=10,
            r=100,
            b=10,
            t=70
        ),

        paper_bgcolor="white",
        plot_bgcolor="white"
    )

    if difference_path is None:
        difference_path = OUTPUT_DIR / "terrain_3d_difference.html"
    else:
        difference_path = Path(difference_path)

    difference_fig.write_html(
        difference_path,
        config={
            "responsive": True,
            "displayModeBar": True,
            "scrollZoom": True
        }
    )

    return {
        "comparison": str(comparison_path),
        "difference": str(difference_path)
    }


if __name__ == "__main__":

    result = create_3d_visualization()

    print("\n3D TERRAIN VISUALIZATION COMPLETED")
    print("-----------------------------------")

    for key, value in result.items():
        print(f"{key}: {value}")