class ExerciseTrack < Track
  has_many :exercise_section_interactions, foreign_key: :track_id

  alias section_interactions exercise_section_interactions
end
