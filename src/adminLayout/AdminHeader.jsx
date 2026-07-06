import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SyncLoader } from "react-spinners"
import { toast, ToastContainer } from "react-toastify"
import checkAdmin from "../utilities/CheckAdmin"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faServicestack } from '@fortawesome/free-brands-svg-icons';

export default function AdminHeader() {


  var [visible, setvisible] = useState(true)

  const token = sessionStorage.getItem("token")
  const nav = useNavigate();


  const Logout = (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      sessionStorage.removeItem('token');
      toast.success("Logout Successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      setTimeout(() => {
        nav('/login');
      }, 1500);
    }
  }


  return (
    <>
      {/* Navbar & Hero Start */}
      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
          <Link to="" className="navbar-brand p-0">
            <h1 className="m-0">
              SmartBooking AI
            </h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars" />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">

              <Link to='/admin' className="nav-item nav-link">
                Dashboard
              </Link>

              <Link to='/admin/users' className="nav-item nav-link">
                Users
              </Link>

              <Link to='/admin/booking/analytics' className="nav-item nav-link">
                Analytics
              </Link>

              <Link to='/admin/events' className="nav-item nav-link">
                Events
              </Link>

              <Link to='/admin/bookings/all' className="nav-item nav-link">
                Bookings
              </Link>

            </div>

            {token ? <Link to="/login" onClick={Logout} className="btn btn-primary rounded-pill py-2 px-4 ms-lg-4" >Logout</Link> : <Link to='/login' className="btn btn-primary rounded-pill py-2 px-4 ms-lg-4" >Login</Link>}

          </div>
        </nav>

      </div>
      <div
        className="container-fluid search-bar position-relative"
        style={{ top: "-50%", transform: "translateY(-50%)" }}
      >

      </div>
      {/* Navbar & Hero End */}

      <ToastContainer />

    </>
  )
}
