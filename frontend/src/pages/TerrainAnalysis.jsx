
import { useEffect, useState } from 'react'
import {
  Upload,
  Mountain,
  FileUp,
  Calculator,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity
} from 'lucide-react'
import api from '../services/api'

function TerrainAnalysis() {
  const [worksites, setWorksites] = useState([])
  const [workId, setWorkId] = useState('')
  const [preFile, setPreFile] = useState(null)
  const [postFile, setPostFile] = useState(null)

  const [loadingWorksites, setLoadingWorksites] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [activeVisualization, setActiveVisualization] = useState('terrain2d')

  useEffect(() => {
    fetchWorksites()
  }, [])

  const fetchWorksites = async () => {
    try {
      setLoadingWorksites(true)
      const response = await api.get('/worksites')
      setWorksites(response.data)

      if (response.data.length > 0) {
        setWorkId(response.data[0].workId)
      }
    } catch (err) {
      setError('Unable to load worksites. Please check the backend server.')
    } finally {
      setLoadingWorksites(false)
    }
  }

  const handleFileChange = (event, type) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedExtensions = ['.tif', '.tiff']
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

    if (!allowedExtensions.includes(extension)) {
      setError('Please select a valid GeoTIFF file (.tif or .tiff).')
      event.target.value = ''
      return
    }

    if (type === 'PRE') {
      setPreFile(file)
    } else {
      setPostFile(file)
    }

    setError('')
    setResult(null)
  }

  const handleAnalyze = async () => {
    if (!workId) {
      setError('Please select a worksite.')
      return
    }

    if (!preFile || !postFile) {
      setError('Please upload both PRE and POST DEM files.')
      return
    }

    const formData = new FormData()
    formData.append('preFile', preFile)
    formData.append('postFile', postFile)

    try {
      setProcessing(true)
      setError('')
      setResult(null)

      const response = await api.post(
        `/processing/worksite/${workId}/analyze`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      setResult(response.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Terrain processing failed. Check whether both backend services are running.'
      )
    } finally {
      setProcessing(false)
    }
  }

  const formatNumber = (value) => {
    if (value === null || value === undefined) return 'N/A'
    return Number(value).toFixed(3)
  }

  const getDeviationClass = (value) => {
    if (value === null || value === undefined) return 'deviation-neutral'
    if (Math.abs(Number(value)) > 10) return 'deviation-high'
    if (Math.abs(Number(value)) > 5) return 'deviation-moderate'
    return 'deviation-normal'
  }

  return (
    <div className="terrain-page">
      <div className="page-header">
        <div>
          <h1>Terrain Analysis</h1>
          <p>Compare PRE and POST terrain elevation models and calculate earthwork quantities.</p>
        </div>
        <div className="terrain-header-icon">
          <Mountain size={27} />
        </div>
      </div>

      {/* Upload Section */}
      <div className="terrain-card">
        <div className="section-heading">
          <div className="section-icon">
            <Upload size={20} />
          </div>
          <div>
            <h2>Upload Terrain Models</h2>
            <p>Select a worksite and upload its PRE and POST DEM files.</p>
          </div>
        </div>

        <div className="terrain-form-group">
          <label htmlFor="worksite">Select Worksite</label>
          <select
            id="worksite"
            value={workId}
            onChange={(e) => {
              setWorkId(e.target.value)
              setResult(null)
            }}
            disabled={loadingWorksites || processing}
          >
            {loadingWorksites ? (
              <option>Loading worksites...</option>
            ) : worksites.length === 0 ? (
              <option value="">No worksites available</option>
            ) : (
              worksites.map((worksite) => (
                <option key={worksite.workId} value={worksite.workId}>
                  {worksite.workId} - {worksite.workName}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="terrain-upload-grid">
          <div className="terrain-upload-box">
            <div className="upload-icon pre-icon">
              <ArrowDownToLine size={23} />
            </div>
            <h3>PRE Terrain Model</h3>
            <p>Upload the terrain model captured before earthwork.</p>

            <label className="terrain-file-button">
              <FileUp size={17} />
              Choose PRE File
              <input
                type="file"
                accept=".tif,.tiff"
                onChange={(e) => handleFileChange(e, 'PRE')}
                disabled={processing}
                hidden
              />
            </label>

            <div className="selected-file">
              {preFile ? (
                <>
                  <CheckCircle size={16} color="#16834a" />
                  <span>{preFile.name}</span>
                </>
              ) : (
                <span>No PRE file selected</span>
              )}
            </div>
          </div>

          <div className="terrain-upload-box">
            <div className="upload-icon post-icon">
              <ArrowUpFromLine size={23} />
            </div>
            <h3>POST Terrain Model</h3>
            <p>Upload the terrain model captured after earthwork.</p>

            <label className="terrain-file-button">
              <FileUp size={17} />
              Choose POST File
              <input
                type="file"
                accept=".tif,.tiff"
                onChange={(e) => handleFileChange(e, 'POST')}
                disabled={processing}
                hidden
              />
            </label>

            <div className="selected-file">
              {postFile ? (
                <>
                  <CheckCircle size={16} color="#16834a" />
                  <span>{postFile.name}</span>
                </>
              ) : (
                <span>No POST file selected</span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="terrain-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <button
          className="terrain-analyze-button"
          onClick={handleAnalyze}
          disabled={processing || loadingWorksites || !workId}
        >
          {processing ? (
            <>
              <RefreshCw size={18} className="spin-icon" />
              Processing Terrain...
            </>
          ) : (
            <>
              <Calculator size={18} />
              Analyze Terrain
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="terrain-results">
          <div className="section-heading">
            <div className="section-icon">
              <Activity size={20} />
            </div>
            <div>
              <h2>Terrain Analysis Results</h2>
              <p>Calculated earthwork quantities and reference comparisons.</p>
            </div>
          </div>

          <div className="result-success">
            <CheckCircle size={19} />
            Terrain analysis completed successfully.
          </div>

          <div className="terrain-metric-grid">
            <div className="terrain-metric-card">
              <div className="metric-icon cut-icon">
                <ArrowDownToLine size={20} />
              </div>
              <span>Cut Volume</span>
              <h2>{formatNumber(result.result.cutVolumeM3)}</h2>
              <small>m³</small>
            </div>

            <div className="terrain-metric-card">
              <div className="metric-icon fill-icon">
                <ArrowUpFromLine size={20} />
              </div>
              <span>Fill Volume</span>
              <h2>{formatNumber(result.result.fillVolumeM3)}</h2>
              <small>m³</small>
            </div>

            <div className="terrain-metric-card">
              <div className="metric-icon net-icon">
                <Layers size={20} />
              </div>
              <span>Net Cut Volume</span>
              <h2>{formatNumber(result.result.netCutVolumeM3)}</h2>
              <small>m³</small>
            </div>
          </div>

          <div className="terrain-card">
            <h3>Estimate Comparison</h3>
            <div className="comparison-grid">
              <div>
                <span>Estimated Quantity</span>
                <strong>{formatNumber(result.result.estimatedQuantityM3)} m³</strong>
              </div>
              <div>
                <span>Absolute Difference</span>
                <strong>{formatNumber(result.result.absoluteDifferenceM3)} m³</strong>
              </div>
              <div>
                <span>Deviation</span>
                <strong className={getDeviationClass(result.differencePercent)}>
                  {result.differencePercent == null
                    ? 'N/A'
                    : `${formatNumber(result.result.differencePercent)}%`}
                </strong>
              </div>
            </div>
          </div>

          <div className="terrain-card">
            <h3>Measurement Book (MB) Comparison</h3>
            <div className="comparison-grid">
              <div>
                <span>Recorded Quantity</span>
                <strong>{formatNumber(result.result.recordedQuantityM3)} m³</strong>
              </div>
              <div>
                <span>MB Difference</span>
                <strong>{formatNumber(result.result.mbDifferenceM3)} m³</strong>
              </div>
              <div>
                <span>MB Deviation</span>
                <strong className={getDeviationClass(result.mbDifferencePercent)}>
                  {result.mbDifferencePercent == null
                    ? 'N/A'
                    : `${formatNumber(result.result.mbDifferencePercent)}%`}
                </strong>
              </div>
            </div>
          </div>

          <div className="terrain-card result-details">
            <h3>Processing Information</h3>
            <div className="detail-row">
              <span>Result ID</span>
              <strong>{result.result.resultId}</strong>
            </div>
            <div className="detail-row">
              <span>Worksite ID</span>
              <strong>{result.result.workId}</strong>
            </div>
            <div className="detail-row">
              <span>Calculation Status</span>
              <strong>{result.result.dataStatus}</strong>
            </div>
            <div className="detail-row">
              <span>Calculation Method</span>
              <strong>{result.result.calculationMethod}</strong>
            </div>
          </div>

          {/* Terrain Visualizations */}
          <div className="terrain-card visualization-card">

            <div className="section-heading">
              <div className="section-icon">
                <Mountain size={20} />
              </div>
              <div>
                <h2>Terrain Visualizations</h2>
                <p>
                  Visual comparison of PRE and POST terrain surfaces.
                </p>
              </div>
            </div>

            <div className="visualization-tabs">

              <button
                className={activeVisualization === 'terrain2d' ? 'active' : ''}
                onClick={() => setActiveVisualization('terrain2d')}
              >
                2D Comparison
              </button>

              <button
                className={activeVisualization === 'terrain3dComparison' ? 'active' : ''}
                onClick={() => setActiveVisualization('terrain3dComparison')}
              >
                3D Comparison
              </button>

              <button
                className={activeVisualization === 'terrain3dDifference' ? 'active' : ''}
                onClick={() => setActiveVisualization('terrain3dDifference')}
              >
                3D Difference
              </button>

              <button
                className={activeVisualization === 'contourComparison' ? 'active' : ''}
                onClick={() => setActiveVisualization('contourComparison')}
              >
                Contour Map
              </button>

            </div>

            <div className="visualization-display">

              {activeVisualization === 'terrain2d' && (
                <img
                  src={result.visualizations?.terrain2d}
                  alt="PRE and POST terrain comparison"
                />
              )}

              {activeVisualization === 'contourComparison' && (
                <img
                  src={result.visualizations?.contourComparison}
                  alt="PRE and POST contour comparison"
                />
              )}

              {activeVisualization === 'terrain3dComparison' && (
                <iframe
                  src={result.visualizations?.terrain3dComparison}
                  title="3D Terrain Comparison"
                  allowFullScreen
                />
              )}

              {activeVisualization === 'terrain3dDifference' && (
                <iframe
                  src={result.visualizations?.terrain3dDifference}
                  title="3D Terrain Difference"
                  allowFullScreen
                />
              )}

            </div>

            <div className="visualization-note">
              <AlertCircle size={16} />
              <span>
                {result.dataStatus || 'Visualization data status unavailable'}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default TerrainAnalysis
