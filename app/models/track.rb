class Track < ActiveRecord::Base
  validates :name, presence: true
  validates :desc, presence: true

  has_many :sections

  mount_uploader :image, ImageUploader
end
