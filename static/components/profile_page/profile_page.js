// This is a sample page, basically an empty component

(function () {
  var profile_page = {
    props: [],
    methods: {},
  };

  profile_page.data = function () {
    return {};
  };

  utils.register_vue_component(
    "profilepage",
    "components/profile_page/profile_page.html",
    function (template) {
      profile_page.template = template.data;
      return profile_page;
    }
  );
})();
