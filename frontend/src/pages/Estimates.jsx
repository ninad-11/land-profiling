
import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  RefreshCw,
  Eye,
  Plus,
  Pencil,
  Trash2,
  X,
  ClipboardList,
  Ruler,
} from 'lucide-react'

import api from '../services/api'

const emptyForm = {
  estimateId: '',
  workId: '',
  estimateDate: '',
  estimatedQuantityM3: '',
  quantityBasis: 'Fictional estimate quantity',
  dataStatus: 'DEMO',
}

function Estimates() {
  const [estimates, setEstimates] = useState([])
  const [worksites, setWorksites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [workFilter, setWorkFilter] = useState('ALL')

  const [showForm, setShowForm] = useState(false)
  const [editingEstimate, setEditingEstimate] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [selectedEstimate, setSelectedEstimate] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError('')

    try {
      const [estimateResponse, worksiteResponse] = await Promise.all([
        api.get('/estimates'),
        api.get('/worksites'),
      ])

      setEstimates(estimateResponse.data)
      setWorksites(worksiteResponse.data)
    } catch (err) {
      console.error(err)
      setError('Unable to load estimates. Check the backend connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredEstimates = useMemo(() => {
    const query = search.toLowerCase()

    return estimates.filter((estimate) => {
      const matchesSearch =
        estimate.estimateId?.toLowerCase().includes(query) ||
        estimate.workId?.toLowerCase().includes(query) ||
        estimate.quantityBasis?.toLowerCase().includes(query)

      const matchesWork =
        workFilter === 'ALL' || estimate.workId === workFilter

      return matchesSearch && matchesWork
    })
  }, [estimates, search, workFilter])

  const totalQuantity = estimates.reduce(
    (total, estimate) =>
      total + Number(estimate.estimatedQuantityM3 || 0),
    0
  )

  const openAddForm = () => {
    setEditingEstimate(false)
    setForm({
      ...emptyForm,
      workId: worksites[0]?.workId || '',
      estimateDate: new Date().toISOString().slice(0, 10),
    })
    setError('')
    setShowForm(true)
  }

  const openEditForm = (estimate) => {
    setEditingEstimate(true)
    setForm({
      estimateId: estimate.estimateId,
      workId: estimate.workId,
      estimateDate: estimate.estimateDate,
      estimatedQuantityM3: estimate.estimatedQuantityM3,
      quantityBasis: estimate.quantityBasis || '',
      dataStatus: estimate.dataStatus || 'DEMO',
    })
    setError('')
    setShowForm(true)
  }

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const saveEstimate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      estimatedQuantityM3: Number(form.estimatedQuantityM3),
    }

    try {
      if (editingEstimate) {
        await api.put(`/estimates/${form.estimateId}`, payload)
      } else {
        await api.post('/estimates', payload)
      }

      setShowForm(false)
      await fetchData()
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
        'Unable to save estimate. Check the entered details.'
      )
    } finally {
      setSaving(false)
    }
  }

  const deleteEstimate = async (estimate) => {
    const confirmed = window.confirm(
      `Delete estimate ${estimate.estimateId}? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      await api.delete(`/estimates/${estimate.estimateId}`)
      setSelectedEstimate(null)
      await fetchData()
    } catch (err) {
      console.error(err)
      setError('Unable to delete this estimate.')
    }
  }

  const viewEstimate = async (estimate) => {
    try {
      const response = await api.get(`/estimates/${estimate.estimateId}`)
      setSelectedEstimate(response.data)
    } catch (err) {
      console.error(err)
      setError('Unable to load estimate details.')
    }
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h1>Earthwork Estimates</h1>
          <p>Manage estimated quantities for registered earthwork sites.</p>
        </div>

        <span className="demo-badge">DEMO DATA</span>
      </div>

      <div className="estimate-summary-grid">
        <div className="survey-stat-card">
          <div className="survey-stat-icon total">
            <ClipboardList size={21} />
          </div>
          <div>
            <span>Total Estimates</span>
            <h2>{loading ? '...' : estimates.length}</h2>
          </div>
        </div>

        <div className="survey-stat-card">
          <div className="survey-stat-icon pre">
            <Ruler size={21} />
          </div>
          <div>
            <span>Total Estimated Quantity</span>
            <h2>
              {loading
                ? '...'
                : `${totalQuantity.toFixed(3)} m³`}
            </h2>
          </div>
        </div>

        <div className="survey-stat-card">
          <div className="survey-stat-icon post">
            <ClipboardList size={21} />
          </div>
          <div>
            <span>Worksites Covered</span>
            <h2>
              {loading
                ? '...'
                : new Set(estimates.map((e) => e.workId)).size}
            </h2>
          </div>
        </div>
      </div>

      <div className="gcp-toolbar">
        <div className="worksite-search">
          <Search size={18} />
          <input
            placeholder="Search estimate ID or worksite..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={workFilter}
          onChange={(e) => setWorkFilter(e.target.value)}
        >
          <option value="ALL">All Worksites</option>
          {worksites.map((worksite) => (
            <option key={worksite.workId} value={worksite.workId}>
              {worksite.workId}
            </option>
          ))}
        </select>

        <button className="refresh-button" onClick={fetchData}>
          <RefreshCw size={16} />
          Refresh
        </button>

        <button className="gcp-add-button" onClick={openAddForm}>
          <Plus size={17} />
          Add Estimate
        </button>
      </div>

      <div className="section-heading">
        <div>
          <h2>Estimate Records</h2>
          <p>Estimated earthwork quantities retrieved from the backend.</p>
        </div>

        <span>{filteredEstimates.length} Estimates</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="worksite-table-container">
        <table className="worksite-table">
          <thead>
            <tr>
              <th>Estimate ID</th>
              <th>Worksite ID</th>
              <th>Estimate Date</th>
              <th>Estimated Quantity (m³)</th>
              <th>Quantity Basis</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  Loading estimates...
                </td>
              </tr>
            ) : filteredEstimates.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No matching estimates found.
                </td>
              </tr>
            ) : (
              filteredEstimates.map((estimate) => (
                <tr key={estimate.estimateId}>
                  <td className="work-id">{estimate.estimateId}</td>
                  <td>{estimate.workId}</td>
                  <td>{estimate.estimateDate}</td>
                  <td>
                    {Number(estimate.estimatedQuantityM3).toFixed(3)}
                  </td>
                  <td>{estimate.quantityBasis}</td>
                  <td>
                    <span className="table-status">
                      {estimate.dataStatus}
                    </span>
                  </td>
                  <td>
                    <div className="gcp-actions">
                      <button
                        className="view-button"
                        title="View estimate"
                        onClick={() => viewEstimate(estimate)}
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        className="gcp-edit-button"
                        title="Edit estimate"
                        onClick={() => openEditForm(estimate)}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        className="gcp-delete-button"
                        title="Delete estimate"
                        onClick={() => deleteEstimate(estimate)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="worksite-modal gcp-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingEstimate ? 'Edit Estimate' : 'Add Earthwork Estimate'}
                </h2>
                <p>Enter the estimated earthwork quantity.</p>
              </div>

              <button onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveEstimate}>
              <div className="gcp-form-grid">
                <label>
                  Estimate ID
                  <input
                    name="estimateId"
                    value={form.estimateId}
                    onChange={updateField}
                    placeholder="EST-013"
                    disabled={editingEstimate}
                    required
                  />
                </label>

                <label>
                  Worksite
                  <select
                    name="workId"
                    value={form.workId}
                    onChange={updateField}
                    required
                  >
                    <option value="">Select worksite</option>
                    {worksites.map((worksite) => (
                      <option key={worksite.workId} value={worksite.workId}>
                        {worksite.workId}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Estimate Date
                  <input
                    type="date"
                    name="estimateDate"
                    value={form.estimateDate}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Estimated Quantity (m³)
                  <input
                    type="number"
                    name="estimatedQuantityM3"
                    value={form.estimatedQuantityM3}
                    onChange={updateField}
                    min="0"
                    step="0.001"
                    required
                  />
                </label>

                <label>
                  Data Status
                  <input
                    name="dataStatus"
                    value={form.dataStatus}
                    onChange={updateField}
                    required
                  />
                </label>

                <label className="gcp-form-full">
                  Quantity Basis
                  <input
                    name="quantityBasis"
                    value={form.quantityBasis}
                    onChange={updateField}
                    required
                  />
                </label>
              </div>

              <p className="gcp-form-note">
                Demonstration estimates are not official sanctioned quantities.
              </p>

              <div className="gcp-form-actions">
                <button
                  type="button"
                  className="gcp-cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="gcp-add-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingEstimate
                      ? 'Update Estimate'
                      : 'Save Estimate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedEstimate && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedEstimate(null)}
        >
          <div
            className="worksite-modal gcp-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Estimate Details</h2>
                <p>{selectedEstimate.estimateId}</p>
              </div>

              <button onClick={() => setSelectedEstimate(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="details-grid">
              <div>
                <span>Worksite ID</span>
                <strong>{selectedEstimate.workId}</strong>
              </div>

              <div>
                <span>Estimate Date</span>
                <strong>{selectedEstimate.estimateDate}</strong>
              </div>

              <div>
                <span>Estimated Quantity</span>
                <strong>
                  {Number(selectedEstimate.estimatedQuantityM3).toFixed(3)} m³
                </strong>
              </div>

              <div>
                <span>Data Status</span>
                <strong>{selectedEstimate.dataStatus}</strong>
              </div>

              <div className="detail-full">
                <span>Quantity Basis</span>
                <strong>{selectedEstimate.quantityBasis}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Estimates
