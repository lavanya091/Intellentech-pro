import React, { useState } from 'react';
import axios from 'axios';
import { Mail, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/forgotpassword', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send recovery email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {sent ? <CheckCircle size={32} /> : <Mail size={32} />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{sent ? 'Check your email' : 'Forgot Password?'}</h2>
          <p className="mt-2 text-gray-600">
            {sent 
              ? `We've sent recovery instructions to ${email}`
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email"
                required
                className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              Send Reset Link
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setSent(false)}
            className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50"
          >
            Try another email
          </button>
        )}

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-primary-600 font-medium hover:underline">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
