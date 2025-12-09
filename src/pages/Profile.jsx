import React, { useState, useEffect } from 'react'
import './Profile.css'

function Profile({ user, setUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    skillsToTeach: user?.skillsToTeach || [],
    skillsToLearn: user?.skillsToLearn || []
  })
  const [newSkillTeach, setNewSkillTeach] = useState('')
  const [newSkillLearn, setNewSkillLearn] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        skillsToTeach: user.skillsToTeach || [],
        skillsToLearn: user.skillsToLearn || []
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddSkillTeach = (e) => {
    e.preventDefault()
    if (newSkillTeach.trim() && !formData.skillsToTeach.includes(newSkillTeach.trim())) {
      setFormData({
        ...formData,
        skillsToTeach: [...formData.skillsToTeach, newSkillTeach.trim()]
      })
      setNewSkillTeach('')
    }
  }

  const handleRemoveSkillTeach = (skill) => {
    setFormData({
      ...formData,
      skillsToTeach: formData.skillsToTeach.filter(s => s !== skill)
    })
  }

  const handleAddSkillLearn = (e) => {
    e.preventDefault()
    if (newSkillLearn.trim() && !formData.skillsToLearn.includes(newSkillLearn.trim())) {
      setFormData({
        ...formData,
        skillsToLearn: [...formData.skillsToLearn, newSkillLearn.trim()]
      })
      setNewSkillLearn('')
    }
  }

  const handleRemoveSkillLearn = (skill) => {
    setFormData({
      ...formData,
      skillsToLearn: formData.skillsToLearn.filter(s => s !== skill)
    })
  }

  const handleSave = () => {
    // Update user in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...formData } : u
    )
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    
    // Update current user
    const updatedUser = { ...user, ...formData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    
    setMessage('Profile updated successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your skills and profile information</p>
        </div>

        {message && (
          <div className="success-message">{message}</div>
        )}

        <div className="profile-card">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell others about yourself..."
                rows="4"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your location (e.g., City, State)"
              />
            </div>
          </div>

          <div className="profile-section">
            <h2>Skills I Can Teach</h2>
            <form onSubmit={handleAddSkillTeach} className="add-skill-form">
              <input
                type="text"
                value={newSkillTeach}
                onChange={(e) => setNewSkillTeach(e.target.value)}
                placeholder="Add a skill you can teach..."
                className="skill-input"
              />
              <button type="submit" className="add-skill-btn">Add</button>
            </form>
            <div className="skills-list">
              {formData.skillsToTeach.map((skill, idx) => (
                <span key={idx} className="skill-tag teach">
                  {skill}
                  <button
                    onClick={() => handleRemoveSkillTeach(skill)}
                    className="remove-skill"
                  >
                    ×
                  </button>
                </span>
              ))}
              {formData.skillsToTeach.length === 0 && (
                <p className="no-skills">No skills added yet</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h2>Skills I Want to Learn</h2>
            <form onSubmit={handleAddSkillLearn} className="add-skill-form">
              <input
                type="text"
                value={newSkillLearn}
                onChange={(e) => setNewSkillLearn(e.target.value)}
                placeholder="Add a skill you want to learn..."
                className="skill-input"
              />
              <button type="submit" className="add-skill-btn">Add</button>
            </form>
            <div className="skills-list">
              {formData.skillsToLearn.map((skill, idx) => (
                <span key={idx} className="skill-tag learn">
                  {skill}
                  <button
                    onClick={() => handleRemoveSkillLearn(skill)}
                    className="remove-skill"
                  >
                    ×
                  </button>
                </span>
              ))}
              {formData.skillsToLearn.length === 0 && (
                <p className="no-skills">No skills added yet</p>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={handleSave} className="save-btn">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

