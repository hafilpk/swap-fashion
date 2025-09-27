from django.urls import path
from .views import RegisterView, CustomLoginView, WardrobeListCreateView, ClothingListingListCreateView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomLoginView.as_view(), name='login'),
    path('wardrobes/', WardrobeListCreateView.as_view(), name='wardrobe-list'),
    path('listings/', ClothingListingListCreateView.as_view(), name='listing-list'),
]