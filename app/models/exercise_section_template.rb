class ExerciseSectionTemplate < SectionTemplate
  belongs_to :exercise_track_template, foreign_key: :track_template_id
end
