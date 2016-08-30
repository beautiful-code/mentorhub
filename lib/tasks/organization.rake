task add_organization_id_to_users_and_track_templates: :environment do
  User.all.each do |user|
    domain = user.email.split('@')[1].split('.')[0]
    organization = Organization.where(email_domain: domain).first_or_create(name: domain)
    user.update_attributes(organization_id: organization.id)
  end
  TrackTemplate.all.each do |track|
    organization = Organization.where(email_domain: 'beautifulcode').first
    track.update_attributes(organization_id: organization.id)
  end
end
