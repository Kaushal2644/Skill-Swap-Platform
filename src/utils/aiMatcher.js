// AI-powered matching algorithm
export const aiMatchUsers = (user, otherUser) => {
  const userTeachSkills = user.skillsToTeach || []
  const userLearnSkills = user.skillsToLearn || []
  const otherTeachSkills = otherUser.skillsToTeach || []
  const otherLearnSkills = otherUser.skillsToLearn || []

  // Find exact skill matches
  const exactMatches = []
  userTeachSkills.forEach(skill => {
    if (otherLearnSkills.includes(skill)) {
      exactMatches.push({ skill, type: 'you_teach', matchType: 'exact' })
    }
  })
  otherTeachSkills.forEach(skill => {
    if (userLearnSkills.includes(skill)) {
      exactMatches.push({ skill, type: 'they_teach', matchType: 'exact' })
    }
  })

  // Find related/similar skills (AI semantic matching simulation)
  const relatedMatches = findRelatedSkills(userTeachSkills, otherLearnSkills, 'you_teach')
    .concat(findRelatedSkills(otherTeachSkills, userLearnSkills, 'they_teach'))

  // Calculate compatibility score
  const compatibilityScore = calculateCompatibilityScore(
    exactMatches.length,
    relatedMatches.length,
    userTeachSkills.length,
    userLearnSkills.length,
    otherTeachSkills.length,
    otherLearnSkills.length
  )

  // Generate AI explanation
  const aiExplanation = generateAIExplanation(exactMatches, relatedMatches, compatibilityScore)

  // Generate AI recommendations
  const aiRecommendations = generateAIRecommendations(user, otherUser, exactMatches, relatedMatches)

  return {
    user: otherUser,
    exactMatches,
    relatedMatches,
    allMatches: [...exactMatches, ...relatedMatches],
    matchScore: exactMatches.length + relatedMatches.length * 0.5,
    compatibilityScore,
    aiExplanation,
    aiRecommendations
  }
}

// Find related/similar skills (simulating AI semantic understanding)
const findRelatedSkills = (teachSkills, learnSkills, type) => {
  const relatedMatches = []
  const skillCategories = {
    'programming': ['javascript', 'python', 'java', 'react', 'node', 'html', 'css', 'typescript', 'vue', 'angular'],
    'design': ['ui', 'ux', 'figma', 'photoshop', 'illustrator', 'design', 'graphic'],
    'languages': ['english', 'spanish', 'french', 'german', 'chinese', 'japanese'],
    'music': ['guitar', 'piano', 'violin', 'drums', 'music', 'singing'],
    'business': ['marketing', 'sales', 'management', 'entrepreneurship', 'finance'],
    'cooking': ['cooking', 'baking', 'culinary', 'recipe'],
    'fitness': ['yoga', 'fitness', 'gym', 'workout', 'running', 'cycling']
  }

  teachSkills.forEach(teachSkill => {
    const teachLower = teachSkill.toLowerCase()
    learnSkills.forEach(learnSkill => {
      const learnLower = learnSkill.toLowerCase()
      
      // Skip if exact match (already counted)
      if (teachLower === learnLower) return
      
      // Check if skills are in same category
      for (const [category, skills] of Object.entries(skillCategories)) {
        const teachInCategory = skills.some(s => teachLower.includes(s))
        const learnInCategory = skills.some(s => learnLower.includes(s))
        
        if (teachInCategory && learnInCategory) {
          // Avoid duplicates
          const exists = relatedMatches.some(m => 
            m.skill.includes(teachSkill) && m.skill.includes(learnSkill)
          )
          if (!exists) {
            relatedMatches.push({
              skill: `${teachSkill} → ${learnSkill}`,
              type,
              matchType: 'related',
              category
            })
            return // Found a match, move to next
          }
        }
      }
    })
  })

  return relatedMatches
}

// Calculate AI compatibility score (0-100)
const calculateCompatibilityScore = (
  exactMatches,
  relatedMatches,
  userTeachCount,
  userLearnCount,
  otherTeachCount,
  otherLearnCount
) => {
  let score = 0

  // Exact matches are worth more
  score += exactMatches * 25

  // Related matches add value
  score += relatedMatches * 10

  // Balance bonus (both users have skills to teach and learn)
  const userBalance = Math.min(userTeachCount, userLearnCount) / Math.max(userTeachCount, userLearnCount, 1)
  const otherBalance = Math.min(otherTeachCount, otherLearnCount) / Math.max(otherTeachCount, otherLearnCount, 1)
  score += (userBalance + otherBalance) * 10

  // Diversity bonus (more skills = better match potential)
  const diversity = Math.min(userTeachCount + userLearnCount, otherTeachCount + otherLearnCount) / 10
  score += diversity * 5

  return Math.min(Math.round(score), 100)
}

// Generate AI explanation for the match
const generateAIExplanation = (exactMatches, relatedMatches, compatibilityScore) => {
  const explanations = []

  if (exactMatches.length > 0) {
    explanations.push(`Perfect skill alignment! ${exactMatches.length} exact match${exactMatches.length > 1 ? 'es' : ''} found.`)
  }

  if (relatedMatches.length > 0) {
    explanations.push(`AI detected ${relatedMatches.length} complementary skill${relatedMatches.length > 1 ? 's' : ''} that could lead to great exchanges.`)
  }

  if (compatibilityScore >= 80) {
    explanations.push('This is an excellent match with high compatibility potential!')
  } else if (compatibilityScore >= 60) {
    explanations.push('Good match with solid potential for skill exchange.')
  } else if (compatibilityScore >= 40) {
    explanations.push('Moderate match with some complementary skills.')
  } else {
    explanations.push('Potential match with room for growth.')
  }

  return explanations.join(' ')
}

// Generate AI recommendations
const generateAIRecommendations = (user, otherUser, exactMatches, relatedMatches) => {
  const recommendations = []

  if (exactMatches.length === 0 && relatedMatches.length === 0) {
    recommendations.push('Consider adding more skills to your profile to find better matches.')
    return recommendations
  }

  // Suggest skills to learn based on what the other person teaches
  const otherTeachSkills = otherUser.skillsToTeach || []
  const userLearnSkills = user.skillsToLearn || []
  const suggestedSkills = otherTeachSkills.filter(skill => !userLearnSkills.includes(skill))
  
  if (suggestedSkills.length > 0) {
    recommendations.push(`Consider learning: ${suggestedSkills.slice(0, 3).join(', ')}`)
  }

  // Suggest skills to teach based on what the other person wants to learn
  const otherLearnSkills = otherUser.skillsToLearn || []
  const userTeachSkills = user.skillsToTeach || []
  const teachableSkills = otherLearnSkills.filter(skill => !userTeachSkills.includes(skill))
  
  if (teachableSkills.length > 0) {
    recommendations.push(`You could teach: ${teachableSkills.slice(0, 3).join(', ')}`)
  }

  if (recommendations.length === 0) {
    recommendations.push('Great match! Consider reaching out to start your skill exchange journey.')
  }

  return recommendations
}


