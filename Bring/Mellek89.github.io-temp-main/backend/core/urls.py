from django.urls import path
from .views import consignment_api


urlpatterns = [
      path("api/consignment/", consignment_api, name="consignment_api"),
]
