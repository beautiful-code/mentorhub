class AddExerciseToSectionTemplates < ActiveRecord::Migration[5.0]
  def change
    add_column :section_templates, :exercise, :text
  end
end
