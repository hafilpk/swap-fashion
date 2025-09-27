from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Wardrobe, ClothingListing


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Wardrobe.objects.get_or_create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials.")


class WardrobeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wardrobe
        fields = '__all__'


class ClothingListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingListing
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'eco_impact')

    def create(self, validated_data):
        location_str = validated_data.pop('location', None)
        instance = super().create(validated_data)
        if location_str:
            try:
                lon, lat = map(float, location_str.split(','))
                from django.contrib.gis.geos import Point
                instance.location = Point(lon, lat, srid=4326)  # WGS84
                instance.save()
            except ValueError:
                pass
        return instance    