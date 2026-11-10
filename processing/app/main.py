
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from rasterio.errors import RasterioIOError

from app.analysis import analyze_dem
from app.visualization import visualize_terrain
from app.visualization_3d import create_3d_visualization
from app.contour_analysis import create_contour_visualization


app = FastAPI(
    title="Land Profiling Processing API",
    description="3D Terrain Profiling for MGNREGS Earthwork Sites",
    version="1.0.0"
)

BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_DIR = BASE_DIR / "data" / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Serve generated visualization files through HTTP.
app.mount(
    "/visualizations",
    StaticFiles(directory=str(OUTPUT_DIR)),
    name="visualizations"
)


@app.get("/")
def home():
    return {
        "message": "Land Profiling Processing API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "terrain-processing"
    }


@app.post("/analyze-dem")
async def upload_and_analyze_dem(
    pre_file: UploadFile = File(...),
    post_file: UploadFile = File(...)
):

    if Path(pre_file.filename or "").suffix.lower() not in (".tif", ".tiff"):
        raise HTTPException(
            status_code=400,
            detail="PRE file must be a GeoTIFF."
        )

    if Path(post_file.filename or "").suffix.lower() not in (".tif", ".tiff"):
        raise HTTPException(
            status_code=400,
            detail="POST file must be a GeoTIFF."
        )

    analysis_id = uuid4().hex

    pre_path = UPLOAD_DIR / f"{analysis_id}_pre.tif"
    post_path = UPLOAD_DIR / f"{analysis_id}_post.tif"

    analysis_output_dir = OUTPUT_DIR / analysis_id

    try:
        pre_data = await pre_file.read()
        post_data = await post_file.read()

        if not pre_data or not post_data:
            raise HTTPException(
                status_code=400,
                detail="Uploaded files cannot be empty."
            )

        if len(pre_data) > 100 * 1024 * 1024:
            raise HTTPException(400, "PRE DEM exceeds 100 MB.")

        if len(post_data) > 100 * 1024 * 1024:
            raise HTTPException(400, "POST DEM exceeds 100 MB.")

        pre_path.write_bytes(pre_data)
        post_path.write_bytes(post_data)

        # Create a separate folder for each analysis.
        analysis_output_dir.mkdir(parents=True, exist_ok=True)

        # 1. Calculate cut, fill and net earthwork volumes.
        result = analyze_dem(pre_path, post_path)

        # 2. Generate 2D terrain comparison.
        terrain_2d_path = analysis_output_dir / "terrain_comparison.png"

        visualize_terrain(
            pre_path=pre_path,
            post_path=post_path,
            output_path=terrain_2d_path
        )

        # 3. Generate interactive 3D visualizations.
        terrain_3d_paths = create_3d_visualization(
            pre_path=pre_path,
            post_path=post_path,
            comparison_path=analysis_output_dir / "terrain_3d_comparison.html",
            difference_path=analysis_output_dir / "terrain_3d_difference.html"
        )

        # 4. Generate contour comparison.
        contour_path = analysis_output_dir / "contour_comparison.png"

        create_contour_visualization(
            pre_path=pre_path,
            post_path=post_path,
            output_path=contour_path
        )

        # Add visualization URLs to the processing response.
        result["analysis_id"] = analysis_id

        result["visualizations"] = {
            "terrain_2d": f"/visualizations/{analysis_id}/terrain_comparison.png",
            "terrain_3d_comparison": f"/visualizations/{analysis_id}/terrain_3d_comparison.html",
            "terrain_3d_difference": f"/visualizations/{analysis_id}/terrain_3d_difference.html",
            "contour_comparison": f"/visualizations/{analysis_id}/contour_comparison.png"
        }

        result["data_status"] = "SYNTHETIC DEM - NOT SURVEY DATA"

        return result

    except HTTPException:
        raise

    except (ValueError, RasterioIOError) as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="DEM processing or visualization failed: " + str(error)
        )

    finally:
        await pre_file.close()
        await post_file.close()

        pre_path.unlink(missing_ok=True)
        post_path.unlink(missing_ok=True)
