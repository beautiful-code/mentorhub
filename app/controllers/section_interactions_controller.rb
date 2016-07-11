class SectionInteractionsController < ApplicationController
  def edit
    @section_interaction = SectionInteraction.find(params[:id])
  end

  def update
    @section_interaction = SectionInteraction.find(params[:id])
    render 'edit' unless @section_interaction.update(section_interaction_params)
  end

  private

  def section_interaction_params
    params.fetch(:section_interaction, {}).permit(:title, :goal, :content,
                                                  :state, :mentee_comment)
  end
end
