$(function() {
  var getSectionInteractionIds = function(data) {
    var sectionInteractionIds = [];

    for (var key in data.mentoring_tracks) {
      data.mentoring_tracks[key].learning_tracks.forEach(function(track) {
        track.recent_incomplete_section_interactions.forEach(function(sectionInteraction) {
          sectionInteractionIds.push(sectionInteraction.id);
        });
      });
    };

    for (var key in data.learning_tracks) {
      var track = data.learning_tracks[key];

      track.recent_incomplete_section_interactions.forEach(function(sectionInteraction) {
        sectionInteractionIds.push(sectionInteraction.id);
      });
    };

    return sectionInteractionIds;
  };

  var subscribeToSectionInteraction = function(sectionInteractionId) {
    App.sectionInteraction = App.cable.subscriptions.create(
      {
        channel: 'SectionInteractionChannel',
        section_interaction: sectionInteractionId
      },
      {
        received: function(data) {
          console.dir(JSON.parse(data));
        }
      }
    );
  }

  if (typeof PageConfig !== "undefined") {
    if (typeof PageConfig.boardJson !== "undefined") {
      getSectionInteractionIds(PageConfig.boardJson).forEach(function(sectionInteractionId) {
        subscribeToSectionInteraction(sectionInteractionId);
      });
    }
  }

});
