class SectionInteractionBroadcastJob < ApplicationJob
  queue_as :default

  def perform(section_interaction)
    track = section_interaction.track
    ActionCable.server.broadcast(
      "interaction_#{track.mentee_id}_#{track.mentor_id}",
      render_json(section_interaction)
    )
  end

  private

  def render_json(section_interaction)
    track = section_interaction.track

    ApplicationController.renderer.render(
      json: {
        section_interaction: section_interaction,
        track: {
          id: track.id,
          progress: track.progress,
          expected_progress: track.expected_progress
        }
      }
    )
  end
end
