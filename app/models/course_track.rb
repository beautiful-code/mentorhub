class CourseTrack < Track
  has_many :course_section_interactions, foreign_key: :track_id
end
