from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('clients/', views.List.as_view(), name='client-list'),
    path('user/', views.Info.as_view(), name='user-info'),
    path('api/token/', TokenObtainPairView.as_view(), name='token-obtain'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('clients/<int:id>/edit/', views.Edit.as_view(), name='client-edit'),
    path('clients/create/', views.Create.as_view(), name='client-create'),
    path('clients/<int:id>/delete/', views.Delete.as_view(), name='client-delete'),
]