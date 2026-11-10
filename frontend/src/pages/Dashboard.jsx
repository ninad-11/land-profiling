
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Map,
  Camera,
  Mountain,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

import api from '../services/api'
import StatCard from '../components/StatCard'

function Dashboard() {
  const [worksites, setWorksites] = useState([])
  const [surveyCount, setSurveyCount] = useState(null)
  const [analysisCount, setAnalysisCount] = useState(null)
  const [highWarningCount, setHighWarningCount] = useState(null)

  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setErrors([])

    const endpoints = [
      { name: 'Worksites', request: api.get('/worksites') },
      { name: 'Surveys', request: api.get('/surveys') },
      { name: 'Earthwork results', request: api.get('/earthwork-results') },
      { name: 'Warnings', request: api.get('/warnings') }
    ]

    const responses = await Promise.allSettled(
      endpoints.map((item) => item.request)
    )

    const failedRequests = []

    responses.forEach((response, index) => {
      if (response.status === 'rejected') {
        failedRequests.push(endpoints[index].name)
        return
      }

      const data = response.value.data

      switch (endpoints[index].name) {
        case 'Worksites':
          setWorksites(Array.isArray(data) ? data : [])
          break

        case 'Surveys':
          setSurveyCount(Array.isArray(data) ? data.length : 0)
          break

        case 'Earthwork results':
          setAnalysisCount(Array.isArray(data) ? data.length : 0)
          break

        case 'Warnings': {
          const highCount = Array.isArray(data)
            ? data.filter(
                (item) =>
                  (item.overallWarning || '').toUpperCase() === 'HIGH'
              ).length
            : 0

          setHighWarningCount(highCount)
          break
        }

        default:
          break
      }
    })

    setErrors(failedRequests)
    setLoading(false)
  }

  const recentWorksites = worksites.slice(0, 5)

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h1>Project Overview</h1>
          <p>Monitor land development and earthwork activities.</p>
        </div>

        <span className="demo-badge">DEMO DATA</span>
      </div>

      {errors.length > 0 && (
        <div className="dashboard-error">
          <AlertCircle size={18} />
          <span>
            Unable to load: {errors.join(', ')}. Check the backend and refresh.
          </span>
          <button onClick={fetchDashboardData} disabled={loading}>
            Retry
          </button>
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          title="Total Worksites"
          value={loading ? '...' : worksites.length}
          subtitle="Registered worksites"
          icon={Map}
          color="blue"
        />

        <StatCard
          title="Surveys"
          value={loading ? '...' : surveyCount ?? '—'}
          subtitle="PRE / POST survey records"
          icon={Camera}
          color="purple"
        />

        <StatCard
          title="Analysis Records"
          value={loading ? '...' : analysisCount ?? '—'}
          subtitle="Stored earthwork results"
          icon={Mountain}
          color="green"
        />

        <StatCard
          title="High Warnings"
          value={loading ? '...' : highWarningCount ?? '—'}
          subtitle="Overall HIGH severity"
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      <div className="section-heading">
        <div>
          <h2>Registered Worksites</h2>
          <p>Recently registered project locations</p>
        </div>

        <span>{worksites.length} Worksites</span>
      </div>

      <div className="worksite-table-container">
        <table className="worksite-table">
          <thead>
            <tr>
              <th>Worksite ID</th>
              <th>Worksite Name</th>
              <th>Work Type</th>
              <th>Location</th>
              <th>Data Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && worksites.length === 0 ? (
              <tr>
                <td colSpan="6">Loading worksites...</td>
              </tr>
            ) : recentWorksites.length > 0 ? (
              recentWorksites.map((worksite) => (
                <tr key={worksite.workId}>
                  <td className="work-id">{worksite.workId}</td>
                  <td>{worksite.workName}</td>
                  <td>{worksite.workType}</td>
                  <td>
                    {worksite.village}, {worksite.districtName}
                  </td>
                  <td>
                    <span className="table-status">
                      {worksite.dataStatus || 'Demo'}
                    </span>
                  </td>
                  <td>
                    <Link to="/worksites" className="view-button">
                      View <ArrowUpRight size={15} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No worksites found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="dashboard-footer">
        <span>
          Showing {recentWorksites.length} of {worksites.length} registered worksites
        </span>

        <button
          className="dashboard-refresh-button"
          onClick={fetchDashboardData}
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'spin-icon' : ''} />
          Refresh Dashboard
        </button>
      </div>
    </div>
  )
}

export default Dashboard
