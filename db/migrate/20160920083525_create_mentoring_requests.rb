class CreateMentoringRequests < ActiveRecord::Migration[5.0]
  def change
    create_table :mentoring_requests do |t|
      t.integer :mentor_id
      t.integer :mentee_id
      t.string :state

      t.timestamps
    end
  end
end
