class AddTrackTemplateIdToMentoringRequests < ActiveRecord::Migration[5.0]
  def change
    add_column :mentoring_requests, :track_template_id, :integer
  end
end
