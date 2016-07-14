class MentoringTracksController < ApplicationController
  def index
    @mentoring_tracks = current_user.mentoring_tracks
  end

  def new
    @tracks = TrackTemplate.all
    @users = User.all - [current_user]
  end

  def create
    track_template = TrackTemplate.find(track_params['id'])

    ActiveRecord::Base.transaction do
      options = track_template.dup.attributes.except('type')
      options.merge!(
        mentor_id: current_user.id,
        image: track_template.image_url,
        mentee_id: params[:menteeId],
        type: track_template.type.gsub('Template', '')
      )

      track = Track.create(options)
      create_section_interactions(track)
    end

    render json: { msg: 'success' }, status: 200
  end

  def show
    @mentoring_track = MentoringTrack.find(params[:id]);
    @section_interactions = @mentoring_track.track_instances.first.section_interactions.preload(:todos)
  end

  def get_todos
    @section_interaction = SectionInteraction.find(params[:id]);
    render json: {
      todos: @section_interaction.todos
    }
  end

  private

  def sections_params
    JSON.parse(params.require(:sections))
  end

  def track_params
    params.fetch(:track).permit!
  end

  def create_section_interactions(track)
    sections_params.each do |section|
      options = section.except('track_template_id')
      options[:type] = "#{track.type.gsub('Track', '')}SectionInteraction"
      track.section_interactions.create(options)
    end
  end
end
