class TracksController < ApplicationController

  def index
    @tracks = Track.all
  end

  def new
    @track = Track.new
  end

  def create
    @track = Track.new(track_params)
    if @track.save
      redirect_to tracks_path, success: "Track created"
    else
      render 'new'
    end
  end

  def edit
    @track = Track.find(params[:id])
  end

  def update
    @track = Track.find(params[:id])
    if @track.update(track_params)
      redirect_to tracks_path, success: "Track updated"
    else
      render 'edit'
    end
  end


  private
  def track_params
    params.require(:track).permit(:name, :track_type, :image)
  end
end
