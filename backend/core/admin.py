from django.contrib import admin
from .models import Wardrobe, ClothingListing
from django.contrib.gis.admin import GISModelAdmin

@admin.register(Wardrobe)
class WardrobeAdmin(admin.ModelAdmin):
    pass

@admin.register(ClothingListing)
class ClothingListingAdmin(GISModelAdmin):
    pass



