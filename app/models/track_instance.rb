class TrackInstance < ActiveRecord::Base
  has_many :section_interactions
  belongs_to :mentoring_track
end
