#Models/collections to add to the database
# from django.db import models

# class UserProfile(models.Model):
#     # user = models.OneToOneField(User, on_delete=models.CASCADE)
#     style_preferences = models.ManyToManyField('StylePreference')
#     body_type = models.CharField(max_length=100)
#     skin_tone = models.CharField(max_length=100)
#     hair_color = models.CharField(max_length=100)
#     favorite_colors = models.ManyToManyField('Color')


# class StylePreference(models.Model):
#     name = models.CharField(max_length=100)


# class Color(models.Model):
#     name = models.CharField(max_length=100)


# class Outfit(models.Model):
#     name = models.CharField(max_length=100)
#     description = models.TextField()
#     items = models.ManyToManyField('ClothingItem')
#     # user = models.ForeignKey(User, on_delete=models.CASCADE)


# class ClothingItem(models.Model):
#     name = models.CharField(max_length=100)
#     description = models.TextField()
#     category = models.ForeignKey('ClothingCategory', on_delete=models.CASCADE)
#     image = models.ImageField(upload_to='clothing_images/')


# class ClothingCategory(models.Model):
#     name = models.CharField(max_length=100)


# # Import necessary modules
# # from django.contrib.auth.models import User
# from FashionProject.models import UserProfile, StylePreference, Color, Outfit, ClothingItem, ClothingCategory

# # Create a user
# # user = User.objects.create(username='example_user')

# # Create a UserProfile associated with the user
# user_profile = UserProfile.objects.create(
#     # user=user,
#     body_type='Example Body Type',
#     skin_tone='Example Skin Tone',
#     hair_color='Example Hair Color'
# )

# # Create StylePreference instances
# style_preference1 = StylePreference.objects.create(name='Casual')
# style_preference2 = StylePreference.objects.create(name='Formal')

# # Create Color instances
# color1 = Color.objects.create(name='Red')
# color2 = Color.objects.create(name='Blue')

# # Create an Outfit associated with the user
# outfit = Outfit.objects.create(
#     name='Example Outfit',
#     description='Description of the example outfit',
#     # user=user
# )

# # Create ClothingCategory instance
# clothing_category = ClothingCategory.objects.create(name='Shirts')

# # Create a ClothingItem associated with the ClothingCategory
# clothing_item = ClothingItem.objects.create(
#     name='Example Clothing Item',
#     description='Description of the example clothing item',
#     category=clothing_category
# )


















# from djongo import models

# class Dance(models.Model):
#     field1 = models.CharField(max_length=100)
#     field2 = models.IntegerField()

# user1 = Dance.objects.create(field1='value1', field2=123)
# user1.save()


# # # Create a user object
# # user = france(username='angjelo', email='angjelo@example.com', first_name='angjelo', last_name='mana')
# # user2 = france(username='joe', email='joe@example.com', first_name='Joe', last_name='Doe')

# # # Save the user object to the database
# # user.save()
# # user2.save()

# # from django.db import models

# # class ClothingCategory(models.Model):
# #     name = models.CharField(max_length=100)

# #     def __str__(self):
# #         return self.name

# # class ClothingItem(models.Model):
# #     name = models.CharField(max_length=100)
# #     description = models.TextField()
# #     category = models.ForeignKey(ClothingCategory, on_delete=models.CASCADE)

# #     def __str__(self):
# #         return self.name
