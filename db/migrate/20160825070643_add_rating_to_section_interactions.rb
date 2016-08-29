class AddRatingToSectionInteractions < ActiveRecord::Migration[5.0]
  def change
    add_column :section_interactions, :rating, :integer
    add_column :section_interactions, :feedback, :text
  end
end
