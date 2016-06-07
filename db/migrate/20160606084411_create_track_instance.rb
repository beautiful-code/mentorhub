class CreateTrackInstance < ActiveRecord::Migration
  def change
    create_table :track_instances do |t|
      t.string :name
      t.string :type
      t.integer :mentor_id

      t.integer :mentoring_track_id

      t.timestamps
    end
  end
end
