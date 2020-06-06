"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

import uuid

from py4web import action, request, abort, redirect, URL, Field
from py4web.utils.form import Form, FormStyleBulma
from py4web.utils.url_signer import URLSigner

from yatl.helpers import A
from . common import db, session, T, cache, auth, signed_url

# Let us import some convenience functions.
from .models import get_user

# Let us import the starrater component code.
from .components.post import Post

class HomePoster(Post):

    def get_post(self, id=None):
        """Gets the number of stars for a given id. """
        if id is not None:
            post = db(db.post.id == id).select().first()
            r = db(db.post.reply == id).select().as_list()
            return dict(test="post is NULL" if post is None else "post has data!") #dict(id=id, name=post.name, content=post.content, replies=r) 
        else:
            return dict()


home_poster = HomePoster('poster', session, db=db)

url_signer = URLSigner(session)

# The auth.user below forces login.
@action('index')
@action.uses('index.html', home_poster, db, auth.user, url_signer)
def index():
    db(db.post).delete()
    id = db.post.insert(name="Remeal Holloway", content="I love the giver so much!", reply=None)
    db.post.insert(name="Deva Holloway", content="You're so right brother! Its an amazing book :D", reply=id)
    db.post.insert(name="Kiana Beam", content="I disagree with both of you. The giver is trash lol xD", reply=id)
    id = db.post.insert(name="Kiana Beam", content="I love the giver so much! I love it more than anyone else!", reply=None)
    id = db.post.insert(name="Deva Holloway", content="I dont love the giver so much! I kinda hate it :/", reply=None)

    # Returns to the templage the list of images.
    posts = db(db.post.reply == None).select().as_list()
    # I add a star rater to each image, so each image can be rated.
    for post in posts:
        post['poster'] = home_poster(id=post['id'])
    return dict(posts=posts,
        get_posts_url = URL('get_posts', signer=url_signer),
        callback_url = URL('add_post', signer=url_signer),
        fullname=auth.current_user.get('first_name') + " " + auth.current_user.get('last_name')
    )
    
@action('get_posts')
@action.uses(home_poster, db, auth.user, url_signer)
def load_posts():
    
    posts = db(db.post.reply == None).select().as_list()
    return dict(posts=posts,
                user_fullname=auth.current_user.get('first_name') + " " + auth.current_user.get('last_name'),
                user_id=auth.current_user.get('id')
            )

