class CreateTodo < ActiveRecord::Migration
  def change
    create_table :todos do |t|
      t.text :content

      t.integer :section_interaction_id

      t.timestamps
    end
  end
end
