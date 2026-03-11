import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Save, CheckCircle2, 
  AlertCircle, Loader2, Briefcase, Info 
} from 'lucide-react';

const JobDetailsForm = () => {
  // States
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Form State
  const [formData, setFormData] = useState({
    jobId: '',
    description: '',
    responsibilities: [''],
    requirements: [''],
    applicants: 0,
    posted: ''
  });

  // 1. Fetch All Jobs for the Dropdown
  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://astrologer-backend-wrbe.onrender.com/api/jobs/jobs');
        const result = await response.json();
        if (result.success) {
          setJobs(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch jobs list");
      } finally {
        setLoading(false);
      }
    };
    fetchAllJobs();
  }, []);

  // 2. Fetch Specific Job Details when Job is Selected
  const handleJobSelection = async (id) => {
    if (!id) {
        resetForm();
        return;
    }

    setFormData(prev => ({ ...prev, jobId: id }));
    setFetchingDetails(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`https://astrologer-backend-wrbe.onrender.com/api/job-details/job-details/${id}`);
      const result = await response.json();

      if (result.success && result.data) {
        // Agar details mil gayi toh form populate karo
        setFormData({
          jobId: id,
          description: result.data.description || '',
          responsibilities: result.data.responsibilities.length > 0 ? result.data.responsibilities : [''],
          requirements: result.data.requirements.length > 0 ? result.data.requirements : [''],
          applicants: result.data.applicants || 0,
          posted: result.data.posted || ''
        });
        setStatus({ type: 'success', message: 'Existing details loaded!' });
      } else {
        // Agar details nahi hain (Naya job)
        resetForm(id);
        setStatus({ type: 'info', message: 'No details found for this job. You can create them now.' });
      }
    } catch (err) {
      resetForm(id);
      console.log("Details don't exist yet for this job.");
    } finally {
      setFetchingDetails(false);
    }
  };

  const resetForm = (id = '') => {
    setFormData({
      jobId: id,
      description: '',
      responsibilities: [''],
      requirements: [''],
      applicants: 0,
      posted: ''
    });
  };

  // Input Handlers
  const handleArrayChange = (index, value, field) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeField = (index, field) => {
    const newArr = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArr.length ? newArr : [''] });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('https://astrologer-backend-wrbe.onrender.com/api/job-details/create-job-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setStatus({ type: 'success', message: 'Job details saved successfully!' });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Job Detail Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Select a job to view or update its comprehensive details.</p>
        </div>
        {fetchingDetails && (
          <div className="flex items-center gap-2 text-sky-600 animate-pulse">
            <Loader2 className="animate-spin" size={16} />
            <span className="text-sm font-medium">Fetching Info...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
              <select 
                required
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all cursor-pointer"
                value={formData.jobId}
                onChange={(e) => handleJobSelection(e.target.value)}
              >
                <option value="">-- Choose Job to Load --</option>
                {jobs.map(job => (
                  <option key={job._id} value={job._id}>{job.title}</option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Posted Timeline</label>
              <input 
                type="text"
                placeholder="e.g. 24 Hours Ago"
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                value={formData.posted}
                onChange={(e) => setFormData({...formData, posted: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Applicants Count</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                value={formData.applicants}
                onChange={(e) => setFormData({...formData, applicants: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          {/* Alert Display */}
          {status.message && (
            <div className={`p-4 rounded-xl flex items-start gap-3 text-sm transition-all ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
              status.type === 'info' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
              'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              <div className="mt-0.5">
                {status.type === 'success' ? <CheckCircle2 size={16}/> : 
                 status.type === 'info' ? <Info size={16}/> : <AlertCircle size={16}/>}
              </div>
              <span>{status.message}</span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Job Description</label>
              <textarea 
                required
                rows={5}
                placeholder="Describe the role in detail..."
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none resize-none transition-all"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* Responsibilities */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Responsibilities
                </label>
                <button type="button" onClick={() => addField('responsibilities')} className="text-sky-600 text-xs font-semibold hover:underline flex items-center gap-1">
                  <Plus size={14}/> Add Point
                </button>
              </div>
              <div className="space-y-3">
                {formData.responsibilities.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text"
                      className="flex-1 bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                      value={item}
                      placeholder={`Point ${idx + 1}`}
                      onChange={(e) => handleArrayChange(idx, e.target.value, 'responsibilities')}
                    />
                    {formData.responsibilities.length > 1 && (
                      <button type="button" onClick={() => removeField(idx, 'responsibilities')} className="p-3 text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18}/>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-slate-700">Requirements & Skills</label>
                <button type="button" onClick={() => addField('requirements')} className="text-sky-600 text-xs font-semibold hover:underline flex items-center gap-1">
                  <Plus size={14}/> Add Skill
                </button>
              </div>
              <div className="space-y-3">
                {formData.requirements.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text"
                      className="flex-1 bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                      value={item}
                      placeholder={`Skill ${idx + 1}`}
                      onChange={(e) => handleArrayChange(idx, e.target.value, 'requirements')}
                    />
                    {formData.requirements.length > 1 && (
                      <button type="button" onClick={() => removeField(idx, 'requirements')} className="p-3 text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18}/>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-50 flex justify-end">
              <button 
                disabled={submitting || !formData.jobId}
                className="bg-sky-600 text-white px-10 py-4 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-sky-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-100"
              >
                {submitting ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobDetailsForm;