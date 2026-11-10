
import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  RefreshCw,
  Eye,
  Plus,
  Pencil,
  Trash2,
  X,
  Crosshair,
} from 'lucide-react'

import api from '../services/api'

const emptyForm = {
  gcpId: '',
  workId: '',
  referenceType: 'Fictional local reference point',
  xmLocal: '',
  ymLocal: '',
  zm: '',
  dataStatus: 'DEMO',
}

function Gcps() {
  const [gcps, setGcps] = useState([])
  const [worksites, setWorksites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [workFilter, setWorkFilter] = useState('ALL')

  const [showForm, setShowForm] = useState(false)
  const [editingGcp, setEditingGcp] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const [selectedGcp, setSelectedGcp] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError('')

    try {
      const [gcpResponse, worksiteResponse] = await Promise.all([
        api.get('/gcps'),
        api.get('/worksites'),
      ])

      setGcps(gcpResponse.data)
      setWorksites(worksiteResponse.data)
    } catch (err) {
      console.error(err)
      setError('Unable to load GCP records. Check the backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredGcps = useMemo(() => {
    const query = search.toLowerCase()

    return gcps.filter((gcp) => {
      const matchesSearch =
        gcp.gcpId?.toLowerCase().includes(query) ||
        gcp.workId?.toLowerCase().includes(query) ||
        gcp.referenceType?.toLowerCase().includes(query)

      const matchesWork =
        workFilter === 'ALL' || gcp.workId === workFilter

      return matchesSearch && matchesWork
    })
  }, [gcps, search, workFilter])

  const openAddForm = () => {
    setEditingGcp(false)
    setForm({
      ...emptyForm,
      workId: worksites[0]?.workId || '',
    })
    setError('')
    setShowForm(true)
  }

  const openEditForm = (gcp) => {
    setEditingGcp(true)
    setForm({
      gcpId: gcp.gcpId,
      workId: gcp.workId,
      referenceType: gcp.referenceType || '',
      xmLocal: gcp.xmLocal ?? '',
      ymLocal: gcp.ymLocal ?? '',
      zm: gcp.zm ?? '',
      dataStatus: gcp.dataStatus || 'DEMO',
    })
    setError('')
    setShowForm(true)
  }

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const saveGcp = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      xmLocal: Number(form.xmLocal),
      ymLocal: Number(form.ymLocal),
      zm: Number(form.zm),
    }

    try {
      if (editingGcp) {
        await api.put(`/gcps/${form.gcpId}`, payload)
      } else {
        await api.post('/gcps', payload)
      }

      setShowForm(false)
      await fetchData()
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
        'Unable to save GCP. Check the entered details.'
      )
    } finally {
      setSaving(false)
    }
  }

  const deleteGcp = async (gcp) => {
    const confirmed = window.confirm(
      `Delete GCP ${gcp.gcpId}? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      await api.delete(`/gcps/${gcp.gcpId}`)
      setSelectedGcp(null)
      await fetchData()
    } catch (err) {
      console.error(err)
      setError('Unable to delete this GCP.')
    }
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h1>Ground Control Points</h1>
          <p>Manage site reference points and local elevation coordinates.</p>
        </div>

        <span className="demo-badge">DEMO DATA</span>
      </div>

      <div className="gcp-summary-grid">
        <div className="survey-stat-card">
          <div className="survey-stat-icon total">
            <Crosshair size={21} />
          </div>
          <div>
            <span>Total GCPs</span>
            <h2>{loading ? '...' : gcps.length}</h2>
          </div>
        </div>

        <div className="survey-stat-card">
          <div className="survey-stat-icon pre">
            <Crosshair size={21} />
          </div>
          <div>
            <span>Worksites Covered</span>
            <h2>{loading ? '...' : new Set(gcps.map((g) => g.workId)).size}</h2>
          </div>
        </div>

        <div className="survey-stat-card">
          <div className="survey-stat-icon post">
            <MapPinIcon />
          </div>
          <div>
            <span>Reference Type</span>
            <h2 className="gcp-summary-label">Local Grid</h2>
          </div>
        </div>
      </div>

      <div className="gcp-toolbar">
        <div className="worksite-search">
          <Search size={18} />
          <input
            placeholder="Search GCP ID or worksite..."
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
          Add GCP
        </button>
      </div>

      <div className="section-heading">
        <div>
          <h2>GCP Coordinate Records</h2>
          <p>Reference coordinates retrieved from the backend.</p>
        </div>
        <span>{filteredGcps.length} GCPs</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="worksite-table-container">
        <table className="worksite-table">
          <thead>
            <tr>
              <th>GCP ID</th>
              <th>Worksite ID</th>
              <th>X Local (m)</th>
              <th>Y Local (m)</th>
              <th>Elevation Z (m)</th>
              <th>Reference Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  Loading GCP records...
                </td>
              </tr>
            ) : filteredGcps.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  No matching GCP records found.
                </td>
              </tr>
            ) : (
              filteredGcps.map((gcp) => (
                <tr key={gcp.gcpId}>
                  <td className="work-id">{gcp.gcpId}</td>
                  <td>{gcp.workId}</td>
                  <td>{Number(gcp.xmLocal).toFixed(3)}</td>
                  <td>{Number(gcp.ymLocal).toFixed(3)}</td>
                  <td>{Number(gcp.zm).toFixed(4)}</td>
                  <td>{gcp.referenceType}</td>
                  <td>
                    <span className="table-status">{gcp.dataStatus}</span>
                  </td>
                  <td>
                    <div className="gcp-actions">
                      <button
                        className="view-button"
                        title="View details"
                        onClick={() => setSelectedGcp(gcp)}
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        className="gcp-edit-button"
                        title="Edit GCP"
                        onClick={() => openEditForm(gcp)}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        className="gcp-delete-button"
                        title="Delete GCP"
                        onClick={() => deleteGcp(gcp)}
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
                <h2>{editingGcp ? 'Edit GCP' : 'Add Ground Control Point'}</h2>
                <p>Enter reference point information.</p>
              </div>
              <button onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveGcp}>
              <div className="gcp-form-grid">
                <label>
                  GCP ID
                  <input
                    name="gcpId"
                    value={form.gcpId}
                    onChange={updateField}
                    placeholder="GCP-001-06"
                    disabled={editingGcp}
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
                  X Local (m)
                  <input
                    type="number"
                    step="0.001"
                    name="xmLocal"
                    value={form.xmLocal}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Y Local (m)
                  <input
                    type="number"
                    step="0.001"
                    name="ymLocal"
                    value={form.ymLocal}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Elevation Z (m)
                  <input
                    type="number"
                    step="0.0001"
                    name="zm"
                    value={form.zm}
                    onChange={updateField}
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
                  Reference Type
                  <input
                    name="referenceType"
                    value={form.referenceType}
                    onChange={updateField}
                    required
                  />
                </label>
              </div>

              <p className="gcp-form-note">
                Demo coordinates must not be treated as surveyed control points.
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
                  {saving ? 'Saving...' : editingGcp ? 'Update GCP' : 'Save GCP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedGcp && (
        <div className="modal-overlay" onClick={() => setSelectedGcp(null)}>
          <div
            className="worksite-modal gcp-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>GCP Details</h2>
                <p>{selectedGcp.gcpId}</p>
              </div>
              <button onClick={() => setSelectedGcp(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="details-grid">
              <div>
                <span>Worksite ID</span>
                <strong>{selectedGcp.workId}</strong>
              </div>
              <div>
                <span>Reference Type</span>
                <strong>{selectedGcp.referenceType}</strong>
              </div>
              <div>
                <span>X Local</span>
                <strong>{Number(selectedGcp.xmLocal).toFixed(3)} m</strong>
              </div>
              <div>
                <span>Y Local</span>
                <strong>{Number(selectedGcp.ymLocal).toFixed(3)} m</strong>
              </div>
              <div>
                <span>Elevation Z</span>
                <strong>{Number(selectedGcp.zm).toFixed(4)} m</strong>
              </div>
              <div>
                <span>Data Status</span>
                <strong>{selectedGcp.dataStatus}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MapPinIcon() {
  return <Crosshair size={21} />
}

export default Gcps
