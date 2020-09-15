import yagmail
import jinja2 as templating


class Sender(object):
    subject = 'Post verified on Program~hub'

    def __init__(self, email, password):
        self.email = email
        self.password = password

    def send_message(self, recipient):
        with yagmail.SMTP(self.email, self.password) as mailer:
            mailer.send(recipient.email, self.subject, recipient.content)


class Recipient(object):
    def __init__(self, email, content):
        self.email = email
        self.content = content


class Content(object):
    def __init__(self):
        self.content = open('template.html', 'r').read()

    def re(self, blog):
        return templating.Template(self.content).render(name=blog.name, content=blog.content, email=blog.email, title=blog.title)


sender = Sender('program.hubs@gmail.com', 'xkkusjjbnsodlrtz')
