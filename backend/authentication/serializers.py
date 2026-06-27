from django.contrib.auth.models import User

from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            'username',
            'email',
            'password',
        ]

        extra_kwargs = {
            'password' : {
                'write_only' : True
            }
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists."
            )
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

class RegisterResponseSerializer(serializers.Serializer):

    email = serializers.EmailField(
        help_text="Correo electrónico del usuario."
    ),
    username = serializers.CharField(
        max_length=150,
        help_text="Nombre de usuario único."
    ),

