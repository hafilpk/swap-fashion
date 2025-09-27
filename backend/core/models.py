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
    CATEGORY_CHOICES = [  
        ('cotton', 'Cotton/Natural'),
        ('synthetic', 'Synthetic'),
        ('mixed', 'Mixed'),
    ] 
    wardrobe = models.ForeignKey(Wardrobe, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200)
    description = models.TextField()
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='mixed')
    image = models.ImageField(upload_to='listings/', blank=True)
    location = gis_models.PointField(null=True, blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    eco_impact = models.FloatField(default=0.0)

    def save(self, *args, **kwargs):
        if not self.eco_impact:
            base_impact = 5.0
            if self.category == 'synthetic':
                base_impact *= 1.5
            elif self.category == 'cotton':
                base_impact *= 0.8
            condition_multipliers = {'new': 1.2, 'like_new': 1.0, 'good': 0.8, 'fair': 0.6}
            self.eco_impact = base_impact * condition_multipliers.get(self.condition, 1.0)        
        super().save(*args, **kwargs)

    def __str__(self):
           return self.title   
    

