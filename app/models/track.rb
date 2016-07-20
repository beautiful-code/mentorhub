class Track < ActiveRecord::Base
  has_many :section_interactions
  belongs_to :mentor, foreign_key: :mentor_id, class_name: 'User'
  belongs_to :mentee, foreign_key: :mentee_id, class_name: 'User'

  validates :name, presence: true
  validates :desc, presence: true
  validates :type, presence: true

  mount_uploader :image, ImageUploader

  def serializable_hash(options)
    super({
      except: [:created_at, :updated_at, :type]
    }.merge(options))
  end

  def incomplete_section_interactions
    section_interactions.where('state != ?', 'section_completed')
                        .order('id ASC')
  end

  def recent_incomplete_section_interactions
    return [] if incomplete_section_interactions.blank?
    ret = []

    incomplete_section_interactions.each_with_index do |section_interaction, i|
      if current_user == self.mentor
        if i.zero? && section_interaction.new?
          ret = []
        elsif i.zero? && !section_interaction.new?
          ret = [section_interaction]
          next
        end
        section_interaction.new? ? break : (ret << section_interaction)

      else
        if i.zero?
          ret = [section_interaction]
          next
        end

        ret.last.new? ? break : (ret << section_interaction)
      end
    end
    ret
  end
end
