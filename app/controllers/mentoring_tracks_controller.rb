class MentoringTracksController < ApplicationController
  def index
    @mentoring_tracks = MentoringTrack.all
  end

  def new
    session[:mtrack_params] ||= {}
    session[:mentoring_track_step] = nil
    @mentoring_track = MentoringTrack.new
    @tracks = Track.all
    @users = User.all
    @index = Section.count
  end

  def create
    track = Track.find(track_params['id'])

    ActiveRecord::Base.transaction do
      mentoring_track = MentoringTrack.create(mentee_id: mentee_id)

      options = track.dup.attributes.except('desc')
      options.merge(mentor_id: current_user.id, image: track.image)

      t_instance = mentoring_track.track_instances.create(options)
      create_sections(t_instance)
    end

    render json: { msg: 'success' }, status: 200
  end

  private

  def sections_params
    JSON.parse(params.require(:sections))
  end

  def track_params
    params.require(:track).permit!
  end

  def mentee_id
    params.require(:menteeId)
  end

  def create_sections(track_instance)
    sections_params.each do |section|
      options = section.except('id', 'code_url', 'track_id')
      track_instance.section_interactions.create(options)
    end
  end
end
