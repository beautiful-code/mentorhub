class CreateSectionInteraction < ActiveRecord::Migration
  def change
    create_table :section_interactions do |t|
      t.string :title
      t.string :subtitle
      t.text :content
      t.string :code_url
      t.string :resources

      t.integer :track_instance_id

      t.timestamps
    end
  end
end
