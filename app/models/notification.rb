class Notification < ApplicationRecord
  validates_presence_of :subscriber_id, :notified_by_id, :section_interaction
  belongs_to :section_interaction
end
