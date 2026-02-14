import { Question, ExamResults, UserAnswer } from '@/lib/types/exam';

export function generateRandomExam(allQuestions: Question[]): Question[] {
  // Shuffle all questions
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  
  // Take first 35
  const examQuestions = shuffled.slice(0, 35);
  
  // Select 3 random questions for double points
  const doublePointsIndices: number[] = [];
  while (doublePointsIndices.length < 3) {
    const randomIndex = Math.floor(Math.random() * 35);
    if (!doublePointsIndices.includes(randomIndex)) {
      doublePointsIndices.push(randomIndex);
      examQuestions[randomIndex].doublePoints = true;
    }
  }
  
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
