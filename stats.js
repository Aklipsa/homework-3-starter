const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

export function validateQuizData(data) {
  if (typeof data !== 'object' || data === null || isArray(data)) {
    return false
  }

  if (typeof data.quizTitle !== 'string' || data.quizTitle.trim() === '') {
    return false
  }

  if (!isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
    return false
  }

  if (!isArray(data.attempts) || data.attempts.length === 0) {
    return false
  }

  return data.attempts.every((attempt) => {
    if (typeof attempt !== 'object' || attempt === null || isArray(attempt)) {
      return false
    }

    if (typeof attempt.name !== 'string' || attempt.name.trim() === '') {
      return false
    }

    return isArray(attempt.answers) &&
      attempt.answers.length === data.correctAnswers.length
  })
}

export function calculateAttempt(attempt, correctAnswers) {
  let score = 0

  attempt.answers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) {
      score += 1
    }
  })

  const percentage = Math.round((score / correctAnswers.length) * 100)

  return {
    name: attempt.name.trim(),
    score,
    percentage,
    passed: percentage >= PASSING_PERCENTAGE,
  }
}

export function calculateReport(data) {
  const attempts = data.attempts.map((attempt) => {
    return calculateAttempt(attempt, data.correctAnswers)
  })

  const totalPercentage = attempts.reduce((sum, attempt) => {
    return sum + attempt.percentage
  }, 0)

  let best = attempts[0]

  attempts.forEach((attempt) => {
    if (attempt.percentage > best.percentage) {
      best = attempt
    }
  })

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: attempts.length,
    averagePercentage: Math.round(totalPercentage / attempts.length),
    passedCount: attempts.filter((attempt) => attempt.passed).length,
    threshold: PASSING_PERCENTAGE,
    best,
    attempts,
  }
}
