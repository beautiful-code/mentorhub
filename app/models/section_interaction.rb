class SectionInteraction < ActiveRecord::Base
  has_many :todos
  belongs_to :track

  validates :title, presence: true
  validates :content, presence: true
  validates :track, presence: true
  validates :type, presence: true

  serialize :resources, Array

  STATES =
    %w(new section_submitted tasks_pending
       review_pending section_completed).freeze

  validates :state, presence: true,
    inclusion: { in: STATES, if: -> { state.present? } }

  state_machine :state, initial: :new do
    event :submit_section do
      transition new: :section_submitted
    end

    event :pending_review do
      transition [:section_submitted, :tasks_pending] => :review_pending
    end

    event :pending_tasks do
      transition [:section_submitted, :review_pending] => :tasks_pending
    end

    event :complete_section do
      transition review_pending: :section_completed,
        if: ->(si) { !si.pending_todos? }
    end
  end

  def pending_todos?
    todo_states = self.todos.pluck(:state).uniq
    todo_states.include?('incomplete') || todo_states.include?('to_be_reviewed')
  end

  def serializable_hash(options)
    options ||= {}

    super({
      except: [:goal, :created_at, :updated_at],
      include: [:todos]
    }.merge(options))
  end

  def self.types
    %w(CourseSectionInteraction ExerciseSectionInteraction)
  end
end
