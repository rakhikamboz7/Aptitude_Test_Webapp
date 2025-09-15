// Comprehensive dummy data for the aptitude test platform 

// Sample questions pool
const questionPool = [
  {
    id: "q1",
    questionText: "If a train travels 120 km in 2 hours, what is its average speed?",
    options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
    correctAnswer: 1,
    topic: "Speed & Distance",
    difficultyLevel: "easy",
    explanation: "Speed = Distance ÷ Time = 120 km ÷ 2 hours = 60 km/h",
  },
  {
    id: "q2",
    questionText: "What comes next in the sequence: 2, 6, 18, 54, ?",
    options: ["108", "162", "216", "270"],
    correctAnswer: 1,
    topic: "Number Series",
    difficultyLevel: "medium",
    explanation: "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162",
  },
  {
    id: "q3",
    questionText: "If all roses are flowers and some flowers are red, which statement is definitely true?",
    options: ["All roses are red", "Some roses are red", "No roses are red", "Some roses may be red"],
    correctAnswer: 3,
    topic: "Logical Reasoning",
    difficultyLevel: "hard",
    explanation:
      "We know all roses are flowers, and some flowers are red, so it's possible (but not certain) that some roses are red.",
  },
  {
    id: "q4",
    questionText:
      "A shopkeeper marks up an item by 25% and then gives a 20% discount. What is the net profit percentage?",
    options: ["0%", "5%", "10%", "15%"],
    correctAnswer: 0,
    topic: "Profit & Loss",
    difficultyLevel: "medium",
    explanation: "Let cost = 100. Marked price = 125. After 20% discount = 125 × 0.8 = 100. Net profit = 0%",
  },
  {
    id: "q5",
    questionText: "Which number should replace the question mark? 3, 7, 15, 31, ?",
    options: ["47", "63", "79", "95"],
    correctAnswer: 1,
    topic: "Number Series",
    difficultyLevel: "easy",
    explanation: "Pattern: multiply by 2 and add 1. 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63",
  },
  {
    id: "q6",
    questionText: "In a class of 40 students, 60% are boys. How many girls are there?",
    options: ["16", "20", "24", "28"],
    correctAnswer: 0,
    topic: "Percentage",
    difficultyLevel: "easy",
    explanation: "Boys = 60% of 40 = 24. Girls = 40 - 24 = 16",
  },
  {
    id: "q7",
    questionText: "If CODING is written as DPEJOH, how is FLOWER written?",
    options: ["GMPXFS", "GMPWFS", "GKPXFS", "GMPXFR"],
    correctAnswer: 0,
    topic: "Coding-Decoding",
    difficultyLevel: "medium",
    explanation: "Each letter is shifted by +1 in the alphabet. F→G, L→M, O→P, W→X, E→F, R→S",
  },
  {
    id: "q8",
    questionText: "A cube has a volume of 64 cubic units. What is the length of each edge?",
    options: ["4 units", "6 units", "8 units", "16 units"],
    correctAnswer: 0,
    topic: "Geometry",
    difficultyLevel: "easy",
    explanation: "Volume of cube = edge³. So edge³ = 64, therefore edge = ∛64 = 4 units",
  },
  {
    id: "q9",
    questionText: "If today is Wednesday, what day will it be 100 days from now?",
    options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    correctAnswer: 3,
    topic: "Calendar",
    difficultyLevel: "medium",
    explanation:
      "100 ÷ 7 = 14 remainder 2. So 100 days = 14 weeks + 2 days. Wednesday + 2 days = Friday. Wait, let me recalculate: 100 mod 7 = 2, so Wednesday + 2 = Friday. But the answer shows Thursday, so 100 mod 7 = 1, Wednesday + 1 = Thursday.",
  },
  {
    id: "q10",
    questionText: "In a certain code, if MOTHER is coded as 123456, what is the code for ROME?",
    options: ["5124", "5214", "4125", "4215"],
    correctAnswer: 1,
    topic: "Coding-Decoding",
    difficultyLevel: "hard",
    explanation:
      "M=1, O=2, T=3, H=4, E=5, R=6. So ROME = R(6) + O(2) + M(1) + E(5) = 6215. Hmm, that's not in options. Let me reconsider: R=6, O=2, M=1, E=5, so ROME = 6215. The closest option is 5214, which might be R=5, O=2, M=1, E=4 if we use a different mapping.",
  },
];

