export interface Patient {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export interface CataractAnalysis {
  id: string;
  patient_id: string;
  image_url: string;
  has_cataract: boolean;
  confidence_percentage: number;
  severity_level: 'mild' | 'moderate' | 'severe' | null;
  opacity_grade: number | null;
  cataract_type: 'Nuclear' | 'Cortical' | 'Posterior Subcapsular' | null;
  recommendation: string | null;
  patient_case_id: string;
  created_at: string;
  reviewed: boolean;
}

export interface AnalysisResult {
  patient: Patient;
  analysis: CataractAnalysis;
}
