class SectionInteractionsController < ApplicationController

  def edit
    @section_interaction = SectionInteraction.find(params[:id])
  end

  def update
    @section_interaction = SectionInteraction.find(params[:id])

    unless @section_interaction.update(section_interaction_params)
      render 'edit'
    end
  end

  private

  def section_interaction_params
    params.fetch(:section_interaction, {}).permit(:title, :goal, :content, :code_url)
  end
end