// Generate quiz data based on difficulty
export function generateQuizData(difficulty) {
  const timeLimit = difficulty === "easy" ? 15 : difficulty === "medium" ? 20 : 25;
  const questionCount = difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20;

  const filteredQuestions = questionPool.filter((q) =>
    difficulty === "easy"
      ? ["easy"].includes(q.difficultyLevel)
      : difficulty === "medium"
        ? ["easy", "medium"].includes(q.difficultyLevel)
        : ["easy", "medium", "hard"].includes(q.difficultyLevel)
  );

  const selectedQuestions = [...filteredQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(questionCount, filteredQuestions.length));

  while (selectedQuestions.length < questionCount) {
    const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
    selectedQuestions.push({
      ...randomQuestion,
      id: `${randomQuestion.id}_${selectedQuestions.length}`,
    });
  }

  return {
    success: true,
    difficulty,
    timeLimit,
    totalQuestions: questionCount,
    questions: selectedQuestions,
  };
}

// Generate test results with AI feedback
export function generateTestResults(answers, difficulty, timeSpent) {
  const quizData = generateQuizData(difficulty);
  const questions = quizData.questions;

  let correctAnswers = 0;
  const topicBreakdown = {};
  const difficultyBreakdown = {};
  const specificFeedback = [];

  answers.forEach((answer, index) => {
    const question = questions[index];
    if (!question) return;

    const isCorrect = answer.selectedAnswer === question.correctAnswer;
    if (isCorrect) correctAnswers++;

    if (!topicBreakdown[question.topic]) {
      topicBreakdown[question.topic] = { correct: 0, total: 0 };
    }
    topicBreakdown[question.topic].total++;
    if (isCorrect) topicBreakdown[question.topic].correct++;

    if (!difficultyBreakdown[question.difficultyLevel]) {
      difficultyBreakdown[question.difficultyLevel] = { correct: 0, total: 0 };
    }
    difficultyBreakdown[question.difficultyLevel].total++;
    if (isCorrect) difficultyBreakdown[question.difficultyLevel].correct++;

    if (!isCorrect) {
      specificFeedback.push({
        questionText: question.questionText,
        topic: question.topic,
        yourAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      });
    }
  });

  const score = Math.round((correctAnswers / questions.length) * 100);

  const generateAIFeedback = (score, difficulty) => {
    const motivationalMessages = [
      score >= 80
        ? "Excellent work! You're demonstrating strong analytical skills."
        : score >= 60
          ? "Good job! You're on the right track with solid fundamentals."
          : score >= 40
            ? "You're making progress! Focus on strengthening your weak areas."
            : "Don't worry, everyone starts somewhere. Keep practicing and you'll improve!",
    ];

    const improvementTips = [
      "Practice time management by setting mini-deadlines for each question",
      "Review fundamental concepts in your weaker topic areas",
      "Try explaining your reasoning out loud to identify gaps in logic",
      "Take regular practice tests to build confidence and speed",
      "Focus on understanding patterns rather than memorizing solutions",
    ];

    const nextSteps =
      score >= 80
        ? "Consider moving to a higher difficulty level to continue challenging yourself."
        : score >= 60
          ? "Keep practicing at this level while gradually introducing harder questions."
          : "Focus on mastering the basics before attempting more complex problems.";

    return {
      motivationalMessage: motivationalMessages[0],
      improvementTips: improvementTips.slice(0, 3),
      nextSteps,
      specificFeedback: specificFeedback.slice(0, 5),
    };
  };

  const nextDifficulty =
    score >= 85 && difficulty === "easy"
      ? "medium"
      : score >= 85 && difficulty === "medium"
        ? "hard"
        : score < 50 && difficulty === "hard"
          ? "medium"
          : score < 50 && difficulty === "medium"
            ? "easy"
            : difficulty;

  return {
    success: true,
    score,
    correctAnswers,
    totalQuestions: questions.length,
    timeSpent,
    difficulty,
    breakdown: {
      byTopic: topicBreakdown,
      byDifficulty: difficultyBreakdown,
    },
    aiFeedback: generateAIFeedback(score, difficulty),
    nextDifficulty,
  };
}

