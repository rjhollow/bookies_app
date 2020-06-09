from py4web import action, URL, request
from yatl.helpers import XML
from py4web.utils.url_signer import URLSigner
from py4web.core import Fixture


class MainAppComponent(Fixture):
    # The main app leaves spots for all of its props to be passed (prop = data being passed down)
    MAINAPP = """<mainapp 
    get_posts_url={get_posts_url}
    get_user_url={get_user_url}
    create_post_url={create_post_url}
    create_reply_url={create_reply_url}
    get_about_url={get_about_url}
    delete_all={delete_all}
    ></mainapp>"""

    def __init__(self, url, session, signer=None, db=None, auth=None):
        self.base_url = url
        self.db = db
        self.auth = auth
        self.__prerequisites__ = [session]
        self.signer = signer or URLSigner(session)
        self.args = list(
            filter(None, [session, db, auth, self.signer.verify()]))

        self.define_urls()

        self.create_route(self.get_posts_url, self.get_posts, "GET")
        self.create_route(self.get_user_url, self.get_current_user, "GET")
        self.create_route(self.get_about_url, self.get_about, "GET")
        self.create_route(self.delete_all_posts_url,
                          self.delete_all_posts, "GET")
        self.create_route(self.create_post_url, self.create_post, "POST")
        self.create_route(self.create_reply_url, self.create_reply, "POST")

    def __call__(self, img_id=None):  # turn our class into HTML
        return XML(MainAppComponent.MAINAPP.format(
            get_posts_url=URL(self.get_posts_url, signer=self.signer),
            get_user_url=URL(self.get_user_url, signer=self.signer),
            create_post_url=URL(self.create_post_url, signer=self.signer),
            create_reply_url=URL(self.create_reply_url, signer=self.signer),
            get_about_url=URL(self.get_about_url, signer=self.signer),
            delete_all=URL(self.delete_all_posts_url, signer=self.signer)
        ))

    def define_urls(self):
        self.get_posts_url = self.base_url + "/get_posts"
        self.get_user_url = self.base_url + "/get_current_user"
        self.create_post_url = self.base_url + "/create_post"
        self.create_reply_url = self.base_url + "/create_reply"
        self.get_about_url = self.base_url + "/about"
        self.delete_all_posts_url = self.base_url + "/clear"

    def create_route(self, url, method, protocol):
        func = action.uses(*self.args)(method)
        action(url, method=[protocol])(func)

    def get_current_user(self):
        if self.auth.current_user:
            user = self.auth.current_user.get('id')
            name = self.auth.current_user.get('first_name') + " " + self.auth.current_user.get('last_name')
            return dict(user=user, full_name=name)
        else:
            return dict()

    def get_posts(self):
        # creates a list of main posts
        posts = self.db(self.db.posts.reply == None).select().as_list()
        # reverse the lists so the newest posts show up first.
        posts.reverse()
        # for every main post, adds a list of replies to that main post.
        for post in posts:
            post['replies'] = self.db(self.db.posts.reply == post['id']).select().as_list()
            post['new_comment'] = ""
            post['is_commenting'] = False
        return dict(posts=posts)

    def create_post(self):
        name = request.json.get('name')
        content = request.json.get('content')
        id = self.db.posts.insert(name=name, content=content, reply=None)
        post = self.db(self.db.posts.id == id).select().first()
        post['replies'] = []
        return dict(id=id, date=post.post_date)

    def create_reply(self):
        post_id = request.json.get('id')
        name = request.json.get('name')
        content = request.json.get('content')
        id = self.db.posts.insert(name=name, content=content, reply=post_id)
        return dict(id=id)

    def delete_all_posts(self):
        self.db(self.db.posts).delete()

    def get_about(self):
        about = """We are a great company with a fantastic user base.
        Be sure to check us out on all social media platforms for updates!
        Copyright PostCo. 2020
        """
        return dict(about=about)
