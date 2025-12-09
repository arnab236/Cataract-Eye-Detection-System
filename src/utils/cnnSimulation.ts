export interface DetectionResult {
  has_cataract: boolean;
  confidence_percentage: number;
  severity_level: 'mild' | 'moderate' | 'severe' | null;
  opacity_grade: number | null;
  cataract_type: 'Nuclear' | 'Cortical' | 'Posterior Subcapsular' | null;
  recommendation: string;
}

export const simulateCNNDetection = async (imageFile: File): Promise<DetectionResult> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const scenarios: DetectionResult[] = [
    {
      has_cataract: true,
      confidence_percentage: 94,
      severity_level: 'moderate',
      opacity_grade: 2.5,
      cataract_type: 'Nuclear',
      recommendation: 'Moderate opacity detected. It is recommended to schedule a comprehensive slit-lamp examination with an ophthalmologist within the next 4 weeks to discuss potential surgical options.'
    },
    {
      has_cataract: true,
      confidence_percentage: 87,
      severity_level: 'mild',
      opacity_grade: 1.2,
      cataract_type: 'Cortical',
      recommendation: 'Mild cortical opacity detected. Regular monitoring is advised. Schedule follow-up examination in 6 months. Consider lifestyle modifications and protective eyewear.'
    },
    {
      has_cataract: true,
      confidence_percentage: 96,
      severity_level: 'severe',
      opacity_grade: 3.8,
      cataract_type: 'Posterior Subcapsular',
      recommendation: 'Severe posterior subcapsular cataract detected. Immediate consultation with an ophthalmologist is strongly recommended. Surgical intervention may be necessary to prevent further vision deterioration.'
    },
    {
      has_cataract: false,
      confidence_percentage: 92,
      severity_level: null,
      opacity_grade: 0.1,
      cataract_type: null,
      recommendation: 'No significant cataract detected. Fundus appears healthy. Continue regular annual eye examinations for preventive care.'
    }
  ];

  const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  return randomScenario;
};
