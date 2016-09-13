class AddTrackTemplateIdToTracks < ActiveRecord::Migration[5.0]
  def change
    add_column :tracks, :track_template_id, :integer
  end
end
