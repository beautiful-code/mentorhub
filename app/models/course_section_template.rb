class CourseSectionTemplate < SectionTemplate
  belongs_to :course_track_template, foreign_key: :track_template_id
end
