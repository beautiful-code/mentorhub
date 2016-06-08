class Track < ActiveRecord::Base
  validates :name, presence: true
  validates :track_type, presence: true

  has_many :sections
end
