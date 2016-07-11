class TodosController < ApplicationController
  before_action :authenticate_user!
  before_action :set_section_interaction
  before_action :set_todos, except: [:index]

  def index
    todo_list = @section_interaction.todos.all
    render json: { si_title: @section_interaction.title.to_s, todos: todo_list }, status: 200
  end

  def create
    if @todo.save
      render json: { msg: 'Todo created', todo: @todo }, status: 201
    else
      render json: { msg: 'error', errors: @todo.errors }, status: 422
    end
  end

  def update
    if @todo.update(todo_params)
      render json: { msg: 'Todo updated', todo: @todo }, status: 200
    else
      render json: { msg: 'error', errors: @todo.errors }, status: 422
    end
  end

  private

  def todo_params
    params.require(:todo).permit(:content, :section_interaction_id)
  end

  def set_section_interaction
    @section_interaction = SectionInteraction.find(params[:section_interaction_id])
  end

  def set_todos
    @todo = params[:id].present? ? @section_interaction.todos.find(params[:id]) : @section_interaction.todos.new(todo_params)
  end
end
