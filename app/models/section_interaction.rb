class SectionInteraction < ActiveRecord::Base
  has_many :todos
  belongs_to :track_instance

  serialize :resources, Hash

end
