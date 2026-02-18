import { Question, ExamResults, UserAnswer } from '@/lib/types/exam';

export function generateRandomExam(allQuestions: Question[]): Question[] {
  // Separate questions into double-points and normal pools
  const doublePointQuestions = allQuestions.filter(q => q.doublePoints);
  const normalQuestions = allQuestions.filter(q => !q.doublePoints);

  // Shuffle both pools
  const shuffledDouble = [...doublePointQuestions].sort(() => 0.5 - Math.random());
  const shuffledNormal = [...normalQuestions].sort(() => 0.5 - Math.random());

  // Select exactly 3 double-point questions (or fewer if not available)
  const selectedDouble = shuffledDouble.slice(0, 3);
  
  // Select remaining needed to reach 35 total (usually 32)
  const neededNormal = 35 - selectedDouble.length;
  const selectedNormal = shuffledNormal.slice(0, neededNormal);

  // Combine and shuffle the final exam set
  const examQuestions = [...selectedDouble, ...selectedNormal].sort(() => 0.5 - Math.random());
  
  return examQuestions;
}

export function calculateScore(
  questions: Question[],
  userAnswers: UserAnswer[]
): ExamResults {
  let correctAnswers = 0;
  let totalPoints = 0;
  let maxPoints = 0;
  
  questions.forEach((question, index) => {
    const points = question.doublePoints ? 2 : 1;
    maxPoints += points;
    
    if (userAnswers[index] === question.correct) {
      correctAnswers++;
      totalPoints += points;
    }
  });
  
  const incorrectPoints = maxPoints - totalPoints;
  const passed = incorrectPoints < 6;
  
  return {
    correct: correctAnswers,
    points: totalPoints,
    maxPoints,
    incorrect: incorrectPoints,
    passed
  };
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
