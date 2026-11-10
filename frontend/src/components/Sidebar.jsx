import {
  LayoutDashboard,
  Map,
  Camera,
  Crosshair,
  ClipboardList,
  BookOpen,
  Mountain,
  BarChart3,
  AlertTriangle,
  ShieldCheck,
  LandPlot,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
const menuItems = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Worksites', path: '/worksites', icon: Map },
  { label: 'Surveys & Images', path: '/surveys', icon: Camera },
  { label: 'Ground Control Points', path: '/gcps', icon: Crosshair },
  { label: 'Earthwork Estimates', path: '/estimates', icon: ClipboardList },
  { label: 'Measurement Book', path: '/measurements', icon: BookOpen },
  { label: 'Terrain Analysis', path: '/terrain', icon: Mountain },
  { label: 'Earthwork Results', path: '/results', icon: BarChart3 },
  { label: 'Deviation Warnings', path: '/warnings', icon: AlertTriangle },
  { label: 'Validations & Audit', path: '/validations', icon: ShieldCheck },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <LandPlot size={24} />
        </div>
        <div>
          <h2>LandProfile</h2>
          <span>Asset Monitoring System</span>
        </div>
      </div>

      <div className="menu-heading">MAIN MENU</div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              to={item.path}
              key={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `menu-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="status-dot" />
        <span>System Online</span>
      </div>
    </aside>
  )
}

export default Sidebar
