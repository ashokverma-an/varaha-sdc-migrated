'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hospital, Shield, Users, Activity, BarChart3, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  const features = [
    { icon: Shield, title: 'Secure Access', desc: 'Enterprise-grade security with role-based authentication', color: 'from-blue-500 to-blue-600' },
    { icon: Users, title: 'Multi-Role System', desc: 'Admin, Doctor, Nurse, and Console management', color: 'from-emerald-500 to-emerald-600' },
    { icon: Activity, title: 'Real-time Monitoring', desc: 'Live system status and patient tracking', color: 'from-violet-500 to-violet-600' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Comprehensive reports and insights', color: 'from-amber-500 to-amber-600' }
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-75"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl animate-float">
                  <Hospital className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Varaha SDC
                </h1>
                <p className="text-gray-600 text-2xl font-medium">Hospital Management System</p>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
                <h2 className="text-4xl font-bold text-gray-900">Modern Healthcare Management</h2>
                <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience the future of hospital administration with our secure, intuitive, and powerful platform designed for modern healthcare professionals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <button
                  onClick={() => router.push('/login')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white font-semibold rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center space-x-2">
                    <span className="text-lg">Access System</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Secure SSL Connection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20">
                  <div className={`inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/30">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Healthcare Professionals</h3>
              <p className="text-gray-600 text-lg">Delivering excellence in hospital management</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">99.9%</div>
                <div className="text-gray-600 font-medium">System Uptime</div>
                <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '99.9%'}}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Support Available</div>
                <div className="w-full bg-emerald-100 rounded-full h-2 mt-3">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent mb-2">100%</div>
                <div className="text-gray-600 font-medium">Secure Access</div>
                <div className="w-full bg-violet-100 rounded-full h-2 mt-3">
                  <div className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}