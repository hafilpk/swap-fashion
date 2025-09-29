from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login
from django.contrib.auth.models import User
from .serializers import UserSerializer, LoginSerializer, WardrobeSerializer, ClothingListingSerializer, MessageSerializer, UserLocationSerializer
from .models import Wardrobe, ClothingListing, Message
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from rest_framework import serializers
from django.db import models



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
        }, status=status.HTTP_201_CREATED)


class CustomLoginView(ObtainAuthToken):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)
        login(request, user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
        })


class WardrobeListCreateView(generics.ListCreateAPIView):
    serializer_class = WardrobeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wardrobe.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PublicListingsView(generics.ListAPIView):
    serializer_class = ClothingListingSerializer
    permission_classes = []
    
    def get_queryset(self):
        return ClothingListing.objects.filter(is_public=True).order_by('-created_at')[:20]

class ClothingListingListCreateView(generics.ListCreateAPIView):
    serializer_class = ClothingListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ClothingListing.objects.filter(wardrobe__user=self.request.user)

    def perform_create(self, serializer):
        wardrobe, _ = Wardrobe.objects.get_or_create(user=self.request.user)
        serializer.save(wardrobe=wardrobe)

class NearbyListingsView(generics.ListAPIView):
    serializer_class = ClothingListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_lat = self.request.query_params.get('lat')
        user_lon = self.request.query_params.get('lon')
        radius_km = float(self.request.query_params.get('radius', 10))
        if user_lat and user_lon:
            user_point = Point(float(user_lon), float(user_lat), srid=4326)
            return ClothingListing.objects.filter(
                is_public=True,
                location__distance_lte=(user_point, D(km=radius_km))
            ).distance(user_point).order_by('distance')[:20]   
        return ClothingListing.objects.none() 
    
class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return Message.objects.filter(
            models.Q(sender=self.request.user) | models.Q(receiver=self.request.user)
        ).select_related('sender', 'receiver', 'listing')  
    
    def perform_create(self, serializer):
        listing = serializer.validated_data['listing']
        receiver = listing.wardrobe.user if listing.wardrobe.user != self.request.user else None
        if not receiver:
            raise serializers.ValidationError("Invalid receiver for this listing.")
        serializer.save(sender=self.request.user, receiver=receiver)     

class UserMessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return Message.objects.filter(receiver=self.request.user, is_read=False).order_by('-created_at')
   
class UserLocationCreateView(generics.CreateAPIView):
    serializer_class = UserLocationSerializer
    permission_classes = [IsAuthenticated]  

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)