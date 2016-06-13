class SectionsController < ApplicationController
  before_action :set_track
  before_action :set_section, except: [:index]
  before_action :build_resources, only: [:create, :update]

  def index
    @sections = @track.sections.order("id")
  end

  def create
    if @section.save
      redirect_to track_sections_path, success:"Section created"
    else
      render 'new'
    end
  end

  def update
    if @section.update(section_params)
      redirect_to track_sections_path, success: "Section updated"
    else
      render 'edit'
    end
  end

  private
    def section_params
      params.fetch(:section, {}).permit(:title, :goal, :content, :code_url)
    end

    def set_track
      @track = Track.find(params[:track_id])
    end

    def set_section
      @section = params[:id].present? ? @track.sections.find(params[:id]) : @track.sections.new(section_params)
    end

    def build_resources
      if params[:resources].present?
        @section.resources = Hash[params[:resources][:name].zip params[:resources][:value]].delete_if{ |key, value| value.blank?}
      end
    end
end
