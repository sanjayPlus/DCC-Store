
function NavBar({name,setName,link}) {

  return (
    <>
      <nav className="navbar">
        <a href="#" className="sidebar-toggler">
          <i data-feather="menu" />
        </a>
        <div className="navbar-content">
          {link==="all-users"&&<>
          <form className="search-form">

            <div className="input-group">
              <div className="input-group-text">
              
                <i data-feather="search" />
              </div>
              <input
                type="text"
                className="form-control"
                id="navbarForm"
                placeholder="Search here..."
                onChange={(e)=>setName(e.target.value)}
                value={name}
              />
            </div>
          </form>
          </>}
          {/* <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="languageDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="flag-icon flag-icon-us mt-1" title="us" />{" "}
                <span className="ms-1 me-1 d-none d-md-inline-block">
                  English
                </span>
              </a>
              <div className="dropdown-menu" aria-labelledby="languageDropdown">
                <a href="javascript:;" className="dropdown-item py-2">
                  <i className="flag-icon flag-icon-us" title="us" id="us" />{" "}
                  <span className="ms-1"> English </span>
                </a>
                <a href="javascript:;" className="dropdown-item py-2">
                  <i className="flag-icon flag-icon-fr" title="fr" id="fr" />{" "}
                  <span className="ms-1"> French </span>
                </a>
                <a href="javascript:;" className="dropdown-item py-2">
                  <i className="flag-icon flag-icon-de" title="de" id="de" />{" "}
                  <span className="ms-1"> German </span>
                </a>
                <a href="javascript:;" className="dropdown-item py-2">
                  <i className="flag-icon flag-icon-pt" title="pt" id="pt" />{" "}
                  <span className="ms-1"> Portuguese </span>
                </a>
                <a href="javascript:;" className="dropdown-item py-2">
                  <i className="flag-icon flag-icon-es" title="es" id="es" />{" "}
                  <span className="ms-1"> Spanish </span>
                </a>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="appsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i data-feather="grid" />
              </a>
              <div className="dropdown-menu p-0" aria-labelledby="appsDropdown">
                <div className="px-3 py-2 d-flex align-items-center justify-content-between border-bottom">
                  <p className="mb-0 fw-bold">Web Apps</p>
                  <a href="javascript:;" className="text-muted">
                    Edit
                  </a>
                </div>
                <div className="row g-0 p-1">
                  <div className="col-3 text-center">
                    <a
                      href="pages/apps/chat.html"
                      className="dropdown-item d-flex flex-column align-items-center justify-content-center wd-70 ht-70"
                    >
                      <i
                        data-feather="message-square"
                        className="icon-lg mb-1"
                      />
                      <p className="tx-12">Chat</p>
                    </a>
                  </div>
                  <div className="col-3 text-center">
                    <a
                      href="pages/apps/calendar.html"
                      className="dropdown-item d-flex flex-column align-items-center justify-content-center wd-70 ht-70"
                    >
                      <i data-feather="calendar" className="icon-lg mb-1" />
                      <p className="tx-12">Calendar</p>
                    </a>
                  </div>
                  <div className="col-3 text-center">
                    <a
                      href="pages/email/inbox.html"
                      className="dropdown-item d-flex flex-column align-items-center justify-content-center wd-70 ht-70"
                    >
                      <i data-feather="mail" className="icon-lg mb-1" />
                      <p className="tx-12">Email</p>
                    </a>
                  </div>
                  <div className="col-3 text-center">
                    <a
                      href="pages/general/profile.html"
                      className="dropdown-item d-flex flex-column align-items-center justify-content-center wd-70 ht-70"
                    >
                      <i data-feather="instagram" className="icon-lg mb-1" />
                      <p className="tx-12">Profile</p>
                    </a>
                  </div>
                </div>
                <div className="px-3 py-2 d-flex align-items-center justify-content-center border-top">
                  <a href="javascript:;">View all</a>
                </div>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="messageDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i data-feather="mail" />
              </a>
              <div
                className="dropdown-menu p-0"
                aria-labelledby="messageDropdown"
              >
                <div className="px-3 py-2 d-flex align-items-center justify-content-between border-bottom">
                  <p>9 New Messages</p>
                  <a href="javascript:;" className="text-muted">
                    Clear all
                  </a>
                </div>
                <div className="p-1">
                  <a
                    href="javascript:;"
                    className="dropdown-item d-flex align-items-center py-2"
                  >
                    <div className="me-3">
                      <img
                        className="wd-30 ht-30 rounded-circle"
                        src="https://via.placeholder.com/30x30"
                        alt="userr"
                      />
                    </div>
                    <div className="d-flex justify-content-between flex-grow-1">
                      <div className="me-4">
                        <p>Leonardo Payne</p>
                        <p className="tx-12 text-muted">Project status</p>
                      </div>
                      <p className="tx-12 text-muted">2 min ago</p>
                    </div>
                  </a>
                  <a
                    href="javascript:;"
                    className="dropdown-item d-flex align-items-center py-2"
                  >
                    <div className="me-3">
                      <img
                        className="wd-30 ht-30 rounded-circle"
                        src="https://via.placeholder.com/30x30"
                        alt="userr"
                      />
                    </div>
                    <div className="d-flex justify-content-between flex-grow-1">
                      <div className="me-4">
                        <p>Carl Henson</p>
                        <p className="tx-12 text-muted">Client meeting</p>
                      </div>
                      <p className="tx-12 text-muted">30 min ago</p>
                    </div>
                  </a>
                  <a
                    href="javascript:;"
                    className="dropdown-item d-flex align-items-center py-2"
                  >
                    <div className="me-3">
                      <img
                        className="wd-30 ht-30 rounded-circle"
                        src="https://via.placeholder.com/30x30"
                        alt="userr"
                      />
                    </div>
                    <div className="d-flex justify-content-between flex-grow-1">
                      <div className="me-4">
                        <p>Jensen Combs</p>
                        <p className="tx-12 text-muted">Project updates</p>
                      </div>
                      <p className="tx-12 text-muted">1 hrs ago</p>
                    </div>
                  </a>
                  <a
                    href="javascript:;"
                    className="dropdown-item d-flex align-items-center py-2"
                  >
                    <div className="me-3">
                      <img
                        className="wd-30 ht-30 rounded-circle"
                        src="https://via.placeholder.com/30x30"
                        alt="userr"
                      />
                    </div>
                    <div className="d-flex justify-content-between flex-grow-1">
                      <div className="me-4">
                        <p>Aslam Josh</p>
                        <p className="tx-12 text-muted">Project deatline</p>
                      </div>
                      <p className="tx-12 text-muted">2 hrs ago</p>
                    </div>
                  </a>
                  <a
                    href="javascript:;"
                    className="dropdown-item d-flex align-items-center py-2"
                  >
                    <div className="me-3">
                      <img
                        className="wd-30 ht-30 rounded-circle"
                        src="https://via.placeholder.com/30x30"
                        alt="userr"
                      />
                    </div>
                    <div className="d-flex justify-content-between flex-grow-1">
                      <div className="me-4">
                        <p>Yaretzi Mayo</p>
                        <p className="tx-12 text-muted">New record</p>
                      </div>
                      <p className="tx-12 text-muted">5 hrs ago</p>
                    </div>
                  </a>
                </div>
                <div className="px-3 py-2 d-flex align-items-center justify-content-center border-top">
                  <a href="javascript:;">View all</a>
                </div>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="notificationDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i data-feather="bell" />
                <div className="indicator">
                  <div className="circle" />
                </div>
              </a>
              <div
                className="dropdown-menu p-0"
                aria-labelledby="notificationDropdown"
              >
                <div className="px-3 py-2 d-flex align-items-center justify-content-between border-bottom">
                  <p>6 New Notifications</p>
                  <a href="javascript:;" className="text-muted">
                    Clear all
                  </a>
                </div>
                <div className="p-1">
                  <a
                    href="javascript:;"
                    className="dropdown-item d-flex align-items-center py-2"
                  >
                    <div className="wd-30 ht-30 d-flex align-items-center justify-content-center bg-primary rounded-circle me-3">
                      <i className="icon-sm text-white" data-feather="gift" />
                    </div>
                    <div className="flex-grow-1 me-2">
                      <p>New Order Recieved</p>
                      <p className="tx-12 text-muted">30 min ago</p>
                    </div>
                  </a>
                  <a
                    href="javascript:;"
                    className="dropdown-item d-flex align-items-center py-2"
                  >
                    <div className="wd-30 ht-30 d-flex align-items-center justify-content-center bg-primary rounded-circle me-3">
                      <i
                        className="icon-sm text-white"
                        data-feather="alert-circle"
                      />
                    </div>
                    <div className="flex-grow-1 me-2">
                      <p>Server Limit Reached!</p>
                      <p className="tx-12 text-muted">1 hrs ago</p>
                    </div>
                  </a>
                  <a
                    href="javascript:;"
                    className="dropdown-item d-flex align-items-center py-2"
                  >
                    <div className="wd-30 ht-30 d-flex align-items-center justify-content-center bg-primary rounded-circle me-3">
                      <img
                        className="wd-30 ht-30 rounded-circle"
                        src="https://via.placeholder.com/30x30"
                        alt="userr"
                      />
                    </div>
                    <div className="flex-grow-1 me-2">
                      <p>New customer registered</p>
                      <p className="tx-12 text-muted">2 sec ago</p>
                    </div>
                  </a>
                  <a
                    href="javascript:;"
                    className="dropdown-item d-flex align-items-center py-2"
                  >
                    <div className="wd-30 ht-30 d-flex align-items-center justify-content-center bg-primary rounded-circle me-3">
                      <i className="icon-sm text-white" data-feather="layers" />
                    </div>
                    <div className="flex-grow-1 me-2">
                      <p>Apps are ready for update</p>
                      <p className="tx-12 text-muted">5 hrs ago</p>
                    </div>
                  </a>
                  <a
                    href="javascript:;"
                    className="dropdown-item d-flex align-items-center py-2"
                  >
                    <div className="wd-30 ht-30 d-flex align-items-center justify-content-center bg-primary rounded-circle me-3">
                      <i
                        className="icon-sm text-white"
                        data-feather="download"
                      />
                    </div>
                    <div className="flex-grow-1 me-2">
                      <p>Download completed</p>
                      <p className="tx-12 text-muted">6 hrs ago</p>
                    </div>
                  </a>
                </div>
                <div className="px-3 py-2 d-flex align-items-center justify-content-center border-top">
                  <a href="javascript:;">View all</a>
                </div>
              </div>
            </li>
            
          </ul> */}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