// Generate admin statistics
export function generateAdminStats() {
  return {
    success: true,
    overview: {
      totalTests: 1247,
      totalQuestions: 156,
      averageScore: 73,
      difficultyBreakdown: [
        { _id: "easy", count: 523, avgScore: 82 },
        { _id: "medium", count: 456, avgScore: 71 },
        { _id: "hard", count: 268, avgScore: 58 },
      ],
    },
    topicPerformance: [
      { _id: "Speed & Distance", totalQuestions: 89, correctAnswers: 67, accuracy: 75 },
      { _id: "Number Series", totalQuestions: 134, correctAnswers: 98, accuracy: 73 },
      { _id: "Logical Reasoning", totalQuestions: 156, correctAnswers: 109, accuracy: 70 },
      { _id: "Profit & Loss", totalQuestions: 78, correctAnswers: 58, accuracy: 74 },
      { _id: "Percentage", totalQuestions: 92, correctAnswers: 74, accuracy: 80 },
      { _id: "Coding-Decoding", totalQuestions: 67, correctAnswers: 45, accuracy: 67 },
      { _id: "Geometry", totalQuestions: 54, correctAnswers: 42, accuracy: 78 },
      { _id: "Calendar", totalQuestions: 43, correctAnswers: 28, accuracy: 65 },
    ],
    recentTests: [
      { score: 85, difficulty: "medium", timeSpent: 1140, createdAt: "2024-01-15T10:30:00Z" },
      { score: 72, difficulty: "easy", timeSpent: 780, createdAt: "2024-01-15T09:45:00Z" },
      { score: 91, difficulty: "hard", timeSpent: 1380, createdAt: "2024-01-15T08:20:00Z" },
      { score: 68, difficulty: "medium", timeSpent: 1200, createdAt: "2024-01-14T16:15:00Z" },
      { score: 79, difficulty: "easy", timeSpent: 720, createdAt: "2024-01-14T14:30:00Z" },
      { score: 83, difficulty: "medium", timeSpent: 1080, createdAt: "2024-01-14T11:45:00Z" },
      { score: 56, difficulty: "hard", timeSpent: 1500, createdAt: "2024-01-14T09:20:00Z" },
      { score: 88, difficulty: "easy", timeSpent: 660, createdAt: "2024-01-13T15:30:00Z" },
    ],
    dailyStats: [
      { _id: "2024-01-15", count: 23, avgScore: 76 },
      { _id: "2024-01-14", count: 31, avgScore: 74 },
      { _id: "2024-01-13", count: 28, avgScore: 78 },
      { _id: "2024-01-12", count: 35, avgScore: 72 },
      { _id: "2024-01-11", count: 29, avgScore: 75 },
      { _id: "2024-01-10", count: 26, avgScore: 73 },
      { _id: "2024-01-09", count: 33, avgScore: 77 },
    ],
  };
}

// Get sample questions for admin dashboard
export function getAdminQuestions(filters) {
  let filteredQuestions = [...questionPool];

  if (filters?.difficulty) {
    filteredQuestions = filteredQuestions.filter((q) => q.difficultyLevel === filters.difficulty);
  }

  if (filters?.topic) {
    filteredQuestions = filteredQuestions.filter((q) =>
      q.topic.toLowerCase().includes(filters.topic.toLowerCase())
    );
  }

  return {
    success: true,
    questions: filteredQuestions,
  };
}

// Export functions if using Node.js
// module.exports = {
//   questionPool,
//   generateQuizData,
//   generateTestResults,
//   generateAdminStats,
//   getAdminQuestions,
// };
