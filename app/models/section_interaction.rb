class SectionInteraction < ActiveRecord::Base
  has_many :todos
  belongs_to :track_instance

  validates :title, presence: true
  validates :content, presence: true

  serialize :resources, Hash

  STATES = %w[new section_submitted tasks_pending review_pending section_completed]

  validates :state, presence: true, inclusion: { in: STATES, if: lambda { state.present? }}

  state_machine :state, initial: :new do
    event :submit_section do
      transition :new => :section_submitted
    end

    event :pending_review do
      transition [:section_submitted, :tasks_pending] => :review_pending
    end

    event :pending_tasks do
      transition :review_pending => :tasks_pending
    end

    event :complete_section do
      transition :review_pending => :section_completed, if: lambda {|si| !si.pending_todos? }
    end
  end

  def pending_todos?
    todo_states = self.todos.pluck(:state).uniq
    todo_states.include?("incomplete") || todo_states.include?("to_be_reviewed")
  end
end
