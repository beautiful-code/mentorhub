class CourseSectionInteraction < SectionInteraction
  belongs_to :course_track, foreign_key: :track_id

  alias_method :section_interactions, :course_section_interactions
end
