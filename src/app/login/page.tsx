'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hospital, User, Lock, Eye, EyeOff, Shield, Stethoscope, UserCheck, Monitor, Sparkles } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  // Updated credentials from database: varaosrc_hospital_management/admin
  const roles = [
    { id: 'superadmin', name: 'Super Admin', icon: Shield, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', textColor: 'text-red-700', username: 'superadmin', password: 'Super@321' },
    { id: 'admin', name: 'Admin', icon: Shield, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700', username: 'admin', password: 'Admin@Varaha' },
    { id: 'reception', name: 'Reception', icon: UserCheck, color: 'from-rose-500 to-rose-600', bgColor: 'bg-rose-50', textColor: 'text-rose-700', username: 'reception', password: 'Admin@321' },
    { id: 'doctor', name: 'Doctor', icon: Stethoscope, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', username: 'doctor', password: 'Admin@321' },
    { id: 'accounts', name: 'Accounts', icon: UserCheck, color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50', textColor: 'text-teal-700', username: 'accounts', password: 'Admin@321' },
    { id: 'console', name: 'Console', icon: Monitor, color: 'from-violet-500 to-violet-600', bgColor: 'bg-violet-50', textColor: 'text-violet-700', username: 'console', password: 'Admin@321' },
  ];

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role.id);
    setFormData({ username: role.username, password: role.password });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://varahasdc.co.in/api';
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Route users based on their role from database
        switch(data.user.role) {
          case 'superadmin':
            router.push('/superadmin/dashboard');
            break;
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'doctor':
            router.push('/dashboard');
            break;
          case 'reception':
            router.push('/dashboard');
            break;
          case 'console':
            router.push('/console/dashboard');
            break;
          case 'accounts':
            router.push('/dashboard');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left space-y-8">
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-75"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl">
                  <Hospital className="h-12 w-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Varaha SDC
                </h1>
                <p className="text-gray-600 text-xl font-medium">CT Scan Management System</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
              </div>
              <p className="text-gray-600 leading-relaxed max-w-lg">
                Secure access to CT scan management system.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20"></div>
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Sign In</h3>
                  <p className="text-gray-600">Choose your role to access the system</p>
                </div>

                {/* Enhanced Role Selection */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {roles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleRoleSelect(role)}
                        className={`group relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          selectedRole === role.id
                            ? `bg-gradient-to-r ${role.color} text-white border-transparent shadow-xl scale-105`
                            : `${role.bgColor} hover:shadow-lg border-gray-200 ${role.textColor} hover:border-gray-300`
                        }`}
                      >
                        <div className="relative z-10">
                          <IconComponent className="h-6 w-6 mx-auto mb-1" />
                          <div className="text-xs font-semibold">{role.name}</div>
                        </div>
                        {selectedRole === role.id && (
                          <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                    <div className="flex">
                      <div className="text-red-700 text-sm">{error}</div>
                    </div>
                  </div>
                )}

                {/* Username Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !selectedRole}
                  className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    {loading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg">Signing in...</span>
                      </div>
                    ) : (
                      <span className="text-lg">Sign In Securely</span>
                    )}
                  </div>
                </button>
              </form>

                {/* Footer */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-gray-600">Secure SSL Connection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}