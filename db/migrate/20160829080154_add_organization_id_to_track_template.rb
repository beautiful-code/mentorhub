class AddOrganizationIdToTrackTemplate < ActiveRecord::Migration[5.0]
  def change
    add_column :track_templates, :organization_id, :integer
  end
end
