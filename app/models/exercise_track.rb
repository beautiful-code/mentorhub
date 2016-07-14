class ExerciseTrack < Track
  has_many :exercise_section_interactions, foreign_key: :track_id
end
