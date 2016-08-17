class LearningTracksController < ApplicationController
  def index
    #@learning_tracks = current_user.learning_tracks
     @learning_tracks = JSON.parse(current_user.learning_tracks.to_json)
     @learning_tracks.each do |track|
      track['mentor'] = User.find_by_id(track['mentor_id'])
    end
    end

  def show
    @track =  Track.find(params[:id])
    @section_interactions = @track.section_interactions.order(:id).preload(:todos)
  end
end
