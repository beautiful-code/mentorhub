class ExerciseSectionInteraction < SectionInteraction
  belongs_to :exercise_track, foreign_key: :track_id
end
