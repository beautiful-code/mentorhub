class DropMentoringTracksTable < ActiveRecord::Migration
  def change
    drop_table :mentoring_tracks
  end
end
