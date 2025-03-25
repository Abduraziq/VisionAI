from django.urls import path

from .views import test_api  # Ensure this imports the correct function
from .views import home

urlpatterns = [
    path('', home, name='home'),
]

urlpatterns = [
    path("api/test/", test_api),
]