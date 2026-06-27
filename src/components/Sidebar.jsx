import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, Book, Terminal, Settings, Zap, HardDrive, Package, Cpu, Sun, Moon } from 'lucide-react';
import { getSortedSlugs, formatTitle } from '../utils/docsRegistry';
import { useTheme } from '../context/ThemeContext';

// Mapping icons for specific pages
const iconMap = {
  'index': <Book size={18} />,
  'getting-started': <Zap size={18} />,
  'execution': <Terminal size={18} />,
  'configuration': <Settings size={18} />,
  'filesystem': <HardDrive size={18} />,
  'project-management': <Package size={18} />,
  'dependency-management': <Package size={18} />,
  'ai-features': <Cpu size={18} />
};

const Sidebar = ({ docs, isOpen, onClose }) => {
  const slugs = getSortedSlugs(Object.keys(docs));
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo-area" onClick={onClose}>
            <div className="logo-icon">PKT</div>
          </Link>
          <div className="sidebar-header-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <h4 className="nav-group-title">Documentation</h4>
            <ul className="nav-list">
              {slugs.map((slug) => (
                <li key={slug}>
                  <NavLink 
                    to={`/docs/${slug}`} 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => onClose()}
                  >
                    <span className="nav-icon">{iconMap[slug] || <Book size={18} />}</span>
                    <span className="nav-text">{formatTitle(slug)}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
