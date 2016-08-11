class Track < ApplicationRecord
  has_many :section_interactions
  belongs_to :mentor, foreign_key: :mentor_id, class_name: 'User'
  belongs_to :mentee, foreign_key: :mentee_id, class_name: 'User'

  validates :name, presence: true
  validates :desc, presence: true
  validates :type, presence: true

  mount_uploader :image, ImageUploader

  def serializable_hash(options)
    options ||= {}

    super({
      except: [:created_at, :updated_at, :type, :image],
      methods: [
        :image_url, :recent_incomplete_section_interactions,
        :progress, :expected_progress
      ]
    }.merge(options))
  end

  def incomplete_section_interactions
    section_interactions.where('state != ?', 'section_completed')
                        .order('created_at ASC')
  end

  def recent_incomplete_section_interactions
    return [] if incomplete_section_interactions.blank?
    ret = []
    incomplete_section_interactions.each_with_index do |section_interaction, i|
      if i.zero?
        ret = [section_interaction]
        next
      end

      ret.last.new? ? break : (ret << section_interaction)
    end
    ret
  end

  def image_url
    image.try(:url) || image.try(:image).try(:url)
  end

  def progress
    no_of_s = section_interactions.count
    no_of_s_done = section_interactions.where(state: 'section_completed').count
    res = ((no_of_s_done.to_f / no_of_s.to_f) * 100).round(2)
    !res.nan? && res.finite? ? res : 0
  end

  def expected_progress
    deadline = created_at + 10.days
    no_of_days = ((deadline.to_date) - (created_at.to_date)).to_i
    remaining_days = ((deadline.to_date) - (Time.now.to_date)).to_i
    res = ((100 / no_of_days.to_f) * (remaining_days - 1)).round(2)
    !res.nan? && res.finite? ? res : 0
  end
end
