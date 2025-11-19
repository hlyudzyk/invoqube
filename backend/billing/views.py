from django.shortcuts import render
from ninja import NinjaAPI

# Create your views here.
transactions_api = NinjaAPI()

@transactions_api.get("/greeting", response=str)
def greeting(request):
    return "hello world"
