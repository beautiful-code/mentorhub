class Notification < ApplicationRecord
  validates :subscriber_id, :notified_by_id, presence: true
  belongs_to :section_interaction
end
