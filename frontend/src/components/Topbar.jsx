import { Bell, Search, UserCircle } from 'lucide-react'

function Topbar() {
  return (
    <header className="topbar">
      <div>
        <h2>Overview</h2>
        <p>Land Profiling & Asset Creation Monitoring</p>
      </div>

      <div className="topbar-actions">
        <div className="search-box">
          <Search size={18} />
          <input placeholder="Search worksites..." />
        </div>

        <button className="icon-button" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="profile">
          <UserCircle size={30} />
          <div>
            <strong>Administrator</strong>
            <span>Project Manager</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
