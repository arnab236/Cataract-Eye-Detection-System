import { Eye, Shield, FlaskConical, Lock, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500 p-3 rounded-full">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">Cataract AI</span>
        </div>
        <button className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
          Login for Technicians
          <ArrowRight className="w-4 h-4" />
        </button>
      </nav>

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Cataract Detection &<br />Severity Analysis System
          </h1>

          <p className="text-2xl md:text-3xl text-cyan-400 font-semibold mb-8">
            AI-powered screening from fundus images
          </p>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 mb-8">
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Early detection preserves vision. Our advanced AI analyzes fundus images to identify cataract severity instantly and accurately, providing you with reliable health insights.
            </p>
          </div>

          <div className="relative mb-12">
            <div className="relative w-full max-w-lg mx-auto aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping"></div>
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-full p-12 border-4 border-cyan-500/50">
                    <Eye className="w-24 h-24 md:w-32 md:h-32 text-cyan-400" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse"></div>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full max-w-md mx-auto bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-900 font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50 flex items-center justify-center gap-3"
          >
            <Eye className="w-6 h-6" />
            Check Your Eye
          </button>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <Shield className="w-6 h-6 text-green-400" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <FlaskConical className="w-6 h-6 text-blue-400" />
              <span>Clinically Validated</span>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700">
            <button className="text-slate-400 hover:text-slate-300 transition-colors flex items-center justify-center gap-2 mx-auto">
              <Lock className="w-4 h-4" />
              Privacy Policy
            </button>
            <p className="text-slate-500 text-sm mt-4">Powered by Cataract AI</p>
          </div>
        </div>
      </main>
    </div>
  );
}
