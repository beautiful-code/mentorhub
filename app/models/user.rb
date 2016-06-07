class User < ActiveRecord::Base
  has_many :mentoring_tracks, foreign_key: :mentee_id
  has_many :track_instance, foreign_key: :mentor_id
end
