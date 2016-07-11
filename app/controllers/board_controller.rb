class BoardController < ApplicationController
  # before_action :authenticate_user!

  # def index
  #   @mentoring_tracks = TrackInstance.where(mentor_id: current_user.id)
  #   @learning_tracks = MentoringTrack.where(mentee_id: current_user.id)
  # end

  def mock
    options = {
        mentoring_tracks: {
            '1': {
                name: "John",
                avatar_url: "https://lh3.googleusercontent.com/-jWnHlYI_jV4/AAAAAAAAAAI/AAAAAAAAABU/pxgexOgcX80/photo.jpg",
                learning_tracks: [
                    {
                        name: "HTML Fundamentals",
                        deadline: "2016-07-01 10:41:47",
                        image_url: "https://mentorhub-development.s3.amazonaws.com/uploads/track/image/4/HTML5_Badge_512.png",
                        section_interactions: [
                            {
                                id: 11,
                                title: "CSS Basics",
                                content: "Go through the links below and understand the concepts. Getting to know CSS -Types of selectors -Selectors precedence -Combining selectors -Common property values ",
                                resources: [
                                    {
                                        text: "CSS Tutorials #1 - Introduction to CSS and Adding a CSS File to Your HTML",
                                        url: "http://www.youtube.com/watch?v=x9HmYfSN4Gk"
                                    }
                                ],
                                track_instance_id: 5,
                                state: "review_pending",
                                mentee_comment: nil,
                                todos: [
                                    {
                                        id: 1,
                                        content: "This is a task",
                                        section_interaction_id: 11,
                                        state: "incomplete"
                                    },
                                    {
                                        id: 2,
                                        content: "This is another task",
                                        section_interaction_id: 11,
                                        state: "incomplete"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            '2': {
                name: "Joe Johnson",
                avatar_url: "https://lh3.googleusercontent.com/-jWnHlYI_jV4/AAAAAAAAAAI/AAAAAAAAABU/pxgexOgcX80/photo.jpg",
                learning_tracks: [
                    {
                        name: "GIT Fundamentals",
                        deadline: "2016-07-01 10:41:47",
                        image_url: "https://mentorhub-development.s3.amazonaws.com/uploads/track/image/4/HTML5_Badge_512.png",
                        section_interactions: [
                            {
                                id: 11,
                                title: "CSS Basics",
                                content: "Go through the links below and understand the concepts. Getting to know CSS -Types of selectors -Selectors precedence -Combining selectors -Common property values ",
                                resources: [
                                    {
                                        text: "CSS Tutorials #1 - Introduction to CSS and Adding a CSS File to Your HTML",
                                        url: "http://www.youtube.com/watch?v=x9HmYfSN4Gk"
                                    }
                                ],
                                track_instance_id: 5,
                                state: "review_pending",
                                mentee_comment: nil,
                                todos: [
                                    {
                                        id: 1,
                                        content: "This is a task",
                                        section_interaction_id: 11,
                                        state: "incomplete"
                                    },
                                    {
                                        id: 2,
                                        content: "This is another task",
                                        section_interaction_id: 11,
                                        state: "incomplete"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        learning_tracks: {
            'GIT': {
                deadline: "2016-07-01 10:41:47",
                image_url: "https://mentorhub-development.s3.amazonaws.com/uploads/track/image/4/HTML5_Badge_512.png",
                section_interactions: [
                    {
                        id: 1,
                        title: "Commit changes, history and gitignore",
                        content: "Add files and tracking changes. Add files to do-not-track list using .gitignore",
                        resources: [
                            {
                                text: "This is just a text",
                                url: nil
                            },
                            {
                                text: "Exercise files",
                                url: "http://drive.google.com/folderview?id=0B1PtuCWpbEdodnV1M3pTZUhHUWM&usp=sharing "
                            }
                        ],
                        track_instance_id: 4,
                        state: "new",
                        mentee_comment: nil,
                        todos: [

                        ]
                    }
                ],
                mentor: {
                    name: "Jane",
                    id: 1,
                    avatar_url: "https://lh3.googleusercontent.com/-jWnHlYI_jV4/AAAAAAAAAAI/AAAAAAAAABU/pxgexOgcX80/photo.jpg",
                }
            },
            'HTML': {
                deadline: "2016-07-01 10:41:47",
                image_url: "https://mentorhub-development.s3.amazonaws.com/uploads/track/image/4/HTML5_Badge_512.png",
                section_interactions: [
                    {
                        id: 1,
                        title: "Commit changes, history and gitignore",
                        content: "Add files and tracking changes. Add files to do-not-track list using .gitignore",
                        resources: [
                            {
                                text: "This is just a text",
                                url: nil
                            },
                            {
                                text: "Exercise files",
                                url: "http://drive.google.com/folderview?id=0B1PtuCWpbEdodnV1M3pTZUhHUWM&usp=sharing "
                            }
                        ],
                        track_instance_id: 4,
                        state: "new",
                        mentee_comment: nil,
                        todos: [

                        ]
                    }
                ],
                mentor: {
                    name: "Jane",
                    id: 1,
                    avatar_url: "https://lh3.googleusercontent.com/-jWnHlYI_jV4/AAAAAAAAAAI/AAAAAAAAABU/pxgexOgcX80/photo.jpg",
                }
            }
        }
    }

    render :json => options
  end
end