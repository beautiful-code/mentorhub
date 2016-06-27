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
          $element.find(".resources").append(self.resourceFormTemplate({}));
          return false;
        });
      };

      self.getSection = function(sectionId) {
        $.each(PageConfig.track.sections, function(i, section) {
          if (section.id === sectionId ) { return section; }
        });
      };

      //TODO: Rushil to write the functionality
      self.deleteSection = function() {
      };

      self.createSection = function(params, $element) {
        var url = "/tracks/" + params.track_id + "/sections";

        $.ajax({
          type: "POST",
          url: url,
          data: params
        }).success(function(response) {
          $element.remove()
          self.sections.push(section);
          self.sectionContainer.append(self.sectionTemplate(response.section));
          self.registerEditEventListener(lastForm);
        }).error(function(response) {
          //TODO
        });
      };

      self.registerSubmitEventListener = function(element) {
        var $element = $(element);

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

          self.createSection({
            section: params,
            track_id: self.track.id
          }, $element);

          return false;
        });
      };

      self.registerEditEventListener = function(element) {
        var $element = $(element);

        $element.find(".edit-section").click(function(e) {
          e.preventDefault();
          var thisSection = self.getSection(parseInt($element.attr("data-section-id")));
          $element.replaceWith(self.sectionFormTemplate(thisSection));
          self.registerAddResourceListener($element.find(".add_exercise"));

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
        self.sectionContainer.append(self.sectionFormTemplate({}));

        var addExerciseForms = self.sectionContainer.find(".add_exercise");
        var noOfForms = addExerciseForms.length;
        var lastForm = addExerciseForms[noOfForms - 1];

        self.registerAddResourceListener(lastForm);
        self.registerSubmitEventListener(lastForm);

        return false;
      });

    }
  }
});
