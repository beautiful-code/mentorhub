class TrackTemplate < ApplicationRecord
  validates :name, presence: true
  validates :desc, presence: true
  validates :type, presence: true

  belongs_to :organization
  has_many :section_templates

  mount_uploader :image, ImageUploader

  def serializable_hash(options)
    super({
      except: [:created_at, :updated_at, :track_type]
    }.merge(options))
  end
end
