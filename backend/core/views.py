from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login
from django.contrib.auth.models import User
from .serializers import UserSerializer, LoginSerializer, WardrobeSerializer, ClothingListingSerializer
from .models import Wardrobe, ClothingListing


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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


class ClothingListingListCreateView(generics.ListCreateAPIView):
    serializer_class = ClothingListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ClothingListing.objects.filter(wardrobe__user=self.request.user)

    def perform_create(self, serializer):
        wardrobe, _ = Wardrobe.objects.get_or_create(user=self.request.user)
        serializer.save(wardrobe=wardrobe)
