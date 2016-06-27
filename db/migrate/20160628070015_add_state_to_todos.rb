class AddStateToTodos < ActiveRecord::Migration
  def change
    add_column :todos, :state, :string
  end
end
