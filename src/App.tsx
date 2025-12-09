import { useState } from 'react';
import LandingPage from './components/LandingPage';
import PatientIntake from './components/PatientIntake';
import ResultsDashboard from './components/ResultsDashboard';

type View = 'landing' | 'intake' | 'results';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string>('');

  const handleStart = () => {
    setCurrentView('intake');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setCurrentAnalysisId('');
  };

  const handleBackToIntake = () => {
    setCurrentView('intake');
    setCurrentAnalysisId('');
  };

  const handleAnalysisComplete = (analysisId: string) => {
    setCurrentAnalysisId(analysisId);
    setCurrentView('results');
  };

  const handleNextPatient = () => {
    setCurrentView('intake');
    setCurrentAnalysisId('');
  };

  return (
    <>
      {currentView === 'landing' && <LandingPage onStart={handleStart} />}
      {currentView === 'intake' && (
        <PatientIntake
          onBack={handleBackToLanding}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
      {currentView === 'results' && currentAnalysisId && (
        <ResultsDashboard
          analysisId={currentAnalysisId}
          onBack={handleBackToIntake}
          onNextPatient={handleNextPatient}
        />
      )}
    </>
  );
}

export default App;
