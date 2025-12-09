import { useState, useRef } from 'react';
import { ArrowLeft, Camera, Upload, Loader2, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { simulateCNNDetection } from '../utils/cnnSimulation';

interface PatientIntakeProps {
  onBack: () => void;
  onAnalysisComplete: (analysisId: string) => void;
}

export default function PatientIntake({ onBack, onAnalysisComplete }: PatientIntakeProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('File size must be less than 5MB');
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcess = async () => {
    if (!fullName.trim() || !email.trim() || !selectedFile) {
      alert('Please fill in all fields and upload an image');
      return;
    }

    if (!email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);

    try {
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .insert({
          full_name: fullName,
          email: email
        })
        .select()
        .single();

      if (patientError) throw patientError;

      const timestamp = Date.now();
      const fileName = `fundus_${patientData.id}_${timestamp}.${selectedFile.name.split('.').pop()}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fundus-images')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      let imageUrl = previewUrl || '';

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('fundus-images')
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const detectionResult = await simulateCNNDetection(selectedFile);

      const caseId = `#CD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      const { data: analysisData, error: analysisError } = await supabase
        .from('cataract_analyses')
        .insert({
          patient_id: patientData.id,
          image_url: imageUrl,
          has_cataract: detectionResult.has_cataract,
          confidence_percentage: detectionResult.confidence_percentage,
          severity_level: detectionResult.severity_level,
          opacity_grade: detectionResult.opacity_grade,
          cataract_type: detectionResult.cataract_type,
          recommendation: detectionResult.recommendation,
          patient_case_id: caseId,
          reviewed: false
        })
        .select()
        .single();

      if (analysisError) throw analysisError;

      onAnalysisComplete(analysisData.id);
    } catch (error) {
      console.error('Error processing analysis:', error);
      alert('An error occurred while processing the analysis. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Patient Intake</h1>
        <div className="w-6"></div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <p className="text-center text-slate-300 mb-8">
          Please enter patient details and upload a clear fundus image for cataract analysis.
        </p>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6">
          <label className="block mb-4">
            <span className="text-white font-semibold mb-2 block">Patient Full Name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              disabled={isProcessing}
            />
          </label>

          <label className="block">
            <span className="text-white font-semibold mb-2 block">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              disabled={isProcessing}
            />
          </label>
        </div>

        <div className="mb-6">
          <label className="block mb-3">
            <span className="text-white font-semibold">Fundus Image</span>
          </label>

          <div className="border-2 border-dashed border-cyan-500/50 rounded-2xl p-8 text-center bg-slate-800/30">
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Selected fundus"
                  className="max-w-full max-h-64 mx-auto rounded-lg"
                />
                <button
                  onClick={handleBrowseClick}
                  disabled={isProcessing}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <>
                <div className="bg-cyan-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-10 h-10 text-cyan-400" />
                </div>
                <p className="text-white font-semibold mb-2">Tap to upload Fundus Image</p>
                <p className="text-slate-400 text-sm mb-4">Supported formats: JPG, PNG (Max 5MB)</p>
                <button
                  onClick={handleBrowseClick}
                  disabled={isProcessing}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Browse Files
                </button>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <button
          onClick={handleProcess}
          disabled={isProcessing || !fullName || !email || !selectedFile}
          className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-slate-900 font-bold py-4 px-8 rounded-full text-lg transition-all flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing Image...
            </>
          ) : (
            <>
              <Shield className="w-6 h-6" />
              Process Image
            </>
          )}
        </button>

        <p className="text-center text-slate-400 text-sm mt-4">
          By processing, you agree to the medical data privacy policy.
        </p>
      </main>
    </div>
  );
}
