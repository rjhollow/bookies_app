(function () {
  var main_app = {
    props: ["get_posts_url", "create_post_url", "get_about_url", "delete_all", "get_user_url", "create_reply_url", "get_profile_url"],
    // Notice how we never actually use the get_about_url here!
    // That's because we pass it down to the child AboutPage component.
    data: {},
    methods: {},
  };

  main_app.data = function () {
    var data = {
      api_base_uri: "https://www.googleapis.com/books/v1/", // volumes/volumeId - to retrieve a specific book, volumes?q={search terms} - to retrieve a list of books from a query.
      page: 1, // There are currently 2 pages, 1 = home and 2 = about
      posts: [],
      new_post: "",
      user_id: 0,
      fullname: "",
      profile_id: 0,
      search_string: "",
      goto_profile: false,
      show: false,
      add_book: true,
      book_pinned: false,
      post_bookid: "",
      post_bookimg: "",
      post_author: "",
      post_title: "",
      book_title: "",
      book_subtitle: "",
      book_author: "",
      book_img: "",
      book_desc: "",
      book_pageCount: 0,
      book_type: "",
      book_publisher: "",
      book_publishdate: "",
      get_url: this.get_posts_url,
      get_profile_url: this.get_profile_url,
      create_url: this.create_post_url,
      create_reply_url: this.create_reply_url,
      about_url: this.get_about_url,
      delete_url: this.delete_all,
      user_url: this.get_user_url,
    };
    main_app.methods.load.call(data);
    return data;
  };

  main_app.methods.load = function () {
    let self = this;
    axios.get(self.get_url).then((res) => {
      self.posts = main_app.enumerate(res.data.posts);
    });
    
    axios.get(self.user_url).then((res) => {
        self.user_id = res.data.user;
        console.log(res.data.user);
        console.log(self.user_id);
        self.fullname = res.data.full_name;
    });
  };
  
  main_app.enumerate = (a) => {
        // This is a convenience function that adds a _idx field
        // to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };
    
  main_app.methods.get_book = function() {
      let self = this;
      self.add_book = true;
  }
  
  main_app.methods.book_query = function(title){
      let self = this;
      let params = main_app.convert_to_query(title);
      let api_url = self.api_base_uri + "volumes?q=intitle:" + params;
      console.log(api_url);
      axios.get(api_url)
            .then((res) => {
                let book = res.data.items[0];
                console.log(book);
                self.post_bookid = book.id;
                self.post_bookimg = book.volumeInfo.imageLinks.smallThumbnail;
                self.post_title = book.volumeInfo.title;
                self.post_author = book.volumeInfo.authors[0];
            })
  }
  
  main_app.methods.cancel_book = function() {
      let self = this;
      self.add_book = false;
      self.post_bookid = "";
      self.post_bookimg = "";
      self.post_title = "";
      self.post_author = "";
  }
  
  main_app.methods.confirm_book = function(){
      let self = this;
      self.add_book = false;
      self.book_pinned = true;
  }

  main_app.methods.create_new_post = function () {
    let self = this;
    if (self.book_pinned === false){
        self.add_book = true;
        return;
    }
    if (this.new_post.length === 0) {
      return;
    }
    let all_posts = self.posts
    axios
      .post(self.create_url, {
          name: self.fullname,
          content: self.new_post,
      })
      .then((res) => {
        all_posts.unshift({
            id: res.data.id,
            name: self.fullname,
            content: self.new_post,
            num_likes: 0,
            post_date: res.data.date,
            replies: [],
            reply: null,
            new_comment: "",
            show_comments: false,
            user: self.user_id,
            book_title: res.data.title,
            book_author: res.data.author,
            book_img: res.data.image,
            
        });
        self.posts = main_app.enumerate(all_posts);
        self.new_post = "";
        self.book_pinned = false;
        self.post_bookid = "";
        self.post_bookimg = "";
        self.post_title = "";
        self.post_author = "";
      });
  };
  
  main_app.methods.create_new_reply = function (post_idx) {
      
    let self = this;
    let post = self.posts[post_idx];
    
    if (post.new_comment.length === 0) {
      return;
    }
    
    console.log(post);
    console.log(post.new_comment);
    axios
      .post(self.create_reply_url, {
          id: post.id,
          name: self.fullname,
          content: post.new_comment,
      })
      .then((res) => {
        console.log(post.replies);
        post.replies.push({
            id: res.data.id,
            name: self.fullname,
            content: post.new_comment,
            num_likes: 0,
            post_date: "",
            reply: post.id,
            user: self.user_id
        });
        post.new_comment = "";
        post.show_comments = true;
      });
  };

  main_app.methods.delete_all_posts = function () {
    let self = this;
    axios.get(self.delete_url).then(() => {
      self.posts = [];
    });
  };
  
  main_app.methods.fetch_profile = function (post_idx){
      let self = this;
      let post = self.posts[post_idx];
      self.profile_id = post.user;
      self.goto_profile = true;
      self.page = 0;
  }

  // This route changes pages, super simple
  main_app.methods.route = function (page_num) {
    let self = this;
    self.page = page_num;
    self.goto_profile = false;
    self.profile_id = 0;

    if(page_num === 1){
        axios.get(self.get_url).then((res) => {
            self.posts = main_app.enumerate(res.data.posts);
        });
    }
    
  };
  
  main_app.convert_to_query = function (str) {
        let words = str.split(" ");
        let query = words.join("+");
        return query;
    };
  
  main_app.methods.book_image = function(post_idx){
      
  }
  
  // This function shows comments on a given post.
  main_app.methods.show_comments = function (post_idx) {
      let self = this;
      let post = self.posts[post_idx];
      post.show_comments = true;
  }
  
  // This function collapses comments on a given post.
  main_app.methods.collapse_comments = function (post_idx) {
      let self = this;
      let post = self.posts[post_idx];
      post.show_comments = false;
  }

  utils.register_vue_component(
    "mainapp",
    "components/main_app/main_app.html",
    function (template) {
      main_app.template = template.data;
      return main_app;
    }
  );
})();