class MentoringTracksController < ApplicationController

  def new
    session[:mtrack_params] ||= {}
    @mentoring_track = MentoringTrack.new
  end

  def create
    @mentoring_track = MentoringTrack.new(mentoring_track_params)
    session[:mtrack_params][:mentee_id] = params[:mentoring_track][:mentee_id]
    session[:mtrack_params][:track_id] = params[:mentoring_track][:id]
    byebug

    @mentoring_track.current_step = session[:mentoring_track_step]
    @mentoring_track.mentee_id = session[:mtrack_params][:mentee_id]
    @track_id = params[:mentoring_track][:id]
    @mentoring_track.name = Track.find(@track_id).name
    @track = Track.find(@track_id)
    @track_dup = @track.dup
    @track_instance = TrackInstance.create(@track_dup.attributes)
    @track_instance.mentor_id = current_user.id

    if params[:back_button]
      @mentoring_track.previous_step
    elsif @mentoring_track.last_step?
      @mentoring_track.save
    else
      @mentoring_track.next_step
    end
    session[:mentoring_track_step] = @mentoring_track.current_step

    if @mentoring_track.new_record?
      render 'new'
    else
      session[:mentoring_track_step] = session[:mtrack_params] = nil
      redirect_to root_path
    end

  end

  private

  def mentoring_track_params
    params.require(:mentoring_track).permit(:name,:mentee_id)
  end
end
