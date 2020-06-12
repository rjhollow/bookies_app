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
            querybooks:[],
            book_title: "",
            book_subtitle: "",
            book_author: "",
            book_img: "",
            book_desc: "",
            book_pageCount: 0,
            book_type: "",
            book_publisher: "",
            book_publishdate: "",
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
                console.log(self.bestsellers);
            }).catch(() => {
                console.log("There was a problem with the request.");
                console.log(self.bestsellers);
            });
    
    };
  
    discover_page.methods.get_query = function (s) {
      if(s !== ""){
          let self = this;
          console.log(self.api_base_uri);
          let p = discover_page.convert_to_query(s);
          let query_url = self.api_base_uri + "volumes?q="+ p + "&startIndex=" + self.start_index + "&maxReturns=20";
          console.log(query_url);
        
        axios.get(query_url)
            .then((res) => {
                self.querybooks = discover_page.enumerate(res.data.items);
                console.log(self.querybooks);
            }).catch(() => {
                console.log("There was a problem with the query url.");
            })
            
        self.field_string = "";
        self.search_string = s;
        self.show_query = true;
      }
      
    };
  
    discover_page.methods.get_image = (book_list, book_idx) => {
        // This is a convenience function that adds a _idx field
        // to each element of the array.
        let books =  book_list;
        let book = books[book_idx];
        return book.volumeInfo.imageLinks.smallThumbnail;
    };
    
    discover_page.methods.get_book_img = () => {
        // This is a convenience function that adds a _idx field
        // to each element of the array.
        let self = this;
        return self.book_img;
    };

    discover_page.methods.display_details = (book_list, book_idx) => {
        // This is a convenience function that adds a _idx field
        // to each element of the array
        
        let self = this;
        self.show_details = true;
        let books = book_list;
        let book = books[book_idx];
        self.book_title = book.volumeInfo.title;
        self.book_subtitle = book.volumeInfo.subtitle;
        self.book_author = book.volumeInfo.authors[0];
        self.book_img = book.volumeInfo.imageLinks.thumbnail;
        self.book_desc = book.volumeInfo.description;
        self.book_pageCount = book.volumeInfo.pageCount;
        self.book_type = book.volumeInfo.printType;
        self.book_publisher = book.volumeInfo.publisher;
        self.book_publishdate = book.volumeInfo.publishedDate;
        console.log(book);
        console.log(self.book_title);
    };
    
    discover_page.methods.close_details = () => {
        // This is a convenience function that adds a _idx field
        // to each element of the array.
        let self = this;
        self.show_details = false;
        console.log('details have been closed');
    };
    
    discover_page.enumerate = (a) => {
        // This is a convenience function that adds a _idx field
        // to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };
  
  
    
    discover_page.convert_to_query = function (str) {
        let words = str.split(" ");
        let query = words.join("+");
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
