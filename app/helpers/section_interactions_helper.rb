module SectionInteractionsHelper
  def create_notification_for section_interaction
    subscriber_id = if section_interaction.mentee_id == current_user.id
                      section_interaction.mentor_id
                    else
                      section_interaction.mentee_id
                    end

    options = {
      subscriber_id: subscriber_id,
      notified_by_id: current_user.id
    }

    section_interaction.notifications.create!(options)
  end
end
