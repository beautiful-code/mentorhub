// Track#view JS functions

$(function() {
  if (typeof PageConfig !== "undefined") {
    if (typeof PageConfig.track !== "undefined") {
      var self = this;

      self.track = PageConfig.track;
      self.trackContainer = $("#section_index .track_info");
      self.trackShowHtml = $("script#show_track_data").html();
      self.trackTemplate = Handlebars.compile(self.trackShowHtml);

      self.sections = PageConfig.track.sections ? PageConfig.track.sections : [];
      self.sectionContainer = $("#section");
      self.sectionShowHtml = $("script#show_section").html();
      self.sectionFormHtml = $("script#section_form").html();
      self.resourceFormHtml = $("script#resource_form").html();
      self.sectionTemplate = Handlebars.compile(self.sectionShowHtml);
      self.sectionFormTemplate = Handlebars.compile(self.sectionFormHtml);
      self.resourceFormTemplate = Handlebars.compile(self.resourceFormHtml);

      self.hideLoadingSectionsScreen = function(){
        setTimeout(function() {
          self.sectionContainer.find(".loading-sections").hide("slow");
        }, 400);
      }

      self.registerAddResourceListener = function(element) {
        var $element = $(element);

        $element.find(".add_resource_btn#add_field").click(function(e) {
          e.preventDefault();
          $element.find("#resources").append(self.resourceFormTemplate({}));
          self.registerRemoveResourceListener($element);
          return false;
        });
      };

      self.registerRemoveResourceListener = function(element) {
        $(element).find("#resources .form-inline .remove").each(function(i, resource) {
          $(resource).click(function(e) {
            e.preventDefault();
            $(this).parent().remove();
            return false;
          });
        });
      };

      self.trackContainer.on("click",".content_cover .edit-track", function(e) {
        e.preventDefault();
        var currentTrack = Object.assign({}, self.track);
        currentTrack.editable = true;
        self.trackContainer.html(self.trackTemplate(currentTrack));
        return false;
      });

      self.buildTrackData = function() {
        var $form = self.trackContainer.find("form");
        var image = $form.find("#image")[0];
        var params = new FormData();
        params.append('track_template[name]', $form.find("#name").val());
        params.append('track_template[desc]', $form.find("#desc").val());

        if (image.files[0]) {
          params.append('track_template[image]', image.files[0]);
        }

        return params;
      };

      self.trackContainer.on("click",".content_cover .update-track", function(e) {
        e.preventDefault();
        self.updateTrack(self.buildTrackData());
        return false;
      });

      self.trackContainer.on("click",".content_cover .create-track", function(e) {
        e.preventDefault();
        self.createTrack(self.buildTrackData());
        return false;
      });

      self.createTrack = function(params) {
        self.trackAjax({
          type: "POST",
          url: "/track_templates",
          params: params
        });
      };

      self.updateTrack = function(params) {
        self.trackAjax({
          type: "PUT",
          url: "/track_templates/" + self.track.id,
          params: params
        });
      };

      self.trackAjax = function(request) {
        $.ajax({
          type: request.type,
          url: request.url,
          data: request.params,
          cache: false,
          contentType: false,
          processData: false,
        }).done(function(response) {
          if (request.type == "POST") {
            window.history.pushState({},"", response.track_template.id);
          }

          setTimeout(function() {
            self.sectionContainer.find(".loading-sections").hide("slow");
          }, 620);

          self.track = response.track_template;
          self.trackContainer.html(self.trackTemplate(response.track_template));

          self.hideLoadingSectionsScreen();
        }).complete(function(response) {
          if (response.status == 422) {
            if(response.responseJSON.errors) {
              var $form = self.trackContainer.find("form");

              for (errorField in response.responseJSON.errors) {
                var $parent = $form.find("#" + errorField).parent();
                $parent.addClass("has-error");
                $parent.find(".help-block").html(
                  response.responseJSON.errors[errorField].join(", ")
                );
              }
            }
          }
        });
      };

      self.trackContainer.on("click",".content_cover .cancel-edit", function(e) {
        e.preventDefault();
        self.trackContainer.html(self.trackTemplate(self.track))
        return false;
      });

      self.getSection = function(sectionId) {
        return (
          self.sections.find(function(section) {
            return section.id == sectionId;
          })
        );
      };

      self.updateSectionData = function(section) {
        var index = self.sections.findIndex(function(sec) {
          return sec.id == section.id;
        });

        self.sections[index] = section;
      };

      self.getSectionElement = function(sectionId) {
        return (
          self.sectionContainer.find("div[data-section-id]").toArray().find(
            function(element) {
              return element.getAttribute("data-section-id") == sectionId;
            }
          )
        );
      };

      self.deleteSection = function(sectionId, $element) {
        $.ajax({
          type: "DELETE",
          url: "/track_templates/" + self.track.id + "/section_templates/" + sectionId,
        }).done(function(response) {
          $element.remove();
        }).complete(function(response) {
          //TODO
        });
      };

      self.updateSection = function(params, $element) {
        self.sectionAjax({
          type: "PUT",
          url: "/track_templates/" + self.track.id + "/section_templates/" + params.section.id,
          params: params
        }, $element);
      };

      self.createSection = function(params, $element) {
        self.sectionAjax({
          type: "POST",
          url: "/track_templates/" + self.track.id + "/section_templates",
          params: params
        }, $element);
      };

      self.sectionAjax = function(request, $element) {
        $.ajax({
          type: request.type,
          url: request.url,
          data: request.params
        }).done(function(response) {
          if (request.type == "POST") {
            self.sections.push(response.section);
          } else {
            self.updateSectionData(response.section);
          }
          self.showSectionCardAndRegisterListeners(response.section.id, $element);
        }).complete(function(response) {
          if (response.status == 422) {
            if(response.responseJSON.errors) {
              var $form = $element.find("form");
              for (errorField in response.responseJSON.errors) {
                var $parent = $form.find("#" + errorField).parent();
                $parent.addClass("has-error");
                $parent.find(".help-block").html(
                  response.responseJSON.errors[errorField].join(", ")
                );
              }
            }
          }
        });
      };

      self.showSectionCardAndRegisterListeners = function(sectionId, $element) {
        var section = self.getSection(sectionId);
        $element.replaceWith(self.sectionTemplate(section));

        var newElement = self.getSectionElement(section.id);
        self.registerEditEventListener(newElement);
      };

      self.registerSubmitEventListener = function(element, newSection) {
        var $element = $(element);
        newSection = newSection || false;
        var sectionId = newSection ? null : parseInt($element.attr("data-section-id"));

        $element.find(".btn_save input.cancel-edit").click(function(e) {
          e.preventDefault();

          if(newSection) {
            $element.remove();
          } else {
            self.showSectionCardAndRegisterListeners(sectionId, $element);
          }

          return false;
        });

        $element.find(".btn_save input.track-post").click(function(e) {
          e.preventDefault();

          var $form = $element.find("form");
          var params = {
            title: $form.find("#title").val(),
            content: $form.find("#content").val(),
            resources: []
          };

          $form.find(".resources .form-inline").each(function(i, resource) {
            resource = $(resource);

            params.resources.push({
              text: resource.find(".text").val(),
              url: resource.find(".url").val()
            });
          });

          if (newSection) {
            self.createSection({section: params}, $element);
          } else {
            params.id = sectionId;
            self.updateSection({section: params}, $element);
          }

          return false;
        });
      };

      self.registerEditEventListener = function(element) {
        var $element = $(element);

        $element.find(".edit-section").click(function(e) {
          e.preventDefault();
          var thisSection = self.getSection(parseInt($element.attr("data-section-id")));
          $element.replaceWith(self.sectionFormTemplate(thisSection));

          var newElement = self.getSectionElement(thisSection.id);
          self.registerAddResourceListener(newElement);
          self.registerRemoveResourceListener(newElement);
          self.registerSubmitEventListener(newElement);

          return false;
        });

        $element.find(".delete-section").click(function(e) {
          e.preventDefault();
          var thisSection = self.getSection(parseInt($element.attr("data-section-id")));
          var msg = "Are you sure you want to delete the section with title '";
          msg = msg + thisSection.title + "'?";

          if(window.confirm(msg)) { self.deleteSection(thisSection.id, $element); }
          return false;
        });
      };

      setTimeout(function() {
        self.trackContainer.find(".loading-track").hide("slow");
      }, 220);

      self.trackContainer.append(self.trackTemplate(self.track));

      // Display the persisted sections
      if (PageConfig.track.sections == null || PageConfig.track.sections.length < 1) {
        self.hideLoadingSectionsScreen();
      }
      else {
        $.each(PageConfig.track.sections, function(i, section) {
          var sectionHtml = self.sectionTemplate(section);
          self.hideLoadingSectionsScreen();
          self.sectionContainer.append(sectionHtml);
        });
      }

      // Runs only once
      $.each(self.sectionContainer.find(".section_each"), function(i, element) {
        self.registerEditEventListener(element);
      });

      // Add a new section button
      $("#section_index .add_exercise_btn a").click(function(e) {
        e.preventDefault();
        self.sectionContainer.append(self.sectionFormTemplate({newSection: true}));

        var addExerciseForms = self.sectionContainer.find(".add_exercise");
        var noOfForms = addExerciseForms.length;
        var lastForm = addExerciseForms[noOfForms - 1];

        self.registerAddResourceListener(lastForm);
        self.registerRemoveResourceListener(lastForm);
        self.registerSubmitEventListener(lastForm, true);

        return false;
      });

    }
  }
});
