class MentoringRequestsController < ApplicationController
  before_action :set_mentoring_request
  def create
    if @mentoring_request.save
      InviteMailer.send_request_to_mentor(
        current_user,
        User.where(id: @mentoring_request.mentor_id).first,
        TrackTemplate.where(id: @mentoring_request.track_template_id).first
      ).deliver_now
      render json: { msg: 'success' }, status: 200
    else
      render json: { msg: 'error' }, status: 422
    end
  end

  def update
    if @mentoring_request.update(mentoring_request_params)
      render json: { msg: 'success',
                     mentoring_request: @mentoring_request }, status: 200
    else
      render json: {
        msg: 'error',
        errors: @mentoring_request.errors,
        mentoring_request: @mentoring_request
      }, status: 422
    end
  end

  private

  def mentoring_request_params
    params.fetch(:mentoring_request, {}).permit(
      :track_template_id, :mentee_id, :mentor_id, :state
    )
  end

  def set_mentoring_request
    @mentoring_request = if params[:id].present?
                           MentoringRequest.find(params[:id])
                         else
                           MentoringRequest.new(mentoring_request_params)
                         end
  end
end
