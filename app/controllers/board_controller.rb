class BoardController < ApplicationController
  # before_action :authenticate_user!

  def index
    @mentoring_tracks = TrackInstance.where(mentor_id: current_user.id)
    @learning_tracks = MentoringTrack.where(mentee_id: current_user.id)
  end

  def mock
    options = {
        your_exercises: {
            html: {
                deadline: '2016-10-01 00:00:00',
                mentor: 'Gabbar Singh',
                img_src: 'http://localhost:3000/angular/assets/images/html5.png',
                exercises: [
                    {
                        name: 'Some Exercise',
                        description: 'a long description of exercise',
                        resources: [
                            {
                                link: 'https://www.google.com',
                                text: 'Search on your own'
                            }
                        ],
                        submission: '',
                        tasks: [
                            'Chill',
                            'Cool off'
                        ]
                    }
                ]
            }
        }
    }

    render :json => options
  end
end