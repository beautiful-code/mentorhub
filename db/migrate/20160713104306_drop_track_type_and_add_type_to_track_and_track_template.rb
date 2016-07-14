class DropTrackTypeAndAddTypeToTrackAndTrackTemplate < ActiveRecord::Migration
  def change
    remove_column :tracks, :track_type
    remove_column :track_templates, :track_type

    add_column :tracks, :type, :string
    add_column :track_templates, :type, :string
  end
end
