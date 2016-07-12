class RenameTrackToTrackTemplate < ActiveRecord::Migration
  def change
    rename_table :tracks, :track_templates
  end
end
