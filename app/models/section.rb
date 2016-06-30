class Section < ActiveRecord::Base
  validates :title, presence: true
  validates :content, presence: true

  belongs_to :track

  serialize :resources, Array
end
