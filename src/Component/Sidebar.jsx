import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">

      {/* SIDEBAR */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200
        transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static
      `}
      >
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-bold">JobPortal</h2>

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 px-4">

          <Link to="/">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          </Link>

          <Link to="/job-page">
            <NavItem icon={<Briefcase size={20} />} label="Jobs" />
          </Link>

          <Link to='/job-details'>
          <NavItem icon={<Users size={20} />} label="JobDetails" />
          
          </Link>

          <NavItem icon={<FileText size={20} />} label="Reports" />
          <NavItem icon={<Settings size={20} />} label="Settings" />

        </nav>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8">

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 text-slate-400" size={18} />

            <input
              type="text"
              placeholder="Search jobs..."
              className="bg-slate-100 rounded-xl py-2 pl-10 pr-4 w-64"
            />
          </div>

          <div className="flex items-center gap-3">
            <Bell size={20} />
            <img
              src="https://ui-avatars.com/api/?name=Admin"
              className="w-8 h-8 rounded-full"
            />
          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

const NavItem = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-slate-100">
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default DashboardLayout;
