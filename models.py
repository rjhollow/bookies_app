"""
This file defines the database models
"""
import datetime

from . common import db, Field, auth
from pydal.validators import *

### Define your table below
#
# db.define_table('thing', Field('name'))
#
## always commit your models to avoid problems later
#
# db.commit()
#
def get_user():
    return auth.current_user.get('id') if auth.current_user else None

def get_username():
    return auth.current_user.get('username') if auth.current_user else None

def get_user_fullname():
    first_name = auth.current_user.get('first_name')
    last_name = auth.current_user.get('last_name')
    return first_name + " " + last_name if auth.current_user else None

def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()

db.define_table("users",
                Field('email', default=get_user_email),
                Field('name', 'text', default=get_user_fullname),
                Field('profile_pic', 'text'),
                Field('date_joined', 'datetime', default=get_time),
                Field('num_followers', 'integer', default=0),
                Field('num_following', 'integer', default=0),
                Field('num_of_posts', 'integer', default=0))

db.define_table("follows",
                Field('follower_id', 'reference users'),
                Field('followee_id', 'reference users'))

db.define_table("posts",
                Field('user', 'reference auth_user', default=get_user),
                Field('name', 'text', default=get_user_fullname),
                Field('content', 'text'),
                Field('num_likes', 'integer', default=0),
                Field('post_date', 'datetime', default=get_time),
                Field('book_id', 'text'),
                Field('reply', 'reference posts'))

db.commit()
db.commit()
db.commit()
