from ninja import Schema

class RegisterIn(Schema):
    username: str
    email: str
    password: str

class LoginIn(Schema):
    username_or_email: str
    password: str

class TokenOut(Schema):
    access: str
    refresh: str

class UserOut(Schema):
    id: int
    username: str
    email: str
