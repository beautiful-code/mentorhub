class Organization < ApplicationRecord
  has_many :users
  has_many :track_templates
end
