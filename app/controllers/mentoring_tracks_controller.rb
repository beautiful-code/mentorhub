class MentoringTracksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_organization
  before_action :set_track, only: [:show]

  def index
    @mentoring_tracks = JSON.parse(current_user.mentoring_tracks.to_json)
    @tracks = @organization.track_templates
    @users = @organization.users - [current_user]
    @mentor_requests = current_user.mentor_request.where(
      state: 'new'
    )
  end

  def new
    @tracks = @organization.track_templates
    @current_user = current_user
    @users = @organization.users - [current_user]
    @mentor_requests = current_user.mentor_request.where(
      state: 'new'
    )
  end

  def create
    track_template = TrackTemplate.find(params[:id])
    ActiveRecord::Base.transaction do
      @track = Track.create!(options_for_track(track_template))
      create_section_interactions(@track)
    end
    render json: { msg: 'success', track: @track }, status: 200
  end

  def show
    @section_interactions = @track.section_interactions.order(:id)
                                  .preload(:todos)
    @section_interaction = SectionInteraction.new
  end

  private

  def set_organization
    @organization = current_user.organization
  end

  def set_track
    @track = if params[:id].present?
               Track.find(params[:id])
             else
               Track.new(track_params)
             end
  end

  def options_for_track(track_template)
    options = track_template.dup.attributes.except(
      'type',
      'id',
      'organization_id',
      'user_id'
    )
    options.merge!(
      mentor_id: current_user.id,
      remote_image_url: track_template.image_url,
      mentee_id: params[:mentee][:id],
      deadline: params[:deadline],
      track_template_id: track_template.id,
      type: track_template.type.gsub('Template', '')
    )
  end

  def create_section_interactions(track)
    params[:sections].each do |section|
      options = section.except(
        'track_template_id', 'id',
        'editable', 'newRecord',
        'newSectionInteraction'
      )
      options[:type] = "#{track.type.gsub('Track', '')}SectionInteraction"
      track.section_interactions.create!(options.permit!)
    end
  end
end
