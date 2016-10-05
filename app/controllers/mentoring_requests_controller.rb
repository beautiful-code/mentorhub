class MentoringRequestsController < ApplicationController
  before_action :set_mentoring_request

  def create
    if valid_request?
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
    else
      render json: { msg: 'request already sent' }, status: 422
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

  def valid_request?
    ret = true

    current_request_attributes = @mentoring_request.attributes.extract!(
      'state', 'mentee_id', 'mentor_id'
    )

    current_user.mentee_request.each do |request|
      ret = false if request.attributes.extract!(
        'state', 'mentee_id', 'mentor_id'
      ).eql? current_request_attributes
    end

    ret
  end

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
