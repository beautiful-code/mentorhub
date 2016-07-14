class SectionTemplate < ActiveRecord::Base
  belongs_to :track_template

  validates_presence_of :title, :content, :track_template, :type

  serialize :resources, Array

  def self.types
    %w(CourseSectionTemplate ExerciseSectionTemplate)
  end

  def enabled
    true
  end

  def serializable_hash(options)
    super({
      except: [:created_at, :updated_at, :type],
      methods: [:enabled]
    }.merge(options))
  end
end
