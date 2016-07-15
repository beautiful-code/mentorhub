class SectionInteractionsController < ApplicationController
  before_action :authenticate_user!

  def create
    track_instance = Track.find(params[:track_id])
    section_interaction = track_instance.section_interactions
                                        .new(section_interaction_params)

    if section_interaction.save
      render json: { msg: 'success', section_interaction: section_interaction },
        status: 200
    end
  end

  def edit
    @section_interaction = SectionInteraction.find(params[:id])
  end

  def update
    @section_interaction = SectionInteraction.find(params[:id])

    if @section_interaction.update(section_interaction_params)
      render json: { msg: 'success',
                     section_interaction: @section_interaction }, status: 200
    else
      render json: { msg: 'error', errors: @section_interaction.errors,
                     section_interaction: @section_interaction }, status: 422
    end
  end

  private

  def section_interaction_params
    JSON.parse(params.fetch(:section_interaction, '{}'))
  end
end
