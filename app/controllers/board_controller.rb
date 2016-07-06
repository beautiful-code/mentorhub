class BoardController < ApplicationController
  # before_action :authenticate_user!

  def index
    @mentoring_tracks = TrackInstance.where(mentor_id: current_user.id)
    @learning_tracks = MentoringTrack.where(mentee_id: current_user.id)
  end

  def mock
    options = {
        'learning_tracks': {
            'GIT': {
                'id': 4,
                'deadline': nil,
                'image_url': 'http://localhost:3000/angular/assets/images/git.png',
                'mentor': {
                    'name': 'P G',
                    'id': 1
                },
                'section_interactions': [
                    {
                        'id': 1,
                        'title': 'Commit changes, history and gitignore',
                        'content': "Add files and tracking changes.\nAdd files to do-not-track list using .gitignore",
                        'resources': [
                            {
                                'text': 'Video (3:33 to 8:35)',
                                'url': 'https://www.youtube.com/watch?v=Y9XZQO1n_7c'
                            },
                            {
                                'text': 'Exercise files',
                                'url': 'https://drive.google.com/folderview?id=0B1PtuCWpbEdodnV1M3pTZUhHUWM&usp=sharing '
                            }
                        ],
                        'track_instance_id': 4,
                        'state': 'new',
                        'mentee_comment': nil,
                        'todos': []
                    }
                ]
            }
        }
    }

    render :json => options
  end
end