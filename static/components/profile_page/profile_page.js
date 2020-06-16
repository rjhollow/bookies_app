// This is a sample page, basically an empty component

(function () {
  var profile_page = {
    props: ["id", "get_profile_url", "create_post_url", "create_reply_url", "get_user_url"],
    data: {},
    methods: {},
  };
  
  profile_page.data = function () {
    var data = {
      page: 0, // There are currently 2 pages, 1 = home and 2 = about
      posts: [],
      new_post: "",
      fullname: "",
      search_string: "",
      show: false,
      pressed_search: false,
      add_book: false,
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
      current_user_id: 0,
      profile_user_id: this.id,
      get_profile_url: this.get_profile_url,
      create_url: this.create_post_url,
      create_reply_url: this.create_reply_url,
      user_url: this.get_user_url,
    };
    profile_page.methods.load.call(data);
    return data;
  };

  profile_page.methods.load = function () {
    let self = this;
    axios.get(self.get_profile_url,
                {params : {profile_id : self.profile_user_id}
        }).then((res) => {
            self.fullname = res.data.full_name;
            self.posts = profile_page.enumerate(res.data.posts);
            console.log(res.data.test);
        });

    axios.get(self.user_url).then((res) => {
        self.current_user_id = res.data.user;
        console.log(self.current_user_id);
        console.log(self.profile_user_id);
    });

  };

  profile_page.enumerate = (a) => {
        // This is a convenience function that adds a _idx field
        // to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };
    
  profile_page.methods.get_book = function() {
      let self = this;
      self.add_book = true;
  };
  
  profile_page.methods.book_query = function(title){
      let self = this;
      let params = profile_page.convert_to_query(title);
      let api_url = self.api_base_uri + "volumes?q=intitle:" + params;
      console.log(api_url);
      axios.get(api_url)
            .then((res) => {
                let book = res.data.items[0];
                console.log(book);
                self.post_bookid = book.id;
                self.post_bookimg = book.volumeInfo.imageLinks.thumbnail;
                self.post_title = book.volumeInfo.title;
                console.log(self.post_bookimg);
                self.post_author = book.volumeInfo.authors[0];
                self.book_pinned = true;
                self.pressed_search = true;
                self.search_string = "";
            })
  };
  
  profile_page.methods.cancel_book = function() {
      let self = this;
      self.book_pinned = false;
      self.add_book = false;
      self.pressed_search = false;
      self.post_bookid = "";
      self.post_bookimg = "";
      self.post_title = "";
      self.post_author = "";
      self.search_string = "";
  };
  
  profile_page.methods.confirm_book = function(){
      let self = this;
      self.add_book = false;
      self.book_pinned = true;
      self.pressed_search = false;
      self.search_string = "";
  };

  profile_page.methods.create_new_post = function () {
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
          book: self.post_bookid,
          title: self.post_title,
          author: self.post_author,
          image: self.post_bookimg
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
            book_id: self.post_bookid,
            book_title: self.post_title,
            book_author: self.post_author,
            book_img: self.post_bookimg,
            
        });
        self.posts = profile_page.enumerate(all_posts);
        self.new_post = "";
        self.book_pinned = false;
        self.post_bookid = "";
        self.post_bookimg = "";
        self.post_title = "";
        self.post_author = "";
      });
  };

  profile_page.methods.create_new_reply = function (post_idx) {

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

  profile_page.methods.delete_all_posts = function () {
    let self = this;
    axios.get(self.delete_url).then(() => {
      self.posts = [];
    });
  };
  
  profile_page.convert_to_query = function (str) {
        let words = str.split(" ");
        let query = words.join("+");
        return query;
    };

  // This route changes pages, super simple
  profile_page.methods.route = function (page_num) {
    this.page = page_num;
  };

  profile_page.methods.show_comments = function (post_idx) {
      let self = this;
      let post = self.posts[post_idx];
      post.show_comments = true;
  }

  profile_page.methods.collapse_comments = function (post_idx) {
      let self = this;
      let post = self.posts[post_idx];
      post.show_comments = false;
  }

  utils.register_vue_component(
    "profilepage",
    "components/profile_page/profile_page.html",
    function (template) {
      profile_page.template = template.data;
      return profile_page;
    }
  );
})();