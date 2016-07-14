class DropMentoringTrackIdAndAddMenteeIdAndDescToTracks < ActiveRecord::Migration
  def change
    remove_column :tracks, :mentoring_track_id
    remove_column :section_templates, :code_url
    remove_column :section_templates, :enabled

    add_column :tracks, :mentee_id, :integer
    add_column :tracks, :desc, :text

    change_column :section_interactions, :resources, :text
    change_column :section_templates, :resources, :text
  end
end
