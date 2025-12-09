import React, { useState, useEffect } from 'react'
import UserDetail from '../components/UserDetail'
import { aiMatchUsers } from '../utils/aiMatcher'
import './SmartMatches.css'

function SmartMatches({ user }) {
  const [matches, setMatches] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAIInsights, setShowAIInsights] = useState({})

  useEffect(() => {
    loadMatches()
  }, [user])

  const loadMatches = () => {
    setIsAnalyzing(true)
    
    // Simulate AI processing time
    setTimeout(() => {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const otherUsers = allUsers.filter(u => u.id !== user.id)
      
      const userMatches = otherUsers
        .map(otherUser => aiMatchUsers(user, otherUser))
        .filter(m => m.allMatches.length > 0)
        .sort((a, b) => {
          // Sort by compatibility score first, then by match score
          if (b.compatibilityScore !== a.compatibilityScore) {
            return b.compatibilityScore - a.compatibilityScore
          }
          return b.matchScore - a.matchScore
        })

      setMatches(userMatches)
      setIsAnalyzing(false)
    }, 800) // Simulate AI processing delay
  }

  const toggleAIInsights = (userId) => {
    setShowAIInsights(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }))
  }

  const getCompatibilityColor = (score) => {
    if (score >= 80) return '#4caf50'
    if (score >= 60) return '#4a90e2'
    if (score >= 40) return '#ff9800'
    return '#999'
  }

  const getCompatibilityLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Great'
    if (score >= 40) return 'Good'
    return 'Fair'
  }

  return (
    <div className="smart-matches">
      <div className="smart-matches-header">
        <div className="header-content">
          <div>
            <h1>🤖 AI-Powered Smart Matches</h1>
            <p>Advanced AI analyzes profiles to find your perfect skill exchange partners</p>
          </div>
          {isAnalyzing && (
            <div className="ai-analyzing">
              <span className="ai-spinner">⚙️</span>
              <span>AI Analyzing...</span>
            </div>
          )}
        </div>
      </div>

      {isAnalyzing ? (
        <div className="ai-loading">
          <div className="ai-loading-content">
            <div className="ai-brain">🧠</div>
            <h3>AI is analyzing profiles...</h3>
            <p>Finding the best matches based on skill compatibility, learning goals, and exchange potential</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      ) : matches.length === 0 ? (
        <div className="no-matches">
          <div className="ai-icon">🤖</div>
          <p>No matches found. Add skills to your profile to find matches!</p>
          <p className="ai-suggestion">AI Tip: The more skills you add, the better matches we can find!</p>
        </div>
      ) : (
        <>
          <div className="ai-summary">
            <span className="ai-badge">✨ AI Found {matches.length} Smart Match{matches.length > 1 ? 'es' : ''}</span>
          </div>
          <div className="matches-grid">
            {matches.map((match, idx) => (
              <div key={match.user.id} className="match-card-smart">
                <div className="match-rank">#{idx + 1}</div>
                
                <div className="ai-compatibility-score">
                  <div 
                    className="compatibility-circle"
                    style={{ 
                      background: `conic-gradient(${getCompatibilityColor(match.compatibilityScore)} 0% ${match.compatibilityScore}%, #e0e0e0 ${match.compatibilityScore}% 100%)`
                    }}
                  >
                    <div className="compatibility-inner">
                      <span className="compatibility-value">{match.compatibilityScore}%</span>
                      <span className="compatibility-label">{getCompatibilityLabel(match.compatibilityScore)}</span>
                    </div>
                  </div>
                </div>

                <div className="match-user-info">
                  <div className="match-avatar">
                    {match.user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3>{match.user.name}</h3>
                  {match.user.location && (
                    <p className="match-location">📍 {match.user.location}</p>
                  )}
                </div>

                <div className="ai-explanation-box">
                  <div className="ai-icon-small">🤖</div>
                  <p className="ai-explanation-text">{match.aiExplanation}</p>
                </div>

                <div className="match-skills-section">
                  <div className="skills-header">
                    <span>Exact Matches ({match.exactMatches.length})</span>
                  </div>
                  <div className="match-skills-list">
                    {match.exactMatches.map((m, i) => (
                      <div key={i} className="match-skill-item">
                        {m.type === 'you_teach' ? (
                          <span className="match-skill-badge teach exact">
                            <span className="badge-icon">✓</span>
                            You teach: {m.skill}
                          </span>
                        ) : (
                          <span className="match-skill-badge learn exact">
                            <span className="badge-icon">✓</span>
                            They teach: {m.skill}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {match.relatedMatches.length > 0 && (
                    <>
                      <div className="skills-header related">
                        <span>AI Suggested ({match.relatedMatches.length})</span>
                      </div>
                      <div className="match-skills-list">
                        {match.relatedMatches.slice(0, 3).map((m, i) => (
                          <div key={i} className="match-skill-item">
                            <span className="match-skill-badge related">
                              <span className="badge-icon">💡</span>
                              {m.skill}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button
                  className="ai-insights-btn"
                  onClick={() => toggleAIInsights(match.user.id)}
                >
                  {showAIInsights[match.user.id] ? 'Hide' : 'Show'} AI Insights →
                </button>

                {showAIInsights[match.user.id] && (
                  <div className="ai-insights-panel">
                    <h4>🤖 AI Recommendations</h4>
                    <ul className="ai-recommendations">
                      {match.aiRecommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  className="connect-match-btn"
                  onClick={() => setSelectedUser(match.user)}
                >
                  Connect & Message →
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedUser && (
        <UserDetail
          user={user}
          otherUser={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={loadMatches}
        />
      )}
    </div>
  )
}

export default SmartMatches

