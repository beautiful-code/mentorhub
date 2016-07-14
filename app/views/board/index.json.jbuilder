json.mentoring_tracks do
  @mentoring_tracks.each do |ti|
    json.set! ti.mentee.id do
      json.call(ti.mentee, :name, :image)
      json.learning_tracks(ti.mentee.mentoring_tracks) do |m_track|
        m_track.tracks.each do |t|
          next unless t.mentor_id == current_user.id
          json.extract! t, :name, :deadline, :image
          json.section_interactions t.section_interactions.each do |si|
            json.extract!(si,
                          :id,
                          :title,
                          :content,
                          :resources,
                          :track_id,
                          :state,
                          :mentee_notes)
            json.todos si.todos.each do |todo|
              json.extract!(todo,
                            :id,
                            :content,
                            :section_interaction_id,
                            :state)
            end
          end
        end
      end
    end
  end
end

json.learning_tracks @learning_tracks.each do |m_track|
  m_track.tracks.each do |ti|
    json.set! ti.name do
      json.extract! ti, :deadline, :image
      json.section_interactions ti.section_interactions.each do |si|
        json.extract!(si,
                      :id,
                      :title,
                      :content,
                      :resources,
                      :track_id,
                      :state,
                      :mentee_notes)
        json.todos si.todos.each do |todo|
          json.extract! todo, :id, :content, :section_interaction_id, :state
        end
      end
      json.mentor do
        json.call(ti.mentor, :name, :id, :image)
      end
    end
  end
end
