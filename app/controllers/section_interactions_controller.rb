class SectionInteractionsController < ApplicationController

  def edit
    @section_interaction = SectionInteraction.find(params[:id])
    session[:return_to] = request.referer
  end

  def update
    @section_interaction = SectionInteraction.find(params[:id])
    if @section_interaction.update(section_interaction_params)
      redirect_to session.delete(:return_to)
    else
      render 'edit'
    end
  end

  private

  def section_interaction_params
    params.fetch(:section_interaction, {}).permit(:title, :goal, :content, :code_url)
  end
end
