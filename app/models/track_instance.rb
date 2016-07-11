class TrackInstance < ActiveRecord::Base
  has_many :section_interactions
  belongs_to :mentoring_track
  belongs_to :mentor, foreign_key: :mentor_id, class_name: 'User'

  def serializable_hash(options)
    super({
      except: [:created_at, :updated_at, :track_type]
    }.merge(options))
  end

  def mentee
    self.mentoring_track.mentee
  end

  def recent_incomplete_section_interactions
    ret = []
    sis = self.section_interactions.where('state != ?', 'section_completed')
              .order('created_at ASC')
    return [] if sis.blank?

    sis.each_with_index do |si, i|
      (ret << si
       next) if i.zero?

      ret.last.state == 'new' ? break : ret << si
    end

    ret
  end
end
