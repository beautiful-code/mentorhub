// Track#view JS functions

$(function() {
  if (typeof PageConfig !== "undefined") {
    if (typeof PageConfig.track !== "undefined") {
      var self = this;

      self.track = PageConfig.track;
      self.sections = PageConfig.track.sections ? PageConfig.track.sections : [];
      self.sectionContainer = $("#section");
      self.sectionShowHtml = $("script#show_section").html();
      self.sectionFormHtml = $("script#section_form").html();
      self.resourceFormHtml = $("script#resource_form").html();
      self.sectionTemplate = Handlebars.compile(self.sectionShowHtml);
      self.sectionFormTemplate = Handlebars.compile(self.sectionFormHtml);
      self.resourceFormTemplate = Handlebars.compile(self.resourceFormHtml);

      self.registerAddResourceListener = function(element) {
        var $element = $(element);

        $element.find(".add_resource_btn").click(function(e) {
          e.preventDefault();
          $(self.resourceFormTemplate({})).insertBefore($element.find(".resources #add_field"));
          return false;
        });
      };

      self.getSection = function(sectionId) {
        return (
          self.sections.find(function(section) {
            return section.id == sectionId;
          })
        );
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

      //TODO: Rushil to write the functionality
      self.deleteSection = function() {
      };

      self.updateSection = function(params, $element) {
        self.sectionAjax({
          type: "PUT",
          url: "/tracks/" + self.track.id + "/sections/" + params.section.id,
          params: params
        }, $element);
      };

      self.createSection = function(params, $element) {
        self.sectionAjax({
          type: "POST",
          url: "/tracks/" + self.track.id + "/sections",
          params: params
        }, $element);
      };

      self.sectionAjax = function(request, $element) {
        $.ajax({
          type: request.type,
          url: request.url,
          data: request.params
        }).success(function(response) {
          $element.remove()
          self.sections.push(response.section);

          if (request.type == "POST") {
            self.sectionContainer.append(self.sectionTemplate(response.section));
          } else {
            $element.replaceWith(self.sectionFormTemplate(response.section));
          }

          var newElement = self.getSectionElement(response.section.id);
          self.registerEditEventListener(newElement);
        }).error(function(response) {
          //TODO
        });
      };

      self.registerSubmitEventListener = function(element, newSection) {
        var $element = $(element);
        newSection = newSection || false;

        $element.find(".btn_save input").click(function(e) {
          e.preventDefault();

          var $form = $element.find("form");
          var params = {
            title: $form.find("#section_name").val(),
            content: $form.find("#section_content").val(),
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
            params.id = parseInt($element.attr("data-section-id"));
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
          self.registerSubmitEventListener(newElement);

          return false;
        });
      };

      $.each(PageConfig.track.sections, function(i, section) {
        var sectionHtml = self.sectionTemplate(section);
        self.sectionContainer.append(sectionHtml);
      });

      // Runs only once
      $.each(self.sectionContainer.find(".section_each"), function(i, element) {
        self.registerEditEventListener(element);
      });

      $("#section_index .add_exercise_btn a").click(function(e) {
        e.preventDefault();
        self.sectionContainer.append(self.sectionFormTemplate({newTrack: true}));

        var addExerciseForms = self.sectionContainer.find(".add_exercise");
        var noOfForms = addExerciseForms.length;
        var lastForm = addExerciseForms[noOfForms - 1];

        self.registerAddResourceListener(lastForm);
        self.registerSubmitEventListener(lastForm, true);

        return false;
      });

    }
  }
});
