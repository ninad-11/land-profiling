
import { useEffect, useMemo, useState } from 'react'
import {
  ShieldCheck,
  Search,
  RefreshCw,
  Plus,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  ClipboardCheck,
  FileText,
  History
} from 'lucide-react'
import api from '../services/api'

function Validations() {
  const [validations, setValidations] = useState([])
  const [results, setResults] = useState([])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [showForm, setShowForm] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  const [formData, setFormData] = useState({
    resultId: '',
    validationStatus: 'APPROVED',
    validatedBy: '',
    remarks: ''
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [validationResponse, resultsResponse] = await Promise.all([
        api.get('/validations'),
        api.get('/earthwork-results')
      ])

      setValidations(validationResponse.data)
      setResults(resultsResponse.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load validation records. Please check the backend server.'
      )
    } finally {
      setLoading(false)
    }
  }

  const filteredValidations = useMemo(() => {
    return validations.filter((item) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        (item.resultId || '').toLowerCase().includes(searchText) ||
        (item.validatedBy || '').toLowerCase().includes(searchText) ||
        (item.remarks || '').toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === 'ALL' ||
        item.validationStatus === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [validations, search, statusFilter])

  const approvedCount = validations.filter(
    (item) => item.validationStatus === 'APPROVED'
  ).length

  const rejectedCount = validations.filter(
    (item) => item.validationStatus === 'REJECTED'
  ).length

  const reviewCount = validations.filter(
    (item) => item.validationStatus === 'NEEDS_REVIEW'
  ).length

  const formatDate = (value) => {
    if (!value) return 'N/A'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  const getStatusClass = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'APPROVED':
        return 'validation-approved'
      case 'REJECTED':
        return 'validation-rejected'
      case 'NEEDS_REVIEW':
        return 'validation-needs-review'
      default:
        return 'validation-default'
    }
  }

  const getStatusIcon = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'APPROVED':
        return <CheckCircle size={16} />
      case 'REJECTED':
        return <AlertCircle size={16} />
      case 'NEEDS_REVIEW':
        return <Clock size={16} />
      default:
        return <ClipboardCheck size={16} />
    }
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.resultId) {
      setError('Please select an earthwork result.')
      return
    }

    if (!formData.validatedBy.trim()) {
      setError('Please enter the reviewer name.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const payload = {
        validationStatus: formData.validationStatus,
        validatedBy: formData.validatedBy.trim(),
        remarks: formData.remarks.trim()
      }

      await api.post(
        `/validations/result/${formData.resultId}`,
        payload
      )

      setSuccess('Validation decision submitted successfully.')

      setFormData({
        resultId: '',
        validationStatus: 'APPROVED',
        validatedBy: '',
        remarks: ''
      })

      setShowForm(false)
      await fetchData()
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to submit validation. Please check the entered information.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const openHistory = async (resultId) => {
    try {
      setHistoryLoading(true)
      setError('')

      const [historyResponse, resultResponse] = await Promise.all([
        api.get(`/validations/result/${resultId}`),
        api.get(`/earthwork-results/${resultId}`)
      ])

      setHistory(historyResponse.data)
      setSelectedResult(resultResponse.data)
      setShowHistory(true)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load validation history for this result.'
      )
    } finally {
      setHistoryLoading(false)
    }
  }

  const closeHistory = () => {
    setShowHistory(false)
    setSelectedResult(null)
    setHistory([])
  }

  return (
    <div className="validations-page">
      <div className="page-header">
        <div>
          <h1>Validations & Audit</h1>
          <p>
            Review earthwork results, record validation decisions and maintain audit history.
          </p>
        </div>

        <div className="validations-header-icon">
          <ShieldCheck size={27} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="validation-summary-grid">
        <div className="validation-summary-card">
          <div className="validation-summary-icon total-validation-icon">
            <ClipboardCheck size={21} />
          </div>
          <span>Total Validations</span>
          <h2>{validations.length}</h2>
          <small>Recorded decisions</small>
        </div>

        <div className="validation-summary-card">
          <div className="validation-summary-icon approved-validation-icon">
            <CheckCircle size={21} />
          </div>
          <span>Approved</span>
          <h2>{approvedCount}</h2>
          <small>Approved decisions</small>
        </div>

        <div className="validation-summary-card">
          <div className="validation-summary-icon rejected-validation-icon">
            <AlertCircle size={21} />
          </div>
          <span>Rejected</span>
          <h2>{rejectedCount}</h2>
          <small>Rejected decisions</small>
        </div>

        <div className="validation-summary-card">
          <div className="validation-summary-icon review-validation-icon">
            <Clock size={21} />
          </div>
          <span>Needs Review</span>
          <h2>{reviewCount}</h2>
          <small>Pending further review</small>
        </div>
      </div>

      {/* Validation Records */}
      <div className="validation-records-card">
        <div className="validation-records-heading">
          <div>
            <h2>Validation Records</h2>
            <p>Complete history of recorded validation decisions.</p>
          </div>

          <div className="validation-heading-actions">
            <button
              className="validation-refresh-button"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                className={loading ? 'spin-icon' : ''}
              />
              Refresh
            </button>

            <button
              className="validation-add-button"
              onClick={() => {
                setError('')
                setSuccess('')
                setShowForm(!showForm)
              }}
            >
              {showForm ? <X size={17} /> : <Plus size={17} />}
              {showForm ? 'Close Form' : 'Add Validation'}
            </button>
          </div>
        </div>

        {success && (
          <div className="validation-success">
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        {error && (
          <div className="validation-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Add Validation Form */}
        {showForm && (
          <form
            className="validation-form"
            onSubmit={handleSubmit}
          >
            <div className="validation-form-heading">
              <FileText size={19} />
              <h3>Record New Validation</h3>
            </div>

            <div className="validation-form-grid">
              <div className="validation-form-group">
                <label htmlFor="validation-result">Earthwork Result</label>
                <select
                  id="validation-result"
                  name="resultId"
                  value={formData.resultId}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select an earthwork result</option>
                  {results.map((result) => (
                    <option key={result.resultId} value={result.resultId}>
                      {result.resultId} - {result.workId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="validation-form-group">
                <label htmlFor="validation-status">Validation Decision</label>
                <select
                  id="validation-status"
                  name="validationStatus"
                  value={formData.validationStatus}
                  onChange={handleFormChange}
                  required
                >
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="NEEDS_REVIEW">Needs Review</option>
                </select>
              </div>

              <div className="validation-form-group">
                <label htmlFor="validated-by">Reviewer Name</label>
                <input
                  id="validated-by"
                  type="text"
                  name="validatedBy"
                  value={formData.validatedBy}
                  onChange={handleFormChange}
                  placeholder="Enter reviewer name"
                  maxLength={100}
                  required
                />
              </div>

              <div className="validation-form-group validation-remarks-group">
                <label htmlFor="validation-remarks">Remarks</label>
                <textarea
                  id="validation-remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleFormChange}
                  placeholder="Enter validation remarks..."
                  rows={3}
                />
              </div>
            </div>

            <div className="validation-form-actions">
              <button
                type="button"
                className="validation-cancel-button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="validation-submit-button"
                disabled={submitting || results.length === 0}
              >
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="spin-icon" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={17} />
                    Submit Validation
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Search and Filter */}
        <div className="validation-filters">
          <div className="validation-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search Result ID, reviewer or remarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="validation-message">
            <RefreshCw size={22} className="spin-icon" />
            <p>Loading validation records...</p>
          </div>
        ) : filteredValidations.length === 0 ? (
          <div className="validation-message">
            <ClipboardCheck size={30} />
            <h3>No validation records found</h3>
            <p>
              {validations.length === 0
                ? 'No validation decisions have been recorded yet.'
                : 'Try changing your search or status filter.'}
            </p>
          </div>
        ) : (
          <div className="validation-table-wrapper">
            <table className="validation-table">
              <thead>
                <tr>
                  <th>Validation ID</th>
                  <th>Result ID</th>
                  <th>Decision</th>
                  <th>Reviewer</th>
                  <th>Remarks</th>
                  <th>Validated At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredValidations.map((item) => (
                  <tr key={item.validationId}>
                    <td>#{item.validationId}</td>

                    <td className="validation-result-id">
                      {item.resultId}
                    </td>

                    <td>
                      <span className={`validation-status-badge ${getStatusClass(item.validationStatus)}`}>
                        {getStatusIcon(item.validationStatus)}
                        {item.validationStatus}
                      </span>
                    </td>

                    <td>{item.validatedBy || 'N/A'}</td>

                    <td className="validation-remarks-cell">
                      {item.remarks || '—'}
                    </td>

                    <td>{formatDate(item.validatedAt)}</td>

                    <td>
                      <button
                        className="validation-view-button"
                        onClick={() => openHistory(item.resultId)}
                        title="View validation history"
                      >
                        <Eye size={16} />
                        History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="validation-table-footer">
            Showing {filteredValidations.length} of {validations.length} records
          </div>
        )}
      </div>

      {/* Validation History Modal */}
      {showHistory && (
        <div
          className="validation-modal-overlay"
          onClick={closeHistory}
        >
          <div
            className="validation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="validation-modal-header">
              <div>
                <h2>Validation History</h2>
                <p>{selectedResult?.resultId}</p>
              </div>

              <button
                className="validation-modal-close"
                onClick={closeHistory}
              >
                <X size={21} />
              </button>
            </div>

            <div className="validation-modal-body">
              {selectedResult && (
                <div className="validation-result-info">
                  <div>
                    <span>Worksite ID</span>
                    <strong>{selectedResult.workId}</strong>
                  </div>
                  <div>
                    <span>Net Cut Volume</span>
                    <strong>
                      {selectedResult.netCutVolumeM3 == null
                        ? 'N/A'
                        : `${Number(selectedResult.netCutVolumeM3).toFixed(3)} m³`}
                    </strong>
                  </div>
                  <div>
                    <span>Calculation Status</span>
                    <strong>{selectedResult.dataStatus || 'N/A'}</strong>
                  </div>
                </div>
              )}

              <div className="validation-history-heading">
                <History size={18} />
                <h3>Audit Trail</h3>
                <span>{history.length} records</span>
              </div>

              {historyLoading ? (
                <div className="validation-message">
                  <RefreshCw size={21} className="spin-icon" />
                  <p>Loading validation history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="validation-message">
                  <p>No validation history available.</p>
                </div>
              ) : (
                <div className="validation-history-list">
                  {history.map((item) => (
                    <div
                      className="validation-history-item"
                      key={item.validationId}
                    >
                      <div className="validation-history-marker">
                        {getStatusIcon(item.validationStatus)}
                      </div>

                      <div className="validation-history-content">
                        <div className="validation-history-top">
                          <span className={`validation-status-badge ${getStatusClass(item.validationStatus)}`}>
                            {item.validationStatus}
                          </span>
                          <small>{formatDate(item.validatedAt)}</small>
                        </div>

                        <strong>{item.validatedBy || 'Unknown reviewer'}</strong>

                        <p>{item.remarks || 'No remarks provided.'}</p>

                        <small>Validation ID: #{item.validationId}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Validations
