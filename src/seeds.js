// Bilingual sample data for first launch (Hindi / English medium)
export function seeds(lang) {
  if (lang === 'en') {
    return {
      notes: [
        {
          id: 'seed-n1', subject: 'General', title: '4 Golden Rules of Studying',
          body: 'Four golden rules of studying. One. Study a little every day, never all at once. Two. Keep your phone away while studying. Three. After reading, close your eyes and recall what you learnt. Four. For anything you do not understand, make a question on it and answer it yourself.',
          updatedAt: Date.now(),
        },
        {
          id: 'seed-n2', subject: 'Technique', title: 'What is the Pomodoro technique?',
          body: 'Pomodoro is a focus technique. In a Pomodoro session you study with full attention for 25 minutes. Then take a good 5 minute break. After 4 such sessions take a long break of 15 to 30 minutes. Pomodoro reduces study fatigue and builds focus.',
          updatedAt: Date.now(),
        },
      ],
      quizzes: [{
        id: 'seed-q1', name: 'Sample Quiz (General Knowledge)', questions: [
          { q: 'How many days does Earth take to orbit the Sun?', options: ['365 days', '30 days', '7 days', '100 days'], answer: 0 },
          { q: 'What is the chemical formula of water?', options: ['H2O2', 'H2O', 'CO2', 'O2'], answer: 1 },
          { q: 'Which of these is a prime number?', options: ['9', '15', '17', '21'], answer: 2 },
        ],
      }],
      cards: [
        { id: 'seed-c1', subject: 'General', front: 'Largest planet?', back: 'Jupiter' },
        { id: 'seed-c2', subject: 'General', front: 'Formula of water?', back: 'H₂O' },
        { id: 'seed-c3', subject: 'Maths', front: 'Perimeter of a square (side = a)?', back: '4a' },
        { id: 'seed-c4', subject: 'Maths', front: 'Approximate value of π?', back: '3.14159' },
      ],
      subjects: ['General', 'Maths', 'Science', 'English'],
    }
  }
  return {
    notes: [
      {
        id: 'seed-n1', subject: 'सामान्य', title: 'पढ़ाई के 4 सुनहरे नियम',
        body: 'पढ़ाई के 4 सुनहरे नियम। एक। रोज़ थोड़ा पढ़ो, कभी एक साथ सब नहीं। दो। पढ़ते समय फोन दूर रखो। तीन। पढ़ने के बाद आँख बंद करके याद करो कि क्या पढ़ा। चार। जो समझ न आए, उसके ऊपर सवाल बनाओ और खुद जवाब दो।',
        updatedAt: Date.now(),
      },
      {
        id: 'seed-n2', subject: 'तकनीक', title: 'पोमोडोरो क्या है?',
        body: 'पोमोडोरो एक फोकस तकनीक है। पोमोडोरो में 25 मिनट पूरे ध्यान से पढ़ो। फिर 5 मिनट अच्छा ब्रेक लो। 4 ऐसे सेशन के बाद 15 से 30 मिनट का लंबा ब्रेक लो। पोमोडोरो से पढ़ाई में थकान कम और फोकस बढ़ता है।',
        updatedAt: Date.now(),
      },
    ],
    quizzes: [{
      id: 'seed-q1', name: 'नमूना क्विज़ (सामान्य ज्ञान)', questions: [
        { q: 'पृथ्वी सूर्य का चक्कर कितने दिनों में लगाती है?', options: ['365 दिन', '30 दिन', '7 दिन', '100 दिन'], answer: 0 },
        { q: 'पानी का रासायनिक सूत्र क्या है?', options: ['H2O2', 'H2O', 'CO2', 'O2'], answer: 1 },
        { q: 'इनमें से कौन अभाज्य (prime) संख्या है?', options: ['9', '15', '17', '21'], answer: 2 },
      ],
    }],
    cards: [
      { id: 'seed-c1', subject: 'सामान्य', front: 'सबसे बड़ा ग्रह?', back: 'बृहस्पति (Jupiter)' },
      { id: 'seed-c2', subject: 'सामान्य', front: 'पानी का सूत्र?', back: 'H₂O' },
      { id: 'seed-c3', subject: 'गणित', front: 'वर्ग का परिमाप (भुजा = a)?', back: '4a' },
      { id: 'seed-c4', subject: 'गणित', front: 'π की अपेक्षित वैल्यू?', back: '3.14159' },
    ],
    subjects: ['सामान्य', 'गणित', 'विज्ञान', 'अंग्रेज़ी', 'तकनीक'],
  }
}
