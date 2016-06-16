class MentoringTrack < ActiveRecord::Base
  has_many :track_instances
  belongs_to :mentee, class_name: 'User', foreign_key: :mentee_id
  validates :mentee_id, presence: true
  attr_writer :current_step

  def current_step
    @current_step || steps.first
  end

  def steps
    %w[assigning customizing confirming]
  end

  def next_step
    self.current_step = steps[steps.index(current_step)+1]
  end

  def previous_step
    self.current_step = steps[steps.index(current_step)-1]
  end

  def first_step?
    current_step == steps.first
  end

  def last_step?
    current_step == steps.last
  end

end
