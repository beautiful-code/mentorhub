class CourseTrackTemplate < TrackTemplate
  has_many :course_section_templates, foreign_key: :track_template_id
  alias_method :section_templates, :course_section_templates
end
