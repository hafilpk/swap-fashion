from django.urls import path
from .views import RegisterView, CustomLoginView, WardrobeListCreateView, ClothingListingListCreateView, PublicListingsView, NearbyListingsView, MessageListCreateView, UserMessagesView, UserLocationCreateView
urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomLoginView.as_view(), name='login'),
    path('wardrobes/', WardrobeListCreateView.as_view(), name='wardrobe-list'),
    path('listings/', ClothingListingListCreateView.as_view(), name='listing-list'),
    path('public-listings/', PublicListingsView.as_view(), name='public-listings'),
    path('nearby-listings/', NearbyListingsView.as_view(), name='nearby-listings'),
    path('messages/', MessageListCreateView.as_view(), name='message-list'),
    path('inbox/', UserMessagesView.as_view(), name='inbox'),
    path('user-location/', UserLocationCreateView(many=False).as_view(), name='user-location'),
]