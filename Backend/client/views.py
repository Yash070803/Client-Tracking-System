from django.shortcuts import render
from .models import Client
from .serializers import LimitedDataSerializer, CompleteDataSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User # use this for checks inside the shell

# Create your views here.

class Info(APIView):
    pms = [IsAuthenticated]
    def get(self, request):
        return Response({ 'is_staff' : request.user.is_staff})

class List(APIView):
    pms = [IsAuthenticated]
    def get(self, req):
        clients = Client.objects.all()
        print(f"User: {req.user}, is_staff:{req.user.is_staff}") #
        if req.user.is_staff:
            serializer = CompleteDataSerializer(clients, many=True)
        else:
            serializer = LimitedDataSerializer(clients, many=True)
        return Response(serializer.data)
    
class Edit(APIView):
    pms = [IsAdminUser, IsAuthenticated]
    def put(self, req, id):
        client = Client.objects.get(pk=id)
        serializer = CompleteDataSerializer(client, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class Create(APIView):
    pms = [IsAuthenticated, IsAdminUser]
    def post(self, req):
        serializer = CompleteDataSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class Delete(APIView):
    pms = [IsAuthenticated, IsAdminUser]
    def delete(self, req, id):
        client = Client.objects.get(pk=id)
        client.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)