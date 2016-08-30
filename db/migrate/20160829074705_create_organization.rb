class CreateOrganization < ActiveRecord::Migration[5.0]
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :email_domain

      t.timestamps
    end
  end
end
