import { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, Briefcase, Download, Check, Maximize2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CataractAnalysis, Patient } from '../types';

interface ResultsDashboardProps {
  analysisId: string;
  onBack: () => void;
  onNextPatient: () => void;
}

export default function ResultsDashboard({ analysisId, onBack, onNextPatient }: ResultsDashboardProps) {
  const [analysis, setAnalysis] = useState<CataractAnalysis | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'notes' | 'history'>('summary');
  const [imageView, setImageView] = useState<'original' | 'heatmap'>('original');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysisData();
  }, [analysisId]);

  const loadAnalysisData = async () => {
    try {
      const { data: analysisData, error: analysisError } = await supabase
        .from('cataract_analyses')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (analysisError) throw analysisError;

      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', analysisData.patient_id)
        .single();

      if (patientError) throw patientError;

      setAnalysis(analysisData);
      setPatient(patientData);
    } catch (error) {
      console.error('Error loading analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReviewed = async () => {
    if (!analysis) return;

    try {
      await supabase
        .from('cataract_analyses')
        .update({ reviewed: true })
        .eq('id', analysis.id);

      onNextPatient();
    } catch (error) {
      console.error('Error marking as reviewed:', error);
    }
  };

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case 'mild':
        return 'text-green-400';
      case 'moderate':
        return 'text-orange-400';
      case 'severe':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getSeverityPosition = (severity: string | null) => {
    switch (severity) {
      case 'mild':
        return '16.67%';
      case 'moderate':
        return '50%';
      case 'severe':
        return '83.33%';
      default:
        return '0%';
    }
  };

  if (loading || !analysis || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Patient Dashboard</h1>
        <div className="w-6"></div>
      </nav>

      <main className="container mx-auto px-4 py-6 max-w-4xl pb-32">
        <div className={`rounded-2xl p-4 mb-6 border-2 ${
          analysis.has_cataract
            ? 'bg-orange-500/10 border-orange-500/50'
            : 'bg-green-500/10 border-green-500/50'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 text-sm">Patient ID: {analysis.patient_case_id}</span>
              {analysis.has_cataract && (
                <>
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-400 font-bold">Cataract Detected</span>
                </>
              )}
              {!analysis.has_cataract && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-bold">No Cataract Detected</span>
                </>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              analysis.has_cataract ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
            }`}>
              {analysis.confidence_percentage}% Confidence
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === 'summary'
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === 'notes'
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === 'history'
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            History
          </button>
        </div>

        {activeTab === 'summary' && (
          <>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">AI Analysis Overview</h2>

              {analysis.has_cataract && analysis.severity_level && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Severity Level</span>
                    <span className={`font-bold text-lg ${getSeverityColor(analysis.severity_level)} capitalize`}>
                      {analysis.severity_level}
                    </span>
                  </div>
                  <div className="relative h-8 bg-slate-700 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="flex-1 bg-green-600"></div>
                      <div className="flex-1 bg-orange-500"></div>
                      <div className="flex-1 bg-red-600"></div>
                    </div>
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-1 h-10 bg-white shadow-lg"
                      style={{ left: getSeverityPosition(analysis.severity_level) }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>MILD</span>
                    <span>MODERATE</span>
                    <span>SEVERE</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Opacity Score</div>
                  <div className="text-2xl font-bold text-white">
                    Grade {analysis.opacity_grade?.toFixed(1) || 'N/A'}
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Type</div>
                  <div className="text-2xl font-bold text-white">
                    {analysis.cataract_type || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {analysis.recommendation && (
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/50 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-orange-400 font-bold text-lg mb-2">Clinical Recommendation</h3>
                    <p className="text-slate-200 leading-relaxed">{analysis.recommendation}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Visual Analysis</h2>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setImageView('original')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    imageView === 'original'
                      ? 'bg-cyan-500 text-slate-900'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Original Fundus
                </button>
                <button
                  onClick={() => setImageView('heatmap')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    imageView === 'heatmap'
                      ? 'bg-cyan-500 text-slate-900'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  AI Heatmap
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-square">
                  {analysis.image_url && (
                    <img
                      src={analysis.image_url}
                      alt="Fundus scan"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span className="text-white text-sm font-semibold">Left Eye (OS)</span>
                  </div>
                  <button className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2 text-white text-sm hover:bg-slate-800 transition-colors">
                    <Maximize2 className="w-4 h-4" />
                    Expand
                  </button>
                </div>

                {imageView === 'heatmap' && (
                  <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
                    <div className="text-slate-500 text-center">
                      <div className="w-16 h-16 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3"></div>
                      <p>Heatmap visualization</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-900 font-bold py-4 px-8 rounded-full text-lg transition-all flex items-center justify-center gap-3 mb-4">
              <Download className="w-6 h-6" />
              Download Report (PDF)
            </button>

            <button
              onClick={handleMarkReviewed}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all flex items-center justify-center gap-3"
            >
              <Check className="w-6 h-6" />
              Mark Reviewed & Scan Next Patient
            </button>
          </>
        )}

        {activeTab === 'notes' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Clinical Notes</h2>
            <p className="text-slate-400">No notes added yet.</p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Patient History</h2>
            <div className="space-y-3">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white">Current Scan</span>
                  <span className="text-slate-400 text-sm">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-300 text-sm">
                  {analysis.has_cataract ? 'Cataract detected' : 'No cataract detected'} - {analysis.confidence_percentage}% confidence
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
