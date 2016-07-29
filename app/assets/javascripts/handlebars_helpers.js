$(function(){
  Handlebars.registerHelper({
      eq: function (v1, v2) {
          return v1 === v2;
      },
      ne: function (v1, v2) {
          return v1 !== v2;
      },
      lt: function (v1, v2) {
          return v1 < v2;
      },
      gt: function (v1, v2) {
          return v1 > v2;
      },
      lte: function (v1, v2) {
          return v1 <= v2;
      },
      gte: function (v1, v2) {
          return v1 >= v2;
      },
      and: function (v1, v2) {
          return v1 && v2;
      },
      or: function (v1, v2) {
          return v1 || v2;
      },
      present: function(v1) {
        return v1.length > 1;
      }
  });
});
