// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        user_id: 0,
        full_name: "",
        post_content: "",
        posts: []
    };

    app.add_post = () => {
        if (app.vue.post_content !== "") {
            axios.post(callback_url, {content: app.vue.post_content, full_name: app.vue.full_name})
                .then((result) => {
                    console.log("Yay add_post returns data!")
                    new_post = result.data.post;
                    app.vue.posts.unshift(new_post);
                }).catch(() => {
                    console.log("The problem is with add_post");
                })
        }
    }

    // We form the dictionary of all methods, so we can assign them
    // to the Vue app in a single blow.
    app.methods = {
        add_post: app.add_post
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
        app.vue.post_content = "";
        axios.get(get_posts_url)
            .then((result) => {
                console.log(result.data.posts);
                app.vue.posts = result.data.posts;
                app.vue.full_name = result.data.user_fullname;
                app.vue.user_id = result.data.user_id;
            }).catch(() => {
                    console.log("The problem is with load_post");
            })
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
