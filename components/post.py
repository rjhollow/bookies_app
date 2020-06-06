from py4web import action, URL, request
from yatl.helpers import XML
from py4web.utils.url_signer import URLSigner
from py4web.core import Fixture

class Post(Fixture):

    POST = '<post url="{url}"></post>'

    def __init__(self, url, session, signer=None, db=None, auth=None):
        self.url = url + '/get'
        self.signer = signer or URLSigner(session)
        # Creates an action (an entry point for URL calls),
        # mapped to the api method, that can be used to request pages
        # for the table.
        self.__prerequisites__ = [session]
        args = list(filter(None, [session, db, auth, self.signer.verify()]))
        f = action.uses(*args)(self.get_post)
        action(self.url + "/<id>", method=["GET"])(f)

    def __call__(self, id=None):
        """This method returns the element that can be included in the page."""
        return XML(Post.POST.format(url=URL(self.url, id, signer=self.signer)))

    def get_post(self, id=None):
        """Get a post for a given id."""
        # This function needs to be over-ridden.
        return dict(replies=[])