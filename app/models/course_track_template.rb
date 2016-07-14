class CourseTrackTemplate < TrackTemplate
  has_many :course_section_templates, foreign_key: :track_template_id
end
