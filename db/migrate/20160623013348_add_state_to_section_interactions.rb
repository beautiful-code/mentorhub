class AddStateToSectionInteractions < ActiveRecord::Migration
  def change
    add_column :section_interactions, :state, :string
  end
end
