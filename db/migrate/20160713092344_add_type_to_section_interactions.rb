class AddTypeToSectionInteractions < ActiveRecord::Migration
  def change
    add_column :section_interactions, :type, :string
  end
end
