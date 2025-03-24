from rest_framework import serializers
from .models import Client

class LimitedDataSerializers(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name_of_client', 'registered_date', 'address'] #for regular users

class CompleteDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        field = ['id', 'name_of_client', 'registered_date', 'email', 'contact_no', 'address'] #for admins