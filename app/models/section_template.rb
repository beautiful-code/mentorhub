class SectionTemplate < ApplicationRecord
  belongs_to :track_template

  validates :title, presence: true
  validates :content, presence: true
  validates :track_template, presence: true
  validates :type, presence: true

  serialize :resources, Array
  serialize :questions, Array
  default_scope { order('id') }

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
