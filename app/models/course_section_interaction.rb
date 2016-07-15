class CourseSectionInteraction < SectionInteraction
  belongs_to :course_track, foreign_key: :track_id
end
