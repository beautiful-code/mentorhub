class AddImageToTrackInstances < ActiveRecord::Migration
  def change
    add_column :track_instances, :image, :string
  end
end
