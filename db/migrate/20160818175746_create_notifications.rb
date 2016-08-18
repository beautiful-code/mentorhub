class CreateNotifications < ActiveRecord::Migration[5.0]
  def change
    create_table :notifications do |t|
      t.boolean :read, default: false
      t.integer :subscriber_id
      t.integer :notified_by_id
      t.references :section_interaction

      t.timestamps
    end
  end
end
