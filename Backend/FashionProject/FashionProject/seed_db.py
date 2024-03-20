from FashionProject.models import User
from django.utils import timezone
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help="Seed databse with intial data"

    def handle(self,*args,**options):
        User.objects.all().delete()

        user1 = User.objects.create(field1='value1', field2=123)

