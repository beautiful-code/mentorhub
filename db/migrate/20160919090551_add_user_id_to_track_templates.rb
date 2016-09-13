class AddUserIdToTrackTemplates < ActiveRecord::Migration[5.0]
  def change
    add_column :track_templates, :user_id, :integer
  end
end
