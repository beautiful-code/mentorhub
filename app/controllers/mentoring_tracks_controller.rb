class MentoringTracksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_track, only: [:show]

  def index
    @mentoring_tracks = JSON.parse(current_user.mentoring_tracks.to_json)
  end

  def new
    @tracks = TrackTemplate.all
    @users = User.all - [current_user]
  end

  def create
    track_template = TrackTemplate.find(params[:id])

    ActiveRecord::Base.transaction do
      options = track_template.dup.attributes.except('type', 'id')
      options.merge!(
        mentor_id: current_user.id,
        remote_image_url: track_template.image_url,
        mentee_id: params[:mentee][:id],
        deadline: params[:deadline],
        type: track_template.type.gsub('Template', '')
      )
      track = Track.create(options)
      create_section_interactions(track)
    end
    render json: { msg: 'success' }, status: 200
  end

  def show
    @section_interactions = @track.section_interactions.order(:id)
                                  .preload(:todos)
    @section_interaction = SectionInteraction.new
  end

  private

  def set_track
    @track = if params[:id].present?
               Track.find(params[:id])
             else
               Track.new(track_params)
             end
  end

  def create_section_interactions(track)
    params[:sections].each do |section|
      options = section.except(
        'track_template_id', 'id',
        'editable', 'newRecord',
        'newSectionInteraction'
      )
      options[:type] = "#{track.type.gsub('Track', '')}SectionInteraction"
      track.section_interactions.create(options.permit!)
    end
  end
end
