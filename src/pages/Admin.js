import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminDashboard() {
  return (
    <div className="admin-container d-flex">
      {/* Sidebar */}
      <div className="sidebar p-3 bg-dark text-white">
        <h4 className="text-center">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/admin/users" className="nav-link text-white">Manage Users</Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/bikes" className="nav-link text-white">Manage Bikes</Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/bookings" className="nav-link text-white">Manage Bookings</Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content p-4 w-100">
        <h2>Admin Dashboard</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card p-3 shadow">
              <h5>Total Users</h5>
              <p>100</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 shadow">
              <h5>Total Bikes</h5>
              <p>50</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 shadow">
              <h5>Total Bookings</h5>
              <p>200</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* CSS */
const styles = `
  .admin-container {
    height: 100vh;
  }
  .sidebar {
    width: 250px;
    height: 100%;
  }
  .main-content {
    flex-grow: 1;
    background: #f8f9fa;
  }
  .card {
    background: white;
    border-radius: 10px;
  }
`;

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
