class QuestionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_section_interaction
  before_action :set_questions, except: [:index]

  def create
    if @question.save
      @section_interaction.pending_tasks
      render json: { msg: 'Question created', question: @question }, status: 201
    else
      render json: { msg: 'error', errors: @question.errors }, status: 422
    end
  end

  def update
    if @question.update(question_params)
      render json: { msg: 'Question updated', question: @question }, status: 200
    else
      render json: { msg: 'error', errors: @question.errors }, status: 422
    end
  end

  def destroy
    if @question.destroy
      render json: { msg: 'Question deleted' }, status: 200
    else
      render json: { msg: 'error', errors: @question.errors }, status: 422
    end
  end

  private

  def question_params
    params.fetch(:question, {}).permit(:question, :answer)
  end

  def set_section_interaction
    @section_interaction =
      SectionInteraction.find(params[:section_interaction_id])
  end

  def set_questions
    @question = if params[:id].present?
                  @section_interaction.questions.find(params[:id])
                else
                  @section_interaction.questions.new(question_params)
                end
  end
end
