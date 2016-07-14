class RenameTrackInstanceIdToTrackId < ActiveRecord::Migration
  def change
    rename_column :section_interactions, :track_instance_id, :track_id
  end
end
