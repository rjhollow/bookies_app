(function () {
  var main_app = {
    props: ["get_posts_url", "create_post_url", "get_about_url", "delete_all", "get_user_url"],
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
      new_reply: "",
      user_id: 0,
      fullname: "",
      get_url: this.get_posts_url,
      create_url: this.create_post_url,
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
            user: self.user_id
            
        });
        self.posts = main_app.index(all_posts);
        self.new_post = "";
      });
  };
  
  main_app.methods.create_new_reply = function (id) {
    if (this.new_reply.length === 0) {
      return;
    }
    let self = this;
    axios
      .post(self.create_url, {
          name: self.fullname,
          content: self.new_post,
      })
      .then((res) => {
        console.log(res.data.post);
        self.posts.unshift({
            id: res.data.id,
            name: self.fullname,
            content: self.new_post,
            num_likes: 0,
            post_date: res.data.date,
            replies: [],
            reply: null,
            user: self.user_id
            
        });
        console.log(self.posts);
        self.new_post = "";
      });
  };

  main_app.methods.delete_all_posts = function () {
    let self = this;
    axios.get(self.delete_url).then(() => {
      self.posts = [];
    });
  };

  // This route changes pages, super simple
  main_app.methods.route = function (page_num) {
    this.page = page_num;
  };

  utils.register_vue_component(
    "mainapp",
    "components/main_app/main_app.html",
    function (template) {
      main_app.template = template.data;
      return main_app;
    }
  );
})();
