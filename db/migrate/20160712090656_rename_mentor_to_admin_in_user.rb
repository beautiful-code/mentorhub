class RenameMentorToAdminInUser < ActiveRecord::Migration
  def change
    rename_column :users, :mentor, :admin
  end
end
