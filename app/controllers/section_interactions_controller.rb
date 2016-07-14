class SectionInteractionsController < ApplicationController
  before_action :section_interaction_params, only:[:create]

  def create
    @track_instance = TrackInstance.find(params[:id])
    @section_interaction = @track_instance.section_interactions.new(section_interaction_params)
    @section_interaction.enabled = true;
    if @section_interaction.save
      render json: {msg: "success", sectionInteraction: @section_interaction}, status: 200
    end
  end

  def edit
    @section_interaction = SectionInteraction.find(params[:id])
  end

  def update
    @section_interaction = SectionInteraction.find(params[:id])
    render 'edit' unless @section_interaction.update(section_interaction_params)
  end

  private

  def section_interaction_params
    JSON.parse(params.fetch(:section_interaction, []))
  end
end
