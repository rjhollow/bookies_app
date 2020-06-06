(function(){

    var post = {
        props: ['url'],
        data: null,
        methods: {}
    };

    post.data = function() {
        var data = {
            server_url: this.url,
            post_id: 0,
            name: "",
            content: "",
            num_of_likes: 0,
            num_of_replies: 0,
            time_stamp: 0,
            replies: [],
        };
        post.methods.load.call(data);
        return data;
    };

//    grid.enumerate = function (a) {
//        // Adds an _idx attribute to each element of array a.
//        let k=0;
//        a.map(function(e) {e._idx = k++;});
//    };

    post.methods.load = function () {
        // In use, self will correspond to the data of the table,
        // as this is called via grid.methods.load
        let self = this;
        axios.get(self.server_url)
            .then(function(res) {
                console.log(res.data.test);
                // console.log(res.data.id);
                // console.log(res.data.name);
                // console.log(res.data.content);
                // console.log(res.data.replies);
                // self.post_id = res.data.id;
                // self.name = res.data.name;
                // self.content = res.data.content;
                // self.replies = res.data.replies;
            })
    };

    utils.register_vue_component('post', 'components/post/post.html', function(template) {
            post.template = template.data;
            return post;
        });
})();
