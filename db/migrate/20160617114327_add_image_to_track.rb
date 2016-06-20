class AddImageToTrack < ActiveRecord::Migration
  def change
    add_column :tracks, :image, :string
  end
end
