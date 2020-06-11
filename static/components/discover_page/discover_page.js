// This is the about page component, we do not generate it with Python!

(function () {
  var discover_page = {
    props: ["url"], // this url is passed from the parent (main_app), not Python!
    data: {},
    methods: {},
  };

  discover_page.data = function () {
    var data = {
        search_string: "",
        bookapi_key: "AIzaSyCqnUmI5Z6LDPsK-wSxTBgdPU5tUwu0W4M",
        api_base_uri: "https://www.googleapis.com/books/v1/", // volumes/volumeId - to retrieve a specific book, volumes?q={search terms} - to retrieve a list of books from a query.
        rows: [],
        get_url: this.url,
    };
    discover_page.methods.load.call(data);
    return data;
  };

  discover_page.methods.load = function () {
    let self = this;
    let api_url = self.api_base_uri + "volumes?q=best+sellers";
    axios.get(api_url)
        .then((res) => {
            console.log(api_url);
            console.log(res.data.items);
        }).catch(() => {
            console.log("There was a problem with the request.");
        });
  };
  
  discover_page.enumerate = (a) => {
        // This is a convenience function that adds a _idx field
        // to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };
  
  discover_page.convert_to_query = function (str){
      let self = this;
      let words = self.search_string.split(" ");
      let query = words.join("+");
      console.log(query);
      return query;
  }

  utils.register_vue_component(
    "discover",
    "components/discover_page/discover_page.html",
    function (template) {
      discover_page.template = template.data;
      return discover_page;
    }
  );
})();