const navItems: string[] = ["Home", "About", "Packges", "Services", "Gallery", "Blog", "Contact"];

const HeaderNavbar: React.FC = () => {
    return (
        <div className="header_navbar">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <nav className="navbar navbar-expand-lg">
            <a className="navbar-brand" href="/">
              <img src="/assets/images/logo.svg" alt="Logo" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="toggler-icon"></span>
              <span className="toggler-icon"></span>
              <span className="toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
              <ul id="nav" className="navbar-nav ms-auto">
                {navItems.map((item) => (
                  <li className={`nav-item${item === "Home" ? " active" : ""}`} key={item}>
                    <a className="page-scroll" href={`#${item.toLowerCase()}`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
    );

  
};

export default HeaderNavbar;





