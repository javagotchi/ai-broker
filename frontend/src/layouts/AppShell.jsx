import { NavLink } from "react-router-dom";

const navClassName = ({ isActive }) =>
  `nav-link newspaper-nav-link px-0 ${isActive ? "is-active" : ""}`;

export const AppShell = ({ children }) => (
  <div className="app-shell">
    <div className="container py-4 py-lg-5">
      <header className="site-header mb-4 mb-lg-5">
        <div className="site-header-top">
          <p className="header-meta mb-0">AI Broker</p>
          <p className="header-meta mb-0">Local market workspace</p>
        </div>
        <div className="row g-4 align-items-end pt-3">
          <div className="col-lg-8">
            <p className="eyebrow mb-2">Research and simulation</p>
            <h1 className="masthead mb-3">Marktbeobachtung und Watchlist</h1>
            <p className="deck mb-0">
              Eine reduzierte Arbeitsoberflaeche fuer Quotes, Watchlists und
              laufende Notizen.
            </p>
          </div>
          <div className="col-lg-4">
            <div className="section-nav">
              <NavLink to="/dashboard" className={navClassName}>
                Dashboard
              </NavLink>
              <NavLink to="/watchlist" className={navClassName}>
                Watchlist
              </NavLink>
              <NavLink to="/templates" className={navClassName}>
                Templates
              </NavLink>
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  </div>
);
