
import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  RefreshCw,
  Eye,
  Plus,
  Pencil,
  Trash2,
  X,
  BookOpen,
  Ruler,
} from 'lucide-react'

import api from '../services/api'

const emptyForm = {
  measurementId: '',
  workId: '',
  measurementDate: '',
  recordedQuantityM3: '',
  quantityBasis:
    'Fictional sample quantity; not an official Measurement Book',
  dataStatus: 'DEMO',
}

function Measurements() {
  const [measurements, setMeasurements] = useState([])
  const [worksites, setWorksites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [workFilter, setWorkFilter] = useState('ALL')

  const [showForm, setShowForm] = useState(false)
  const [editingMeasurement, setEditingMeasurement] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [selectedMeasurement, setSelectedMeasurement] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError('')

    try {
      const [measurementResponse, worksiteResponse] = await Promise.all([
        api.get('/measurements'),
        api.get('/worksites'),
      ])

      setMeasurements(measurementResponse.data)
      setWorksites(worksiteResponse.data)
    } catch (err) {
      console.error(err)
      setError('Unable to load measurement records. Check the backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredMeasurements = useMemo(() => {
    const query = search.toLowerCase()

    return measurements.filter((measurement) => {
      const matchesSearch =
        measurement.measurementId?.toLowerCase().includes(query) ||
        measurement.workId?.toLowerCase().includes(query) ||
        measurement.quantityBasis?.toLowerCase().includes(query)

      const matchesWork =
        workFilter === 'ALL' || measurement.workId === workFilter

      return matchesSearch && matchesWork
    })
  }, [measurements, search, workFilter])

  const totalQuantity = measurements.reduce(
    (total, measurement) =>
      total + Number(measurement.recordedQuantityM3 || 0),
    0
  )

  const openAddForm = () => {
    setEditingMeasurement(false)
    setForm({
      ...emptyForm,
      workId: worksites[0]?.workId || '',
      measurementDate: new Date().toISOString().slice(0, 10),
    })
    setError('')
    setShowForm(true)
  }

  const openEditForm = (measurement) => {
    setEditingMeasurement(true)
    setForm({
      measurementId: measurement.measurementId,
      workId: measurement.workId,
      measurementDate: measurement.measurementDate,
      recordedQuantityM3: measurement.recordedQuantityM3,
      quantityBasis: measurement.quantityBasis || '',
      dataStatus: measurement.dataStatus || 'DEMO',
    })
    setError('')
    setShowForm(true)
  }

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const saveMeasurement = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      recordedQuantityM3: Number(form.recordedQuantityM3),
    }

    try {
      if (editingMeasurement) {
        await api.put(
          `/measurements/${form.measurementId}`,
          payload
        )
      } else {
        await api.post('/measurements', payload)
      }

      setShowForm(false)
      await fetchData()
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
        'Unable to save measurement. Check the entered details.'
      )
    } finally {
      setSaving(false)
    }
  }

  const deleteMeasurement = async (measurement) => {
    const confirmed = window.confirm(
      `Delete measurement ${measurement.measurementId}? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      await api.delete(`/measurements/${measurement.measurementId}`)
      setSelectedMeasurement(null)
      await fetchData()
    } catch (err) {
      console.error(err)
      setError('Unable to delete this measurement.')
    }
  }

  const viewMeasurement = async (measurement) => {
    try {
      const response = await api.get(
        `/measurements/${measurement.measurementId}`
      )
      setSelectedMeasurement(response.data)
    } catch (err) {
      console.error(err)
      setError('Unable to load measurement details.')
    }
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h1>Measurement Book</h1>
          <p>Manage recorded earthwork quantities for registered worksites.</p>
        </div>

        <span className="demo-badge">DEMO DATA</span>
      </div>

      <div className="estimate-summary-grid">
        <div className="survey-stat-card">
          <div className="survey-stat-icon total">
            <BookOpen size={21} />
          </div>
          <div>
            <span>Total Measurement Records</span>
            <h2>{loading ? '...' : measurements.length}</h2>
          </div>
        </div>

        <div className="survey-stat-card">
          <div className="survey-stat-icon pre">
            <Ruler size={21} />
          </div>
          <div>
            <span>Total Recorded Quantity</span>
            <h2>
              {loading ? '...' : `${totalQuantity.toFixed(3)} m³`}
            </h2>
          </div>
        </div>

        <div className="survey-stat-card">
          <div className="survey-stat-icon post">
            <BookOpen size={21} />
          </div>
          <div>
            <span>Worksites Covered</span>
            <h2>
              {loading
                ? '...'
                : new Set(measurements.map((m) => m.workId)).size}
            </h2>
          </div>
        </div>
      </div>

      <div className="gcp-toolbar">
        <div className="worksite-search">
          <Search size={18} />
          <input
            placeholder="Search measurement ID or worksite..."
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
          Add Record
        </button>
      </div>

      <div className="section-heading">
        <div>
          <h2>Measurement Records</h2>
          <p>Recorded quantities retrieved from the backend.</p>
        </div>

        <span>{filteredMeasurements.length} Records</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="worksite-table-container">
        <table className="worksite-table">
          <thead>
            <tr>
              <th>Measurement ID</th>
              <th>Worksite ID</th>
              <th>Measurement Date</th>
              <th>Recorded Quantity (m³)</th>
              <th>Quantity Basis</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  Loading measurement records...
                </td>
              </tr>
            ) : filteredMeasurements.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No matching measurement records found.
                </td>
              </tr>
            ) : (
              filteredMeasurements.map((measurement) => (
                <tr key={measurement.measurementId}>
                  <td className="work-id">{measurement.measurementId}</td>
                  <td>{measurement.workId}</td>
                  <td>{measurement.measurementDate}</td>
                  <td>
                    {Number(measurement.recordedQuantityM3).toFixed(3)}
                  </td>
                  <td>{measurement.quantityBasis}</td>
                  <td>
                    <span className="table-status">
                      {measurement.dataStatus}
                    </span>
                  </td>
                  <td>
                    <div className="gcp-actions">
                      <button
                        className="view-button"
                        title="View measurement"
                        onClick={() => viewMeasurement(measurement)}
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        className="gcp-edit-button"
                        title="Edit measurement"
                        onClick={() => openEditForm(measurement)}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        className="gcp-delete-button"
                        title="Delete measurement"
                        onClick={() => deleteMeasurement(measurement)}
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
                  {editingMeasurement
                    ? 'Edit Measurement'
                    : 'Add Measurement Record'}
                </h2>
                <p>Enter the recorded earthwork quantity.</p>
              </div>

              <button onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveMeasurement}>
              <div className="gcp-form-grid">
                <label>
                  Measurement ID
                  <input
                    name="measurementId"
                    value={form.measurementId}
                    onChange={updateField}
                    placeholder="MB-013"
                    disabled={editingMeasurement}
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
                  Measurement Date
                  <input
                    type="date"
                    name="measurementDate"
                    value={form.measurementDate}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Recorded Quantity (m³)
                  <input
                    type="number"
                    name="recordedQuantityM3"
                    value={form.recordedQuantityM3}
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
                These demonstration records are not official Measurement Book entries.
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
                    : editingMeasurement
                      ? 'Update Record'
                      : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMeasurement && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedMeasurement(null)}
        >
          <div
            className="worksite-modal gcp-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Measurement Details</h2>
                <p>{selectedMeasurement.measurementId}</p>
              </div>

              <button onClick={() => setSelectedMeasurement(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="details-grid">
              <div>
                <span>Worksite ID</span>
                <strong>{selectedMeasurement.workId}</strong>
              </div>

              <div>
                <span>Measurement Date</span>
                <strong>{selectedMeasurement.measurementDate}</strong>
              </div>

              <div>
                <span>Recorded Quantity</span>
                <strong>
                  {Number(selectedMeasurement.recordedQuantityM3).toFixed(3)} m³
                </strong>
              </div>

              <div>
                <span>Data Status</span>
                <strong>{selectedMeasurement.dataStatus}</strong>
              </div>

              <div className="detail-full">
                <span>Quantity Basis</span>
                <strong>{selectedMeasurement.quantityBasis}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Measurements
