task add_organization_id_to_users: :environment do
  User.update_all(organization_id: 1)
end

task add_organization_id_to_track_templates: :environment do
  TrackTemplate.update_all(organization_id: 1)
end
