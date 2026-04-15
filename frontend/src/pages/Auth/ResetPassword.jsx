import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.put(`/api/auth/resetpassword/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            success ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-600'
          }`}>
            {success ? <CheckCircle size={32} /> : <Lock size={32} />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {success ? 'Password Reset successful' : 'Reset your password'}
          </h2>
          <p className="mt-2 text-gray-600">
            {success 
              ? "Your password has been updated. Redirecting to login..."
              : "Enter your new password below to regain access to your account."
            }
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                type="password"
                required
                minLength={6}
                className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input 
                type="password"
                required
                className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              Update Password
            </button>
          </form>
        ) : (
          <div className="text-center pt-4">
            <Link to="/login" className="text-primary-600 font-bold hover:underline">Go to Login Now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
