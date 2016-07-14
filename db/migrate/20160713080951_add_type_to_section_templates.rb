class AddTypeToSectionTemplates < ActiveRecord::Migration
  def change
    add_column :section_templates, :type, :string
  end
end
