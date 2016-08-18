class LearningTracksController < ApplicationController
  def index
    #@learning_tracks = current_user.learning_tracks
     @learning_tracks = JSON.parse(current_user.learning_tracks.to_json)
  end

  def show
    @track =  Track.find(params[:id])
    @section_interactions = @track.section_interactions.order(:id).preload(:todos)

    @learning_track_data = {
        mentoring_tracks: current_user_mentoring_tracks,
        learning_tracks: current_user_learning_tracks
    }

    respond_to do |format|
      format.html
      format.json { render json: @learning_track_data }
    end
  end

   private

  def current_user_mentoring_tracks
    ret = {}
    current_user.mentees.each do |mentee|
      ret[mentee.id] = {
        name: mentee.name,
        avatar_url: mentee.image,
        learning_tracks: mentee.learning_tracks
      }
    end
    ret
  end

  def current_user_learning_tracks
    ret = {}
    current_user.learning_tracks.each do |l_track|
      ret[l_track.name] = l_track.as_json
      ret[l_track.name]['mentor'] = {
        name: l_track.mentor.name,
        id: l_track.mentor_id,
        avatar_url: l_track.mentor.image
      }
    end

    ret
  end
end
