import yagmail
import jinja2 as templating


class Sender(object):
    def __init__(self, email, password):
        self.email = email
        self.password = password

    def send_message(self, subject: str, recipient):
        with yagmail.SMTP(self.email, self.password) as mailer:
            mailer.send(recipient.email, subject, recipient.content)


class Recipient(object):
    def __init__(self, email, content):
        self.email = email
        self.content = content


def re(blog):
    content = open('tmp/template.tmp', 'r').read()
    return templating.Template(content).render(name=blog.name, content=blog.content, email=blog.email,
                                               title=blog.title)


def su(address, url):
    content = open('tmp/subscribe.tmp', 'r').read()
    return templating.Template(content).render(address=address, url=url)


def le(title, url):
    content = open('tmp/notify.tmp', 'r').read()
    return templating.Template(content).render(title=title, url=url)


sender = Sender('program.hubs@gmail.com', 'xkkusjjbnsodlrtz')
