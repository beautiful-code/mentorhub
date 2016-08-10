class TrackChannel < ApplicationCable::Channel
  def subscribed
    stream_from "track_#{params[:track_id]}"
  end
end
