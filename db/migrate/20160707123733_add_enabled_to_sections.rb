class AddEnabledToSections < ActiveRecord::Migration
  def change
    add_column :sections, :enabled, :boolean, :default => true
  end
end
