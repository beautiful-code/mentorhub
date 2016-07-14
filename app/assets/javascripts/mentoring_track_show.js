$(function(){
  if (typeof MentoringTrackShowConfig !== "undefined") {
    if (typeof MentoringTrackShowConfig.track !== "undefined") {
      var self = this;
      self.track = MentoringTrackShowConfig.track;

      self.trackContainer = $("#section_index .track_info");
      self.trackShowHtml = $("script#show_track_data").html();
      self.trackTemplate = Handlebars.compile(self.trackShowHtml);

      self.sectionInteractions = MentoringTrackShowConfig.sections;
      self.mentoringTrackSectionsContainer = $("#show_track_sections");

      self.mentoringTrackSectionShowHtml = $("script#section_interaction_template").html();
      self.mentoringTrackSectionTemplate = Handlebars.compile(self.mentoringTrackSectionShowHtml);

      self.mentoringTrackShow = $("script#show_section_interactions").html();
      self.mentoringTrackShowTemplate = Handlebars.compile(self.mentoringTrackShow);

      self.sectionFormHtml = $("script#section_form").html();
      self.sectionFormTemplate = Handlebars.compile(self.sectionFormHtml);

      self.resourceFormHtml = $("script#resource_form").html();
      self.resourceFormTemplate = Handlebars.compile(self.resourceFormHtml);

      self.todoFormHtml= $("script#todo_form").html();
      self.todoFormTemplate = Handlebars.compile(self.todoFormHtml);

      self.todoShow= $("script#show_todo").html();
      self.todoShowTemplate = Handlebars.compile(self.todoShow);

      self.getSection = function(sectionId) {
        return (
          self.sectionInteractions.find(function(section) { return section.id == sectionId;})
        );
      };

      setTimeout(function() {
        self.trackContainer.find(".loading-track").hide("slow");
      }, 220);
      self.track.nonEditableTrack = true;
      self.trackContainer.append(self.trackTemplate(self.track));

      self.getSectionElement = function(sectionId) {
        return (
          self.mentoringTrackSectionsContainer.find("div[data-section-id]").toArray().find(
            function(element) {
              return element.getAttribute("data-section-id") == sectionId;
            }
          )
        );
      };

      self.showSectionInteractionCardAndRegisterListeners = function(sectionId, $element, newSectionInteraction) {
        if (newSectionInteraction == true) {
          var section = self.getSection(sectionId);
          $element.replaceWith(self.mentoringTrackSectionTemplate(section));
        }
        else{
          var section = self.getSection(sectionId);
          $element.replaceWith(self.mentoringTrackSectionTemplate(section));

          var newElement = self.getSectionElement(section.id);
          self.registerEditEventListener(newElement);
          self.registerEnableEventlistener(newElement);
        }
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

      self.createSection = function(trackInstanceId, params, $element) {
        self.sectionInteractionAjax({
          type: "POST",
          url: "/tracks/"+trackInstanceId+"/section_interactions",
          params: {section_interaction: JSON.stringify(params)}
        }, $element);
      };

      //TODO
      self.sectionInteractionAjax = function(request, $element) {
        $.ajax({
          type: request.type,
          url: request.url,
          data: request.params
        }).done(function(response) {
          if (request.type == "POST") {
            self.sectionInteractions.push(response.section_interaction);
            self.showSectionInteractionCardAndRegisterListeners(response.section_interaction.id, $element, true);
          } else {
            self.updateSectionData(response.section_interaction);
          }
        });
      };

      self.createTodo = function(todo, sectionInteractionId, $element){
        self.todoAjax({
          type: "POST",
          url: "/tracks/" + self.track.id + "/section_interactions/"+ sectionInteractionId +"/todos" ,
          data: todo
        }, $element);
      };

      self.showTodoCardAndRegisterListeners = function(data, $element){
        data.state = "incomplete";
        $element.replaceWith(self.todoShowTemplate(data));
      };

      self.todoAjax = function(request, $element) {
        $.ajax({
          type: request.type,
          url: request.url,
          data: request.data
        }).done(function(response) {
          self.showTodoCardAndRegisterListeners(response.todo, $element);
        });
      };

      self.registerTodoEventListener = function(element){
        var $element = $(element);
        $element.find(".submit_todo").click(function(e){
          e.preventDefault();
          var sectionInteractionId = parseInt($(this).closest(".exercise").attr("data-section-id"));
          var params = {
            content: $element.find(".todo_text").val()
          }
          self.createTodo(params,sectionInteractionId, $element );
        });
      };

      self.registerSubmitEventListener = function(element, newSection) {
        var $element = $(element);
        var sectionInteractionId = parseInt($element.attr("data-section-id"));
        var trackInstanceId = MentoringTrackShowConfig.track.id;

        $element.find(".btn_save input.cancel-edit").click(function(e) {
          e.preventDefault();
          newSection = newSection || false;

          if(newSection) {
            $element.remove();
          } else {
            self.showSectionInteractionCardAndRegisterListeners(sectionInteractionId, $element);
          }
          return false;
        });

        $element.find(".btn_save input.track-post").click(function(e) {
          e.preventDefault();

          var section = self.getSection(sectionInteractionId);

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
              url: resource.find(".url").val(),
              enabled: true
            });
          });

          if (newSection) {
            self.createSection(trackInstanceId, params, $element);
          } else {
            params.id = sectionId;
            $.extend(section,params);
            self.updateSection(section, $element);
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
      };

      self.registerEnableEventlistener = function(element){
        var $element = $(element);
        $element.find(".tgl").change(function(e){
          section = self.getSection(parseInt($(this).closest(".exercise").attr("data-section-id")));
          ($(this).is(":checked")) ? (section.enabled = true) : (section.enabled = false)
        });
      };

      self.mentoringTrackSectionsContainer.on("click",".add_exercise_btn", function(e) {
        e.preventDefault();
        $("#customise_exercises").append(self.sectionFormTemplate({newSection: true, id: ++self.index}))
        newElement = $("#customise_exercises .add_exercise").last();
        self.registerAddResourceListener(newElement);
        self.registerRemoveResourceListener(newElement);
        self.registerSubmitEventListener(newElement,true);
        return false;
      });

      self.mentoringTrackSectionsContainer.on("click",".add_todo a", function(e){
        e.preventDefault();
        var todos = $(this).closest(".add_todo").prev();
        todos.append(self.todoFormTemplate());
        var newTodo = todos.find(".todo:last");
        self.registerTodoEventListener(newTodo);
        return false;
      });

      self.todoStateUpdate = function(todoId, state, $element){
        $.ajax({
          type: "PUT",
          url: "/todos/"+ todoId ,
          data: {state: state}
        }).done(function(response) {
          $element.replaceWith(self.todoShowTemplate(response.todo));
        });
      };

      self.todoDelete = function(todoId, $element){
        $.ajax({
          type: "DELETE",
          url: "/todos/"+ todoId
        }).done(function(){
          $element.remove();
        });
      };

      self.mentoringTrackSectionsContainer.on("click",".todo-check", function(e){
        e.preventDefault();
        state = $(this).attr("class").split(' ')[2];
        $element = $(this).closest(".container-fluid");
        todoId = parseInt($element.attr("todo-id"));
        if(state == "incomplete")
        {
          state = "to_be_reviewed"
        }else if (state == "to_be_reviewed"){
          state = "completed"
        }
        self.todoStateUpdate(todoId, state, $element);
        return false;
      });

      self.mentoringTrackSectionsContainer.on("click",".todo-delete", function(e){
        e.preventDefault();
        $element = $(this).closest(".container-fluid");
        todoId = parseInt($element.attr("todo-id"));
        self.todoDelete(todoId, $element);
        return false;
      });

      self.mentoringTrackSectionsContainer.append(self.mentoringTrackShowTemplate({sections: self.sectionInteractions}));

      self.mentoringTrackSectionsContainer.find(".exercise").each(function(i,element){
        self.registerEditEventListener(element);
        self.registerEnableEventlistener(element);
      });
    }
  }
});
