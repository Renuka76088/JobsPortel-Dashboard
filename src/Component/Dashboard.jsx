import React from "react";
import { Plus, Briefcase } from "lucide-react";


const Dashboard = () => {
  return (
    

      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Job Management
            </h1>
            <p className="text-slate-500">
              Post new roles and track applications.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-200">
            <Plus size={20} /> Add New Job
          </button>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          <StatCard title="Active Jobs" value="24" color="bg-blue-500" />
          <StatCard title="New Applications" value="142" color="bg-emerald-500" />
          <StatCard title="Interviews" value="12" color="bg-amber-500" />

        </div>

      </div>

    
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div
      className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-inner`}
    >
      <Briefcase size={24} />
    </div>

    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h2 className="text-2xl font-bold text-slate-900">{value}</h2>
    </div>
  </div>
);

export default Dashboard;
