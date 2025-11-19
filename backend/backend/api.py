# Create your views here.
from ninja import NinjaAPI
from user.api.auth import auth_router

api = NinjaAPI()
api.add_router("/auth", auth_router)

@api.get("/greeting", response=str)
def greeting(request):
    return "hello world"
