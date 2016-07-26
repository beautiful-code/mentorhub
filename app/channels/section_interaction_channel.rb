class SectionInteractionChannel < ApplicationCable::Channel
  def subscribed
    stream_from "section_interaction_#{params[:section_interaction]}"
  end

  def unsubscribed
  end
end
