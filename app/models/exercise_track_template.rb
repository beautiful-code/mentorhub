class ExerciseTrackTemplate < TrackTemplate
  has_many :exercise_section_templates, foreign_key: :track_template_id

  alias_method :section_templates, :exercise_section_templates
end
