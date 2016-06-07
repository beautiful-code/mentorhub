class CreateSection < ActiveRecord::Migration
  def change
    create_table :sections do |t|
      t.string :title
      t.string :goal
      t.text :content
      t.string :code_url
      t.string :resources

      t.timestamps
    end
  end
end
