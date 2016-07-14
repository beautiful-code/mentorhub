class ExerciseSectionInteraction < SectionInteraction
  belongs_to :exercise_track, foreign_key: :track_id

  alias_method :section_interactions, :exercise_section_interactions
end
