class AddExerciseToSectionInteractions < ActiveRecord::Migration[5.0]
  def change
    add_column :section_interactions, :exercise, :text
  end
end
