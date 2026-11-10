
import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Search,
  RefreshCw,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
  Activity,
  ClipboardList
} from 'lucide-react'
import api from '../services/api'

function Warnings() {
  const [warnings, setWarnings] = useState([])
  const [worksites, setWorksites] = useState([])
  const [search, setSearch] = useState('')
  const [selectedWorksite, setSelectedWorksite] = useState('ALL')
  const [selectedWarning, setSelectedWarning] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [warningsResponse, worksitesResponse] = await Promise.all([
        api.get('/warnings'),
        api.get('/worksites')
      ])

      setWarnings(warningsResponse.data)
      setWorksites(worksitesResponse.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load deviation warnings. Please check the backend server.'
      )
    } finally {
      setLoading(false)
    }
  }

  const filteredWarnings = useMemo(() => {
    return warnings.filter((warning) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        (warning.resultId || '').toLowerCase().includes(searchText) ||
        (warning.workId || '').toLowerCase().includes(searchText)

      const matchesWorksite =
        selectedWorksite === 'ALL' ||
        warning.workId === selectedWorksite

      return matchesSearch && matchesWorksite
    })
  }, [warnings, search, selectedWorksite])

  const normalizeLevel = (level) => {
    const value = (level || '').toUpperCase()

    if (value.includes('HIGH')) return 'HIGH'
    if (value.includes('MODERATE')) return 'MODERATE'
    if (value.includes('NORMAL')) return 'NORMAL'

    return 'NOT_AVAILABLE'
  }

  const getWarningClass = (level) => {
    switch (normalizeLevel(level)) {
      case 'HIGH':
        return 'warning-high'
      case 'MODERATE':
        return 'warning-moderate'
      case 'NORMAL':
        return 'warning-normal'
      default:
        return 'warning-unavailable'
    }
  }

  const getWarningIcon = (level) => {
    switch (normalizeLevel(level)) {
      case 'HIGH':
        return <ShieldAlert size={16} />
      case 'MODERATE':
        return <AlertTriangle size={16} />
      case 'NORMAL':
        return <CheckCircle size={16} />
      default:
        return <AlertCircle size={16} />
    }
  }

  const getWarningCounts = (field) => {
    return warnings.filter(
      (item) => normalizeLevel(item[field]) === field
    ).length
  }

  const highCount = warnings.filter(
    (item) => normalizeLevel(item.overallWarning) === 'HIGH'
  ).length

  const moderateCount = warnings.filter(
    (item) => normalizeLevel(item.overallWarning) === 'MODERATE'
  ).length

  const normalCount = warnings.filter(
    (item) => normalizeLevel(item.overallWarning) === 'NORMAL'
  ).length

  const unavailableCount = warnings.filter(
    (item) => normalizeLevel(item.overallWarning) === 'NOT_AVAILABLE'
  ).length

  const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A'
    return `${Number(value).toFixed(3)}%`
  }

  const openDetails = async (warning) => {
    try {
      const response = await api.get(
        `/warnings/result/${warning.resultId}`
      )
      setSelectedWarning(response.data)
    } catch (err) {
      setError('Unable to load the selected warning details.')
    }
  }

  const closeDetails = () => {
    setSelectedWarning(null)
  }

  return (
    <div className="warnings-page">
      <div className="page-header">
        <div>
          <h1>Deviation Warnings</h1>
          <p>
            Monitor estimate and Measurement Book deviations across worksites.
          </p>
        </div>

        <div className="warnings-header-icon">
          <AlertTriangle size={27} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="warning-summary-grid">
        <div className="warning-summary-card">
          <div className="warning-summary-icon total-warning-icon">
            <ClipboardList size={21} />
          </div>
          <span>Total Records</span>
          <h2>{warnings.length}</h2>
          <small>Warning records generated</small>
        </div>

        <div className="warning-summary-card">
          <div className="warning-summary-icon high-warning-icon">
            <ShieldAlert size={21} />
          </div>
          <span>High Warnings</span>
          <h2>{highCount}</h2>
          <small>Overall HIGH severity</small>
        </div>

        <div className="warning-summary-card">
          <div className="warning-summary-icon moderate-warning-icon">
            <AlertTriangle size={21} />
          </div>
          <span>Moderate Warnings</span>
          <h2>{moderateCount}</h2>
          <small>Overall MODERATE severity</small>
        </div>

        <div className="warning-summary-card">
          <div className="warning-summary-icon normal-warning-icon">
            <CheckCircle size={21} />
          </div>
          <span>Normal Records</span>
          <h2>{normalCount}</h2>
          <small>Overall NORMAL severity</small>
        </div>

        <div className="warning-summary-card">
          <div className="warning-summary-icon unavailable-warning-icon">
            <Activity size={21} />
          </div>
          <span>Not Available</span>
          <h2>{unavailableCount}</h2>
          <small>Deviation data unavailable</small>
        </div>
      </div>

      {/* Warning Records */}
      <div className="warnings-records-card">
        <div className="warnings-records-heading">
          <div>
            <h2>Warning Records</h2>
            <p>Deviation classification for each earthwork analysis.</p>
          </div>

          <button
            className="warnings-refresh-button"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? 'spin-icon' : ''}
            />
            Refresh
          </button>
        </div>

        <div className="warnings-filters">
          <div className="warnings-search">
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
          <div className="warnings-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="warnings-message">
            <RefreshCw size={22} className="spin-icon" />
            <p>Loading deviation warnings...</p>
          </div>
        ) : filteredWarnings.length === 0 ? (
          <div className="warnings-message">
            <ClipboardList size={30} />
            <h3>No warning records found</h3>
            <p>
              {warnings.length === 0
                ? 'No deviation warning records are available yet.'
                : 'Try changing your search or worksite filter.'}
            </p>
          </div>
        ) : (
          <div className="warnings-table-wrapper">
            <table className="warnings-table">
              <thead>
                <tr>
                  <th>Result ID</th>
                  <th>Worksite ID</th>
                  <th>Estimate Deviation</th>
                  <th>Estimate Warning</th>
                  <th>MB Deviation</th>
                  <th>MB Warning</th>
                  <th>Overall Warning</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredWarnings.map((warning) => (
                  <tr key={warning.resultId}>
                    <td className="warning-result-id">
                      {warning.resultId}
                    </td>

                    <td>{warning.workId}</td>

                    <td>{formatPercent(warning.estimateDeviationPercent)}</td>

                    <td>
                      <span className={`warning-badge ${getWarningClass(warning.estimateWarning)}`}>
                        {getWarningIcon(warning.estimateWarning)}
                        {warning.estimateWarning || 'NOT_AVAILABLE'}
                      </span>
                    </td>

                    <td>{formatPercent(warning.mbDeviationPercent)}</td>

                    <td>
                      <span className={`warning-badge ${getWarningClass(warning.mbWarning)}`}>
                        {getWarningIcon(warning.mbWarning)}
                        {warning.mbWarning || 'NOT_AVAILABLE'}
                      </span>
                    </td>

                    <td>
                      <span className={`warning-badge ${getWarningClass(warning.overallWarning)}`}>
                        {getWarningIcon(warning.overallWarning)}
                        {warning.overallWarning || 'NOT_AVAILABLE'}
                      </span>
                    </td>

                    <td>
                      <button
                        className="warning-view-button"
                        onClick={() => openDetails(warning)}
                        title="View warning details"
                      >
                        <Eye size={16} />
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
          <div className="warnings-table-footer">
            Showing {filteredWarnings.length} of {warnings.length} records
          </div>
        )}
      </div>

      {/* Threshold Information */}
      <div className="warning-threshold-card">
        <div className="warning-threshold-heading">
          <AlertCircle size={19} />
          <h3>Deviation Classification Rules</h3>
        </div>

        <div className="warning-threshold-grid">
          <div>
            <span className="warning-badge warning-normal">
              <CheckCircle size={15} /> NORMAL
            </span>
            <strong>0% – 5%</strong>
            <small>Within demonstration range</small>
          </div>

          <div>
            <span className="warning-badge warning-moderate">
              <AlertTriangle size={15} /> MODERATE
            </span>
            <strong>Above 5% – 10%</strong>
            <small>Moderate deviation</small>
          </div>

          <div>
            <span className="warning-badge warning-high">
              <ShieldAlert size={15} /> HIGH
            </span>
            <strong>Above 10%</strong>
            <small>High deviation</small>
          </div>
        </div>

        <p>
          These thresholds are demonstration rules defined for this project.
          They are not official MGNREGS tolerance limits.
        </p>
      </div>

      {/* Warning Details Modal */}
      {selectedWarning && (
        <div
          className="warning-modal-overlay"
          onClick={closeDetails}
        >
          <div
            className="warning-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="warning-modal-header">
              <div>
                <h2>Warning Details</h2>
                <p>{selectedWarning.resultId}</p>
              </div>

              <button
                className="warning-modal-close"
                onClick={closeDetails}
              >
                <X size={21} />
              </button>
            </div>

            <div className="warning-modal-body">
              <div className="warning-overall-detail">
                <span>Overall Warning</span>
                <strong className={`warning-badge ${getWarningClass(selectedWarning.overallWarning)}`}>
                  {getWarningIcon(selectedWarning.overallWarning)}
                  {selectedWarning.overallWarning || 'NOT_AVAILABLE'}
                </strong>
              </div>

              <div className="warning-detail-section">
                <h3>Estimate Comparison</h3>
                <div>
                  <span>Estimate Deviation</span>
                  <strong>
                    {formatPercent(selectedWarning.estimateDeviationPercent)}
                  </strong>
                </div>
                <div>
                  <span>Estimate Warning</span>
                  <strong className={`warning-badge ${getWarningClass(selectedWarning.estimateWarning)}`}>
                    {getWarningIcon(selectedWarning.estimateWarning)}
                    {selectedWarning.estimateWarning || 'NOT_AVAILABLE'}
                  </strong>
                </div>
              </div>

              <div className="warning-detail-section">
                <h3>Measurement Book Comparison</h3>
                <div>
                  <span>MB Deviation</span>
                  <strong>
                    {formatPercent(selectedWarning.mbDeviationPercent)}
                  </strong>
                </div>
                <div>
                  <span>MB Warning</span>
                  <strong className={`warning-badge ${getWarningClass(selectedWarning.mbWarning)}`}>
                    {getWarningIcon(selectedWarning.mbWarning)}
                    {selectedWarning.mbWarning || 'NOT_AVAILABLE'}
                  </strong>
                </div>
              </div>

              <div className="warning-detail-section">
                <h3>Reference Information</h3>
                <div>
                  <span>Result ID</span>
                  <strong>{selectedWarning.resultId}</strong>
                </div>
                <div>
                  <span>Worksite ID</span>
                  <strong>{selectedWarning.workId}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Warnings
