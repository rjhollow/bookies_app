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
      page: 1, // There are currently 2 pages, 1 = home and 2 = about
      posts: [],
      new_post: "",
      user_id: 0,
      fullname: "",
      profile_id: 0,
      goto_profile: false,
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

  main_app.methods.create_new_post = function () {
    if (this.new_post.length === 0) {
      return;
    }
    let self = this;
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
            user: self.user_id
            
        });
        self.posts = main_app.enumerate(all_posts);
        self.new_post = "";
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
