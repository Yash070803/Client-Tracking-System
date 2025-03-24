from django.db import models

# Create your models here.
class Client(models.Model):
    name_of_client = models.CharField(max_length=100) #regularuser_admin
    registered_date = models.DateTimeField(auto_now_add=True) #regularuser_admin
    email = models.EmailField(unique=True) #admin only
    contact_no = models.IntegerField() #admin only
    address = models.TextField() #regularuser_admin