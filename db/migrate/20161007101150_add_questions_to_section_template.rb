class AddQuestionsToSectionTemplate < ActiveRecord::Migration[5.0]
  def change
    add_column :section_templates, :questions, :string
  end
end
