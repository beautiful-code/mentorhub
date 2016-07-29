class RenameTrackInstanceToTrack < ActiveRecord::Migration
  def change
    rename_table :track_instances, :tracks
  end
end
