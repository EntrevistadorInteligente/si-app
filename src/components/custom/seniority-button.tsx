import React from 'react'

const colorsExperienceLevel = {
  Junior: {
    default: 'bg-tags-orange/10 text-tags-orange hover:bg-tags-orange/20',
    selected: 'bg-tags-orange text-white'
  },
  Intermedio: {
    default: 'bg-tags-blue/10 text-tags-blue hover:bg-tags-blue/20',
    selected: 'bg-tags-blue text-white'
  },
  Senior: {
    default: 'bg-primary/10 text-primary hover:bg-primary/20',
    selected: 'bg-primary text-primary-foreground'
  }
}

export type ExperienceLevel = 'Junior' | 'Intermedio' | 'Senior'

type ExperienceLevelButtonProps = {
  level: ExperienceLevel
  isSelected: boolean
  className?: string
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const SeniorityButton = ({ level, isSelected, className, onClick }: ExperienceLevelButtonProps) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${className} ${
      isSelected ? colorsExperienceLevel[level].selected : colorsExperienceLevel[level].default
    }`}
    aria-pressed={isSelected}
  >
    {level}
  </button>
)

export default SeniorityButton
