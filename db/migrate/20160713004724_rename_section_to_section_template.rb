class RenameSectionToSectionTemplate < ActiveRecord::Migration
  def change
    rename_table :sections, :section_templates
  end
end
