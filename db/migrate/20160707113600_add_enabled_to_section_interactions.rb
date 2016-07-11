class AddEnabledToSectionInteractions < ActiveRecord::Migration
  def change
     add_column :section_interactions, :enabled, :boolean
  end
end
