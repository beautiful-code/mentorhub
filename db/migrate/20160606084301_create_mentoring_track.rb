class CreateMentoringTrack < ActiveRecord::Migration
  def change
    create_table :mentoring_tracks do |t|
      t.string :name
      t.integer :mentee_id

      t.timestamps
    end
  end
end
