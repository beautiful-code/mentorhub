class RenameTrackIdToTrackTemplateId < ActiveRecord::Migration
  def change
    rename_column :section_templates, :track_id, :track_template_id
  end
end
