from django.db import models
from django.contrib.auth.models import User
from django.contrib.gis.db import models as gis_models

class Wardrobe(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.username}'s Wardrobe"

class ClothingListing(models.Model):
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
    ] 
    wardrobe = models.ForeignKey(Wardrobe, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200)
    description = models.TextField()
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES)
    image = models.ImageField(upload_to='listings/', blank=True)
    location = gis_models.PointField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    eco_impact = models.FloatField(default=0.0)
    def __str__(self):
           return self.title   
    

