class SectionInteractionBroadcastJob < ApplicationJob
  queue_as :default

  def perform(section_interaction)
    ActionCable.server.broadcast(
      "section_interaction_#{section_interaction.id}",
      render_json(section_interaction)
    )
  end

  private

  def render_json(section_interaction)
    ApplicationController.renderer.render(
      json: { section_interaction: section_interaction }
    )
  end
end
