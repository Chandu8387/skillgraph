import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">

        <NavLink to="/" className="brand">
          <span className="brand-mark">S</span>
          <span>SkillGraph</span>
        </NavLink>

        <nav className="nav-links">

            <NavLink to="/graph">
                    Graph
                </NavLink>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Dashboard
          </NavLink>


          <NavLink
            to="/developers"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Developers
          </NavLink>

          <NavLink
            to="/skills"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Skills
          </NavLink>

          <NavLink
            to="/learning-path"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Learning Path
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Projects
          </NavLink>

        </nav>

      </div>
    </header>
  );
}

export default Navbar;