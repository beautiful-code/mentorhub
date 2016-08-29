module ApplicationHelper
  require 'google/api_client/service'

  def options_for_types
    [['Select type', ''], 'Exercise', 'Course']
  end

  def gravatar_for(user)
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}"
    image_tag(gravatar_url, alt: user.first_name, class: 'gravatar')
  end

  # Given the options, this method determines whether
  # the css class 'active' can be applied to the
  # caller in the sidenav.
  # options[:c] - controller
  # options[:a] - action
  # options[:id] - id of an object
  def active_class(options)
    active =
      (!options[:c] || (options[:c].include? params[:controller])) &&
      (!options[:a] || (options[:a].include? params[:action])) &&
      (!options[:id] || (options[:id].to_s == params[:id]))
    active ? 'selected' : false
  end

  def track_template_active_class(options)
    (options[:c].include? params[:controller]) ? 'active' : ''
  end

  def get_contacts(token, domain)
    client = Google::APIClient.new
    client.authorization.access_token = token
    directory_api = client.discovered_api('admin','directory_v1')
    result = client.execute(
      :api_method => directory_api.users.list,
      :parameters => { 'domain' => domain , 'viewType' => 'domain_public', 'maxResults' => '500', 'fields' => 'users(name,primaryEmail)'}
    )
    result.data.users
  end
end
