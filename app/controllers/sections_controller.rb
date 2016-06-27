class SectionsController < ApplicationController
  before_action :set_track
  before_action :set_section, except: [:index]
  before_action :build_resources, only: [:create, :update]

  def index
    @sections = @track.sections.order("id")
  end

  def create
    if @section.save
      render json: {msg: "success", section: @section}, status: 200
    else
      render json: {msg: "error", errors: @section.errors, section: @section}, status: 422
    end
  end

  def update
    if @section.update(section_params)
      redirect_to track_sections_path, success: "Section updated"
    else
      render 'edit'
    end
  end

  def destroy
    @section.destroy
    flash[:success] = "Section deleted"
    redirect_to track_sections_path
  end

  private
    def section_params
      params.fetch(:section, {}).permit(:title, :content)
    end

    def set_track
      @track = Track.find(params[:track_id])
    end

    def set_section
      @section = params[:id].present? ? @track.sections.find(params[:id]) : @track.sections.new(section_params)
    end

    def build_resources
      @section.resources = params[:section].delete(:resources).collect {|_,v| v } if params[:section][:resources].present?
    end
end
