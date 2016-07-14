class RenameMenteeCommentToMenteeNotes < ActiveRecord::Migration
  def change
    rename_column :section_interactions, :mentee_comment, :mentee_notes
  end
end
