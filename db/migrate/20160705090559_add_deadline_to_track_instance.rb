class AddDeadlineToTrackInstance < ActiveRecord::Migration
  def change
    add_column :track_instances, :deadline, :datetime
  end
end
