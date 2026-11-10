
import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Search,
  RefreshCw,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText
} from 'lucide-react'
import api from '../services/api'

function EarthworkResults() {
  const [results, setResults] = useState([])
  const [worksites, setWorksites] = useState([])
  const [search, setSearch] = useState('')
  const [selectedWorksite, setSelectedWorksite] = useState('ALL')
  const [selectedResult, setSelectedResult] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [resultsResponse, worksitesResponse] = await Promise.all([
        api.get('/earthwork-results'),
        api.get('/worksites')
      ])

      setResults(resultsResponse.data)
      setWorksites(worksitesResponse.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load earthwork results. Please check the backend server.'
      )
    } finally {
      setLoading(false)
    }
  }

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        (result.resultId || '').toLowerCase().includes(searchText) ||
        (result.workId || '').toLowerCase().includes(searchText)

      const matchesWorksite =
        selectedWorksite === 'ALL' ||
        result.workId === selectedWorksite

      return matchesSearch && matchesWorksite
    })
  }, [results, search, selectedWorksite])

  const formatNumber = (value) => {
    if (value === null || value === undefined) return 'N/A'
    return Number(value).toFixed(3)
  }

  const getDeviationClass = (value) => {
    if (value === null || value === undefined) return 'result-neutral'
    const deviation = Math.abs(Number(value))

    if (deviation > 10) return 'result-high'
    if (deviation > 5) return 'result-moderate'
    return 'result-normal'
  }

  const getStatusClass = (status) => {
    const value = (status || '').toUpperCase()

    if (value.includes('APPROVED')) return 'result-status-approved'
    if (value.includes('REJECTED')) return 'result-status-rejected'
    if (value.includes('VALIDATION REQUIRED')) return 'result-status-pending'

    return 'result-status-default'
  }

  const openDetails = async (result) => {
    try {
      const response = await api.get(
        `/earthwork-results/${result.resultId}`
      )
      setSelectedResult(response.data)
    } catch (err) {
      setError('Unable to load the selected result details.')
    }
  }

  const closeDetails = () => {
    setSelectedResult(null)
  }

  const totalCut = results.reduce(
    (sum, item) => sum + Number(item.cutVolumeM3 || 0),
    0
  )

  const totalFill = results.reduce(
    (sum, item) => sum + Number(item.fillVolumeM3 || 0),
    0
  )

  const totalNetCut = results.reduce(
    (sum, item) => sum + Number(item.netCutVolumeM3 || 0),
    0
  )

  return (
    <div className="earthwork-results-page">
      <div className="page-header">
        <div>
          <h1>Earthwork Results</h1>
          <p>Review calculated cut and fill volumes and compare them with recorded quantities.</p>
        </div>

        <div className="earthwork-header-icon">
          <Activity size={27} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="earthwork-summary-grid">
        <div className="earthwork-summary-card">
          <div className="earthwork-summary-icon cut-summary-icon">
            <ArrowDownToLine size={21} />
          </div>
          <span>Total Results</span>
          <h2>{results.length}</h2>
          <small>Calculated records</small>
        </div>

        <div className="earthwork-summary-card">
          <div className="earthwork-summary-icon cut-summary-icon">
            <ArrowDownToLine size={21} />
          </div>
          <span>Total Cut Volume</span>
          <h2>{formatNumber(totalCut)}</h2>
          <small>m³ across all results</small>
        </div>

        <div className="earthwork-summary-card">
          <div className="earthwork-summary-icon fill-summary-icon">
            <ArrowUpFromLine size={21} />
          </div>
          <span>Total Fill Volume</span>
          <h2>{formatNumber(totalFill)}</h2>
          <small>m³ across all results</small>
        </div>

        <div className="earthwork-summary-card">
          <div className="earthwork-summary-icon net-summary-icon">
            <Layers size={21} />
          </div>
          <span>Total Net Cut</span>
          <h2>{formatNumber(totalNetCut)}</h2>
          <small>m³ across all results</small>
        </div>
      </div>

      {/* Results Table */}
      <div className="earthwork-results-card">
        <div className="earthwork-results-heading">
          <div>
            <h2>Analysis Records</h2>
            <p>All previously calculated earthwork results.</p>
          </div>

          <button
            className="earthwork-refresh-button"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
            Refresh
          </button>
        </div>

        <div className="earthwork-filters">
          <div className="earthwork-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search Result ID or Worksite ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={selectedWorksite}
            onChange={(e) => setSelectedWorksite(e.target.value)}
          >
            <option value="ALL">All Worksites</option>
            {worksites.map((worksite) => (
              <option key={worksite.workId} value={worksite.workId}>
                {worksite.workId}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="earthwork-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="earthwork-message">
            <RefreshCw size={22} className="spin-icon" />
            <p>Loading earthwork results...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="earthwork-message">
            <FileText size={30} />
            <h3>No results found</h3>
            <p>
              {results.length === 0
                ? 'No earthwork analysis records are available yet.'
                : 'Try changing your search or worksite filter.'}
            </p>
          </div>
        ) : (
          <div className="earthwork-table-wrapper">
            <table className="earthwork-table">
              <thead>
                <tr>
                  <th>Result ID</th>
                  <th>Worksite ID</th>
                  <th>Cut (m³)</th>
                  <th>Fill (m³)</th>
                  <th>Net Cut (m³)</th>
                  <th>Estimate Deviation</th>
                  <th>MB Deviation</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result.resultId}>
                    <td className="result-id-cell">{result.resultId}</td>
                    <td>{result.workId}</td>
                    <td>{formatNumber(result.cutVolumeM3)}</td>
                    <td>{formatNumber(result.fillVolumeM3)}</td>
                    <td>{formatNumber(result.netCutVolumeM3)}</td>
                    <td>
                      <span className={getDeviationClass(result.differencePercent)}>
                        {result.differencePercent == null
                          ? 'N/A'
                          : `${formatNumber(result.differencePercent)}%`}
                      </span>
                    </td>
                    <td>
                      <span className={getDeviationClass(result.mbDifferencePercent)}>
                        {result.mbDifferencePercent == null
                          ? 'N/A'
                          : `${formatNumber(result.mbDifferencePercent)}%`}
                      </span>
                    </td>
                    <td>
                      <span className={`result-status ${getStatusClass(result.dataStatus)}`}>
                        {result.dataStatus || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="result-view-button"
                        onClick={() => openDetails(result)}
                        title="View result details"
                      >
                        <Eye size={17} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="earthwork-table-footer">
            Showing {filteredResults.length} of {results.length} records
          </div>
        )}
      </div>

      {/* Result Details Modal */}
      {selectedResult && (
        <div className="result-modal-overlay" onClick={closeDetails}>
          <div
            className="result-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="result-modal-header">
              <div>
                <h2>Result Details</h2>
                <p>{selectedResult.resultId}</p>
              </div>

              <button
                className="result-modal-close"
                onClick={closeDetails}
              >
                <X size={21} />
              </button>
            </div>

            <div className="result-modal-body">
              <div className="result-modal-status">
                <span>Calculation Status</span>
                <strong className={`result-status ${getStatusClass(selectedResult.dataStatus)}`}>
                  {selectedResult.dataStatus}
                </strong>
              </div>

              <h3>Earthwork Quantities</h3>

              <div className="result-detail-grid">
                <div>
                  <span>Cut Volume</span>
                  <strong>{formatNumber(selectedResult.cutVolumeM3)} m³</strong>
                </div>
                <div>
                  <span>Fill Volume</span>
                  <strong>{formatNumber(selectedResult.fillVolumeM3)} m³</strong>
                </div>
                <div>
                  <span>Net Cut Volume</span>
                  <strong>{formatNumber(selectedResult.netCutVolumeM3)} m³</strong>
                </div>
              </div>

              <h3>Estimate Comparison</h3>

              <div className="result-detail-list">
                <div>
                  <span>Estimated Quantity</span>
                  <strong>{formatNumber(selectedResult.estimatedQuantityM3)} m³</strong>
                </div>
                <div>
                  <span>Absolute Difference</span>
                  <strong>{formatNumber(selectedResult.absoluteDifferenceM3)} m³</strong>
                </div>
                <div>
                  <span>Deviation</span>
                  <strong className={getDeviationClass(selectedResult.differencePercent)}>
                    {selectedResult.differencePercent == null
                      ? 'N/A'
                      : `${formatNumber(selectedResult.differencePercent)}%`}
                  </strong>
                </div>
              </div>

              <h3>Measurement Book Comparison</h3>

              <div className="result-detail-list">
                <div>
                  <span>Recorded Quantity</span>
                  <strong>{formatNumber(selectedResult.recordedQuantityM3)} m³</strong>
                </div>
                <div>
                  <span>MB Difference</span>
                  <strong>{formatNumber(selectedResult.mbDifferenceM3)} m³</strong>
                </div>
                <div>
                  <span>MB Deviation</span>
                  <strong className={getDeviationClass(selectedResult.mbDifferencePercent)}>
                    {selectedResult.mbDifferencePercent == null
                      ? 'N/A'
                      : `${formatNumber(selectedResult.mbDifferencePercent)}%`}
                  </strong>
                </div>
              </div>

              <h3>Processing Information</h3>

              <div className="result-detail-list">
                <div>
                  <span>Result ID</span>
                  <strong>{selectedResult.resultId}</strong>
                </div>
                <div>
                  <span>Worksite ID</span>
                  <strong>{selectedResult.workId}</strong>
                </div>
                <div>
                  <span>Calculation Method</span>
                  <strong>{selectedResult.calculationMethod || 'N/A'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EarthworkResults
