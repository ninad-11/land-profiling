import numpy as np
import rasterio


def analyze_dem(pre_dem_path, post_dem_path):

    # Open both DEM files
    with rasterio.open(pre_dem_path) as pre_src, \
         rasterio.open(post_dem_path) as post_src:

        # Check raster dimensions
        if pre_src.shape != post_src.shape:
            raise ValueError(
                "PRE and POST DEM dimensions do not match."
            )

        # Check spatial alignment
        if pre_src.transform != post_src.transform:
            raise ValueError(
                "PRE and POST DEM grids are not aligned."
            )

        # Check coordinate reference systems
        if pre_src.crs != post_src.crs:
            raise ValueError(
                "PRE and POST DEM coordinate systems do not match."
            )

        # Read elevation data
        pre = pre_src.read(1, masked=True)
        post = post_src.read(1, masked=True)

        # Identify valid overlapping pixels
        valid = (
            ~np.ma.getmaskarray(pre)
            & ~np.ma.getmaskarray(post)
        )

        if not np.any(valid):
            raise ValueError("No valid overlapping DEM pixels found.")

        # Calculate elevation differences
        difference = (
            pre.filled(0) - post.filled(0)
        )

        # Pixel area from the affine transformation
        transform = pre_src.transform

        pixel_area = abs(
            transform.a * transform.e
            - transform.b * transform.d
        )

        # Determine whether measurements use metres
        if pre_src.crs is not None:
            if not pre_src.crs.is_projected:
                raise ValueError(
                    "DEM must use a projected coordinate system."
                )

            axes = pre_src.crs.axis_info

            if len(axes) < 2 or any(
                not np.isclose(axis.unit_conversion_factor, 1.0)
                for axis in axes[:2]
            ):
                raise ValueError(
                    "DEM horizontal units must be metres."
                )

            coordinate_reference = pre_src.crs.to_string()

        else:
            # Used only for our synthetic local-grid DEMs
            coordinate_reference = "LOCAL GRID - ASSUMED METRES"

        # Cut and fill depths
        cut_depth = np.maximum(difference, 0)
        fill_depth = np.maximum(-difference, 0)

        # Calculate volumes using valid pixels only
        cut_volume = np.sum(cut_depth[valid]) * pixel_area
        fill_volume = np.sum(fill_depth[valid]) * pixel_area

        net_cut_volume = cut_volume - fill_volume

        return {
            "status": "success",
            "data_status": "CALCULATED - VALIDATION REQUIRED",
            "rows": pre_src.height,
            "columns": pre_src.width,
            "valid_pixels": int(np.sum(valid)),
            "pixel_area_m2": round(float(pixel_area), 6),
            "coordinate_reference": coordinate_reference,
            "cut_volume_m3": round(float(cut_volume), 3),
            "fill_volume_m3": round(float(fill_volume), 3),
            "net_cut_volume_m3": round(float(net_cut_volume), 3)
        }


if __name__ == "__main__":

    from pathlib import Path

    base_dir = Path(__file__).resolve().parent.parent

    pre_path = base_dir / "data" / "pre_dem.tif"
    post_path = base_dir / "data" / "post_dem.tif"

    result = analyze_dem(pre_path, post_path)

    print("\nDEM ANALYSIS RESULTS")
    print("--------------------------------")

    for key, value in result.items():
        print(f"{key}: {value}")