class Track < ActiveRecord::Base
  validates :name, presence: true
  validates :desc, presence: true

  has_many :sections

  mount_uploader :image, ImageUploader

  def serializable_hash(options)
    super({
      except: [:created_at, :updated_at, :track_type]
    }.merge(options))
  end
end
