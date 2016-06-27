class TodosController < ApplicationController

  def new
    @todo = Todo.new
  end

  def create
    @todo = Todo.new(todo_params)
    @todo.section_interaction_id = params[:todo][:section_interaction_id]
    @todo.save
    redirect_to :back
  end

  private

  def todo_params
    params.require(:todo).permit(:content, :section_interaction_id)
  end
end
