class TrackBroadcastJob < ApplicationJob
  queue_as :default

  def perform(track)
    ActionCable.server.broadcast(
      "track_#{track.id}",
      render_json(track)
    )
  end

  private

  def render_json(track)
    ApplicationController.renderer.render(json: track)
  end
end
