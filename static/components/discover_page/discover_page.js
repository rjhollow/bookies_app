// This is the about page component, we do not generate it with Python!

(function () {
  var discover_page = {
    props: ["url"], // this url is passed from the parent (main_app), not Python!
    data: {},
    methods: {},
  };

  discover_page.data = function () {
    var data = {
        field_string: "",
        search_string: "",
        start_index: 0,
        show_index: 0,
        show_details: false,
        show_query: false,
        bookapi_key: "AIzaSyCqnUmI5Z6LDPsK-wSxTBgdPU5tUwu0W4M",
        api_base_uri: "https://www.googleapis.com/books/v1/", // volumes/volumeId - to retrieve a specific book, volumes?q={search terms} - to retrieve a list of books from a query.
        bestsellers:[],
        query_books: [],
        get_url: this.url,
    };
    discover_page.methods.load.call(data);
    return data;
  };

  discover_page.methods.load = function () {
    let self = this;
    let api_url = self.api_base_uri + "volumes?q=best+sellers&startIndex=" + self.start_index + "&maxReturns=20";
    axios.get(api_url)
        .then((res) => {
            console.log(api_url);
            console.log(res.data.items);
            self.bestsellers = discover_page.enumerate(res.data.items);
            // let i=0;
            // let items = res.data.items;
            // let pre_rows = [];
            
            // while(i < items.length){ // creates a lists of rows with 4 cells in each row
            //     let j = 0;
            //     let cells = [];
            //     while(j<4){
            //         cells.push(items[i+j])
            //         j++;
            //     }
            //     pre_rows.push({cells : discover_page.enumerate(cells)});
            //     i+=4;
            // }
            console.log(self.bestsellers);
        }).catch(() => {
            console.log("There was a problem with the request.");
            console.log(self.bestsellers);
        });
  };
  
  discover_page.enumerate = (a) => {
        // This is a convenience function that adds a _idx field
        // to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };
  
  discover_page.methods.get_image = (book_list, book_idx) => {
        // This is a convenience function that adds a _idx field
        // to each element of the array.
        let books =  book_list;
        let book = books[book_idx];
        return book.volumeInfo.imageLinks.smallThumbnail;
    };
    
  discover_page.methods.run_query = (str) => {
        // This is a convenience function that adds a _idx field
        // to each element of the array.
        console.log(self.api_base_uri);
        let p = discover_page.convert_to_query(str);
        let query_url = "https://www.googleapis.com/books/v1/volumes?q=" + p + "&startIndex=0&maxReturns=20";
        
        axios.get(query_url)
            .then((res) => {
                console.log(query_url);
                console.log(res.data.items);
                this.query_books = discover_page.enumerate(res.data.items);
            }).catch(() => {
                console.log("There was a problem with the query.");
                console.log(self.query_books);
                console.log(query_url);
            });
            
        console.log(this.query_books);
        self.field_string = "";
        self.search_string = str;
        self.show_query = true;
    };

  discover_page.convert_to_query = function (str) {
      let self = this;
      let words = str.split(" ");
      let query = words.join("+");
      console.log(query);
      return query;
  };

  utils.register_vue_component(
    "discover",
    "components/discover_page/discover_page.html",
    function (template) {
      discover_page.template = template.data;
      return discover_page;
    }
  );
})();
