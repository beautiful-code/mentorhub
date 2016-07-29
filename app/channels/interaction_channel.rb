class InteractionChannel < ApplicationCable::Channel
  def subscribed
    stream_from "interaction_#{params[:mentee_id]}_#{params[:mentor_id]}"
  end
end
