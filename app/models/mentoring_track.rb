class MentoringTrack < ActiveRecord::Base
  has_many :track_instances
  belongs_to :mentee, class_name: 'User', foreign_key: :mentee_id
end
