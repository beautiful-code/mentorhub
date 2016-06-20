class MentoringTracksController < ApplicationController

  def new
    session[:mtrack_params] ||= {}
<<<<<<< HEAD
    session[:mentoring_track_step] = nil
=======
>>>>>>> 47b723ebdb6816c4f1d999ed01bb77c32696d082
    @mentoring_track = MentoringTrack.new
  end

  def create
<<<<<<< HEAD
    session[:mtrack_params] = params[:mentoring_track] unless params[:mentoring_track].blank?
    @mentoring_track = MentoringTrack.new(mentee_id: session[:mtrack_params]["mentee_id"])
    @mentoring_track.current_step = session[:mentoring_track_step]

    if @mentoring_track.current_step == "assigning"
      track = Track.find(params[:mentoring_track][:track_id])
      ti_options = track.dup.attributes.merge({"mentor_id" => current_user.id})
      track_instance = TrackInstance.create(ti_options)

      track.sections.each do |section|
        options = section.dup.attributes.except("track_id").merge({"track_instance_id" => track_instance.id})
        @section_interaction = SectionInteraction.create(options)
      end
        session[:track_instance_id] = track_instance.id
    end

    @track_instance = TrackInstance.find(session[:track_instance_id])
=======
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
>>>>>>> 47b723ebdb6816c4f1d999ed01bb77c32696d082

    if params[:back_button]
      @mentoring_track.previous_step
    elsif @mentoring_track.last_step?
      @mentoring_track.save
    else
      @mentoring_track.next_step
    end
<<<<<<< HEAD

=======
>>>>>>> 47b723ebdb6816c4f1d999ed01bb77c32696d082
    session[:mentoring_track_step] = @mentoring_track.current_step

    if @mentoring_track.new_record?
      render 'new'
    else
<<<<<<< HEAD
      flash[:success] = "#{@track_instance.name} track was added to the mentee #{@mentoring_track.mentee.name}"
      session[:mentoring_track_step] = session[:mtrack_params] = nil
      redirect_to mentoring_tracks_path
    end
  end

  def index
    @mentoring_tracks = MentoringTrack.all
  end

=======
      session[:mentoring_track_step] = session[:mtrack_params] = nil
      redirect_to root_path
    end

  end

  private

  def mentoring_track_params
    params.require(:mentoring_track).permit(:name,:mentee_id)
  end
>>>>>>> 47b723ebdb6816c4f1d999ed01bb77c32696d082
end
