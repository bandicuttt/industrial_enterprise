from django.urls import include, path
from .spectacular.urls import urlpatterns as doc_urls
from users.urls import urlpatterns as users_urls
from transport_units.urls import urlpatterns as category_urls
from retail_outlets.urls import urlpatterns as retail_outlet_urls
from orders.urls import urlpatterns as order_urls

app_name = 'api'
urlpatterns = [
    path('auth/', include('djoser.urls.jwt')),
]

urlpatterns+=doc_urls
urlpatterns+=users_urls
urlpatterns+=category_urls
urlpatterns+=retail_outlet_urls
urlpatterns+=order_urls