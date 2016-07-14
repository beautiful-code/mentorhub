class TrackTemplate < ActiveRecord::Base
  validates_presence_of :name, :desc, :type

  has_many :section_templates

  mount_uploader :image, ImageUploader

  def serializable_hash(options)
    super({
      except: [:created_at, :updated_at, :track_type]
    }.merge(options))
  end
end
