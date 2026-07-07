import React, { useState } from 'react';
import salaryService from '../services/salaryService';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SalaryAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please upload a salary slip file');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await salaryService.uploadSalarySlip(file);

      if (data.parseFailed) {
        setResult(data);
        setError(data.message || 'Automatic parsing failed. Please verify the salary slip details manually.');
        return;
      }

      // Auto-finalize and sync to profile on upload
      const finalized = await salaryService.finalizeSalary(data._id, data.parsedData);
      setResult(finalized.slip);
      
      if (finalized.slip && finalized.slip.parsedData && finalized.slip.parsedData.grossSalary) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ 
          ...currentUser, 
          monthlyIncome: finalized.slip.parsedData.grossSalary 
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload and parse salary slip');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl m-0">Salary Analyzer</h1>
        <p className="text-slate-400 mt-1 mb-0">Upload your salary slip to automatically extract and analyze data.</p>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>

      <div className="flex gap-8 flex-wrap">
        
        {/* Upload Zone */}
        <div className="glass-card flex-1 min-w-[300px] flex flex-col items-center p-12 border-2 border-dashed border-glass-border">
          <div className="bg-white/5 p-6 rounded-full mb-4 text-primary">
            <UploadCloud size={40} />
          </div>
          <h3 className="mb-2">Upload Salary Slip</h3>
          <p className="text-slate-400 mb-6 text-center">Drag and drop your salary slip here, or click to browse files. PDF slips are auto-parsed; other formats may need manual verification.</p>
          
          <input 
            type="file" 
            accept="*/*" 
            onChange={handleFileChange} 
            className="hidden" 
            id="file-upload" 
          />
          <label htmlFor="file-upload" className="btn btn-outline cursor-pointer mb-4">
            {file ? file.name : 'Select Salary Slip File'}
          </label>
          
          {file && (
            <button onClick={handleUpload} className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Analyzing...' : 'Upload & Analyze'}
            </button>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="glass-card flex-1 min-w-[300px]">
            <h3 className={`flex items-center gap-2 mb-6 ${result.parseFailed ? 'text-warning' : 'text-success'}`}>
              <CheckCircle size={24} /> {result.parseFailed ? 'Upload Complete — Review Required' : 'Parsing Successful'}
            </h3>

            {result.parseFailed && (
              <p className="text-warning mb-4">
                Automatic parsing could not extract all salary fields from this file. Please verify and update the details manually.
              </p>
            )}

            <div className="flex flex-col gap-4">
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-slate-400 m-0 mb-1">Salary Slip</p>
                <h4 className="m-0 text-xl">{result.fileName || file?.name || 'Uploaded file'}</h4>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-slate-400 m-0 mb-1">Statement Month</p>
                <h4 className="m-0 text-xl">{result.month || 'Unknown'}</h4>
              </div>
              {result.parsedData ? (
                <>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-slate-400 m-0 mb-1">Gross Salary</p>
                    <h4 className="m-0 text-xl">₹{result.parsedData.grossSalary?.toLocaleString('en-IN') || 0}</h4>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-slate-400 m-0 mb-1">Basic Salary</p>
                    <h4 className="m-0 text-xl">₹{result.parsedData.basicSalary?.toLocaleString('en-IN') || 0}</h4>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-slate-400 m-0 mb-1">HRA</p>
                    <h4 className="m-0 text-xl">₹{result.parsedData.hra?.toLocaleString('en-IN') || 0}</h4>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-slate-400 m-0 mb-1">Provident Fund (PF)</p>
                    <h4 className="m-0 text-xl">₹{result.parsedData.providentFund?.toLocaleString('en-IN') || 0}</h4>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-slate-400 m-0 mb-1">Professional Tax</p>
                    <h4 className="m-0 text-xl">₹{result.parsedData.professionalTax?.toLocaleString('en-IN') || 0}</h4>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-slate-400 m-0 mb-1">Income Tax Deducted</p>
                    <h4 className="m-0 text-xl">₹{result.parsedData.incomeTaxDeducted?.toLocaleString('en-IN') || 0}</h4>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-slate-400 m-0 mb-1">Other Allowances</p>
                    <h4 className="m-0 text-xl">₹{result.parsedData.otherAllowances?.toLocaleString('en-IN') || 0}</h4>
                  </div>
                  <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-xl text-white">
                    <p className="m-0 mb-1 text-white/80">Net Salary</p>
                    <h4 className="m-0 text-2xl">₹{result.parsedData.netSalary?.toLocaleString('en-IN') || 0}</h4>
                  </div>
                </>
              ) : (
                <p className="text-slate-400">No salary components were automatically extracted from this file.</p>
              )}
            </div>

            {!result.parseFailed && (
              <p className="mt-6 text-sm text-slate-400">
                * The salary components (including HRA and PF) have been automatically synced to your Tax Planner profile.
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SalaryAnalyzer;
