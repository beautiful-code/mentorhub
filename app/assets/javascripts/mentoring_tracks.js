$(function(){
  if (typeof MentoringTrackConfig !== "undefined") {
    if (typeof MentoringTrackConfig.tracks !== "undefined") {
      var self = this;
      self.tracks = MentoringTrackConfig.tracks;
      self.users = MentoringTrackConfig.users;

      self.sections = (localStorage.getItem('Sections')===null) ? [] : JSON.parse(localStorage.getItem('Sections'));
      self.menteeId = (localStorage.getItem('MenteeId')===null) ? null : JSON.parse(localStorage.getItem('MenteeId'));
      self.track = (localStorage.getItem('Track')===null) ? null : JSON.parse(localStorage.getItem('Track'));
      self.step = (localStorage.getItem('Step')===null) ? 1 : parseInt(localStorage.getItem('Step'));
      self.index = (localStorage.getItem('Index')===null) ? self.sections.length : parseInt(localStorage.getItem('Index'));

      self.mentoringTrackAssigningForm = $("script#assigning_step_form").html();
      self.mentoringTrackAssigningTemplate = Handlebars.compile(self.mentoringTrackAssigningForm);

      self.mentoringTrackCustomizingForm = $("script#customizing_step_form").html();
      self.mentoringTrackCustomizingTemplate = Handlebars.compile(self.mentoringTrackCustomizingForm);

      self.mentoringTrackConfirmingForm = $("script#confirming_step_form").html();
      self.mentoringTrackConfirmingTemplate = Handlebars.compile(self.mentoringTrackConfirmingForm);

      self.mentoringTrackContainer = $("#add_mentee_track");

      self.sectionShowHtml = $("script#show_section_interaction").html();
      self.sectionTemplate = Handlebars.compile(self.sectionShowHtml);

      self.sectionFormHtml = $("script#section_form").html();
      self.sectionFormTemplate = Handlebars.compile(self.sectionFormHtml);

      self.resourceFormHtml = $("script#resource_form").html();
      self.resourceFormTemplate = Handlebars.compile(self.resourceFormHtml);

      self.getSection = function(sectionId) {
        return (
          self.sections.find(function(section) { return section.id == sectionId;})
        );
      }

      self.setSection = function(section) {
        $.extend(self.sections.find(function(sec) { return sec.id == section.id;}),section);
      }

      self.getSectionElement = function(sectionId) {
        return (
          self.mentoringTrackContainer.find("div[data-section-id]").toArray().find(
            function(element) {
              return element.getAttribute("data-section-id") == sectionId;
            }
          )
        );
      };
      self.getEnabledSections = function(){
        return $.grep(self.sections,function(resource, i){return resource.enabled})
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
      };
      self.registerEnableEventlistener = function(element){
        var $element = $(element);
        $element.find(".tgl").change(function(e){
          section = self.getSection(parseInt($(this).closest(".exercise").attr("data-section-id")));
          ($(this).is(":checked")) ? (section.enabled = true) : (section.enabled = false)
          self.updateLocalStorage();
        });
      };

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

      self.showSectionCardAndRegisterListeners = function(sectionId, $element) {
        var section = self.getSection(sectionId);
        $element.replaceWith(self.sectionTemplate(section));

        var newElement = self.getSectionElement(section.id);
        self.registerEditEventListener(newElement);
        self.registerEnableEventlistener(newElement);
      };

      self.registerSubmitEventListener = function(element, newSection) {
        var $element = $(element);
        var sectionId = parseInt($element.attr("data-section-id"));

        $element.find(".btn_save input.cancel-edit").click(function(e) {
          e.preventDefault();
          newSection = newSection || false;

          if(newSection) {
            $element.remove();
          } else {
            self.showSectionCardAndRegisterListeners(sectionId, $element);
          }
          return false;
        });

        $element.find(".btn_save input.track-post").click(function(e) {
          e.preventDefault();

          var section = self.getSection(sectionId);

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
            $.extend(section,params);
            self.updateSection(section, $element);
          }
          return false;
        });
      };

      self.updateSection = function(section, element){
        var $element = $(element);
        var sectionId = parseInt($element.attr("data-section-id"));

        $.extend(self.sections.find(function(sec) {
          return sec.id == section.id;
        }),section);
        self.updateLocalStorage();
        self.showSectionCardAndRegisterListeners(sectionId, $element);
      };

      self.createSection = function(params, $element) {
        var newObj = params.section;
        newObj.id = parseInt($element.attr('data-section-id'));

        self.sections.push(newObj);
        self.updateLocalStorage();

        self.showSectionCardAndRegisterListeners(newObj.id, $element);
      };

      self.updateLocalStorage = function(){
        localStorage.setItem('Sections', JSON.stringify(self.sections));
        localStorage.setItem('Track', JSON.stringify(self.track));
        localStorage.setItem('Step', JSON.stringify(self.step));
        localStorage.setItem('MenteeId', JSON.stringify(self.menteeId));
        localStorage.setItem('Index', JSON.stringify(self.index));
      };
      self.clearLocalStorage = function(){
        localStorage.clear();
      }


      self.createMentoringTrack = function(){
        var sections = self.getEnabledSections();
        var track = self.track;
        var menteeId = self.menteeId;
        $.ajax({
          url: "/mentoring_tracks",
          type: "POST",
          dataType: "json",
          data: {
            sections: JSON.stringify(sections),
            track: track,
            menteeId: menteeId
          },
          success: function(response){
            self.clearLocalStorage();
            window.location.href= "/mentoring_tracks";
          }
        });
      };

      self.buildAssignFormData = function() {
        var trackId = $('.select_track :selected').val();
        self.menteeId =  $('.select_mentee :selected').val();

        //Get track sections
        $.ajax({
          url: "/track_templates/"+ trackId +"/section_templates",
          success: function(response){
            self.sections = response.sections;
            self.track = response.track_template;
            self.index = (localStorage.getItem('Index')===null) ? response.sections.length : parseInt(localStorage.getItem('Index'));
            self.step++;
            self.updateLocalStorage();
            $(".assign_next").closest(".assign_form").replaceWith(self.mentoringTrackCustomizingTemplate({sections: self.sections}))

            self.mentoringTrackContainer.find(".exercise").each(function(i,element){
              self.registerEditEventListener(element);
              self.registerEnableEventlistener(element);
            });
          },
          dataType: "json"
        });
      };

      self.mentoringTrackContainer.on("click",".add_exercise_btn", function(e) {
        e.preventDefault();
        $("#customise_exercises").append(self.sectionFormTemplate({newSection: true, id: ++self.index}))
        newElement = $("#customise_exercises .add_exercise").last();
        self.registerAddResourceListener(newElement);
        self.registerRemoveResourceListener(newElement);
        self.registerSubmitEventListener(newElement,true);
        return false;
      });

      self.mentoringTrackContainer.on("click",".assign_next", function(e) {
        e.preventDefault();
        self.buildAssignFormData();
        return false;
      });

      self.mentoringTrackContainer.on("click",".back", function(e) {
        e.preventDefault();
        self.step--;
        self.updateLocalStorage();
        window.location.href= "/mentoring_tracks/new";
      });

      self.mentoringTrackContainer.on("click",".reset", function(e) {
        e.preventDefault();
        self.clearLocalStorage();
        window.location.href= "/mentoring_tracks/new";
      });

      self.mentoringTrackContainer.on("click",".customize_next", function(e) {
        e.preventDefault();

        $('.tgl').each(function(i,element) {
          if ($(this).is(":checked")) {
            sectionId = $(this).attr("id").slice(2);
            thisSection = self.getSection(sectionId);
            $.extend(thisSection,{enabled:true})
            self.setSection(thisSection);
            self.updateLocalStorage();
          }
        });

        $(".customize_next").closest(".customize_form").replaceWith(self.mentoringTrackConfirmingTemplate({
          sections: self.getEnabledSections()
          }))
        $("html, body").animate({ scrollTop: 0 });
        self.step++;
        self.updateLocalStorage();
        return false;
      });


      self.mentoringTrackContainer.on("click",".confirming_next", function(e) {
        e.preventDefault();
        self.createMentoringTrack();
        return false;
      });

      if(self.step == 1){
        self.mentoringTrackContainer.append(self.mentoringTrackAssigningTemplate({users: self.users, tracks: self.tracks}));
      }
      else if(self.step == 2){
        self.mentoringTrackContainer.append(self.mentoringTrackCustomizingTemplate({sections: self.sections}));

        self.mentoringTrackContainer.find(".exercise").each(function(i,element){
          self.registerEditEventListener(element);
          self.registerEnableEventlistener(element);
        });
      }
      else if(self.step == 3){
        self.mentoringTrackContainer.append(self.mentoringTrackConfirmingTemplate({
          sections: self.getEnabledSections()
        }));
      }
    }
  }
});
