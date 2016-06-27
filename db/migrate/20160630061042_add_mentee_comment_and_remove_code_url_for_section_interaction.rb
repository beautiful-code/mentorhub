class AddMenteeCommentAndRemoveCodeUrlForSectionInteraction < ActiveRecord::Migration
  def change
     add_column :section_interactions, :mentee_comment, :text
     remove_column :section_interactions, :code_url, :string
  end
end
