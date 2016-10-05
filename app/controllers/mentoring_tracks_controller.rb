class MentoringTracksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_organization
  before_action :set_track, only: [:show]

  def index
    @mentoring_tracks = current_user.mentoring_tracks.where.not(
      'mentor_id = ? AND mentee_id = ?', current_user.id, current_user.id
    )
    @learning_tracks = current_user.learning_tracks
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
    @track = Track.new(options_for_track(track_template))
    ActiveRecord::Base.transaction do
      if valid_track?
        if @track.save
          create_section_interactions(@track)
          render json: { msg: 'success', track: @track }, status: 200
        else
          render json: { msg: 'error', errors: @track.errors }, status: 422
        end
      else
        render json: { msg: 'track present' }, status: 422
      end
    end
  end

  def show
    @section_interactions = @track.section_interactions.order(:id)
                                  .preload(:todos, :questions)
    @section_interaction = SectionInteraction.new
  end

  private

  def valid_track?
    ret = true

    current_track_attributes = @track.attributes.extract!(
      'mentee_id', 'track_template_id'
    )

    current_user.mentoring_tracks.each do |mentoring_track|
      ret = false if mentoring_track.attributes.extract!(
        'mentee_id', 'track_template_id'
      ).eql? current_track_attributes
    end

    ret
  end

  def set_organization
    @organization = current_user.organization
  end

  def set_track
    @track = Track.find(params[:id]) if params[:id].present?
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
        'newSectionInteraction', 'questions'
      )
      options[:type] = "#{track.type.gsub('Track', '')}SectionInteraction"
      si = track.section_interactions.create!(options.permit!)
      section['questions'].each do |question|
        si.questions.create(question: question['question'])
      end
    end
  end
end
