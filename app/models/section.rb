class Section < ActiveRecord::Base
  belongs_to :track

  validates :title, presence: true
  validates :content, presence: true

  serialize :resources, Array
end
