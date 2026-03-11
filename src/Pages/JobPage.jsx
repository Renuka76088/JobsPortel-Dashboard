import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, MapPin, Wallet, Clock, Plus, 
  Search, Loader2, X, CheckCircle2, AlertCircle,
  FileText, ListChecks, Users, Calendar
} from 'lucide-react';

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- NEW STATES FOR VIEW DETAILS ---
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  
  // Form State for Creating Job
  const [formData, setFormData] = useState({
    title: '', company: 'LabelzAI Tech Hub', location: '', 
    salary: '', description: '', experience: '', jobType: 'Full Time'
  });

  const API_BASE = 'https://astrologer-backend-wrbe.onrender.com/api/jobs';
  const DETAILS_API = 'https://astrologer-backend-wrbe.onrender.com/api/job-details/job-details';

  // Fetch All Jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/jobs`);
      if (res.data.success) setJobs(res.data.data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  // --- FETCH SINGLE JOB DETAILS ---
  const handleViewDetails = async (jobId) => {
    setFetchingDetails(true);
    setViewModalOpen(true);
    setSelectedDetails(null); // Reset previous data
    
    try {
      const res = await axios.get(`${DETAILS_API}/${jobId}`);
      if (res.data.success) {
        setSelectedDetails(res.data.data);
      }
    } catch (err) {
      console.error("Details not found for this job");
    } finally {
      setFetchingDetails(false);
    }
  };

  // Create Job Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/create-job`, formData);
      if (res.data.success) {
        setShowModal(false);
        fetchJobs();
        setFormData({ title: '', company: 'LabelzAI Tech Hub', location: '', salary: '', description: '', experience: '', jobType: 'Full Time' });
      }
    } catch (err) {
      alert("Error creating job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Career Opportunities</h1>
            <p className="text-slate-500 mt-1">Manage and publish roles for <span className="text-sky-600 font-semibold">LabelzAI Tech Hub</span></p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3.5 rounded-2xl font-semibold transition-all shadow-lg shadow-sky-100 active:scale-95"
          >
            <Plus size={20} /> Post a New Job
          </button>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Loader2 className="animate-spin mb-4 text-sky-600" size={40} />
            <p className="font-medium text-sm">Fetching latest roles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-sky-50 p-3 rounded-2xl text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Briefcase size={24} />
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {job.jobType}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{job.title}</h3>
                <p className="text-slate-500 font-medium mb-4 text-sm">{job.company}</p>
                
                <div className="grid grid-cols-2 gap-y-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <MapPin size={14} className="text-sky-500" /> {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Clock size={14} className="text-sky-500" /> {job.experience}
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 text-sm col-span-2 font-semibold">
                    <Wallet size={14} className="text-sky-500" /> {job.salary}
                  </div>
                </div>

                <button 
                  onClick={() => handleViewDetails(job._id)}
                  className="w-full py-3 bg-slate-50 border border-slate-100 rounded-xl font-semibold text-slate-600 hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all text-sm"
                >
                  View Full Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- VIEW DETAILS MODAL --- */}
      {viewModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Sticky Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-50 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-sky-600" size={20} /> Job Specification
              </h2>
              <button onClick={() => setViewModalOpen(false)} className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 pt-4">
              {fetchingDetails ? (
                <div className="py-20 flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-sky-600" size={32} />
                  <p className="text-slate-400 text-sm font-medium">Loading details...</p>
                </div>
              ) : selectedDetails ? (
                <div className="space-y-8">
                  {/* Stats Bar */}
                  <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="flex-1 text-center border-r border-slate-200">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Applicants</p>
                      <p className="text-lg font-bold text-sky-600">{selectedDetails.applicants}</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Posted</p>
                      <p className="text-lg font-bold text-slate-700">{selectedDetails.posted}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      Role Overview
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed bg-sky-50/30 p-4 rounded-2xl border border-sky-50">
                      {selectedDetails.description}
                    </p>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <ListChecks className="text-sky-600" size={18} /> Responsibilities
                    </h4>
                    <ul className="space-y-3">
                      {selectedDetails.responsibilities.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="text-emerald-500" size={18} /> Qualifications & Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDetails.requirements.map((item, i) => (
                        <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold border border-emerald-100">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center">
                   <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                   <p className="text-slate-500 font-medium">No detailed information available for this role.</p>
                   <p className="text-slate-400 text-sm mt-1">Please add details from the Management section.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE JOB MODAL (Existing logic kept) */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative">
             {/* ... (Create job form content) ... */}
             <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400">
                <X size={24} />
             </button>
             <h2 className="text-2xl font-bold text-slate-900 mb-6">Post a New Job</h2>
             <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text" placeholder="Job Title" required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Location" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, location: e.target.value})} />
                  <input type="text" placeholder="Salary" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, salary: e.target.value})} />
                </div>
                <input type="text" placeholder="Experience" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, experience: e.target.value})} />
                <textarea placeholder="Brief Intro..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none h-24 resize-none" onChange={(e) => setFormData({...formData, description: e.target.value})} />
                <button type="submit" disabled={submitting} className="w-full bg-sky-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-sky-100">
                   {submitting ? <Loader2 className="animate-spin mx-auto" /> : 'Publish Role'}
                </button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default JobPage;