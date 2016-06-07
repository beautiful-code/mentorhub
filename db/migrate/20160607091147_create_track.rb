class CreateTrack < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.string :name
      t.string :type

      t.timestamps
    end
  end
end
