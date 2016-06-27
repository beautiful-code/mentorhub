class Section < ActiveRecord::Base
  validates :title, presence: true
  #validates :goal, presence: true
  #validates :content, presence: true
  #validates :code_url, presence: true

  belongs_to :track

  serialize :resources, Array
end
