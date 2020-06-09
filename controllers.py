import uuid

from py4web import action, request, abort, redirect, URL, Field
from py4web.utils.form import Form, FormStyleBulma
from py4web.utils.url_signer import URLSigner

from yatl.helpers import A
from .common import db, session, T, cache, auth, signed_url

# Import main app component
from .components.main_app import MainAppComponent

# Create instance of main app
app = MainAppComponent('app', session, db=db, auth=auth)

url_signer = URLSigner(session)


# The auth.user below forces login.
@action('index')
@action.uses('index.html', url_signer)
def index():
    # notice that we say app=app() and NOT app=app, the parens. are super important!
    # ie. that's how the __call__ method is used

    # tester filler data for posts for the database.
    db(db.posts).delete()
    id = db.posts.insert(name="Remeal Holloway", content="I love the giver so much!", reply=None)
    db.posts.insert(name="Deva Holloway", content="You're so right brother! Its an amazing book :D", reply=id)
    db.posts.insert(name="Kiana Beam", content="I disagree with both of you. The giver is trash lol xD", reply=id)
    id = db.posts.insert(name="Kiana Beam", content="I love the giver so much! I love it more than anyone else!",
                         reply=None)
    id = db.posts.insert(name="Deva Holloway", content="I dont love the giver so much! I kinda hate it :/", reply=None)

    return dict(app=app())
