module ApplicationHelper
  def options_for_types
    [['Select type', ''], 'Exercise', 'Course']
  end

  def gravatar_for(user)
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}"
    image_tag(gravatar_url, alt: user.first_name, class: 'gravatar')
  end

  # Given the options, this method determines whether the css class 'active' can be applied to the caller in the sidenav.
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
end
